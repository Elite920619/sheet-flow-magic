
-- Create wallet accounts table for internal balance tracking
CREATE TABLE public.wallet_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'main' CHECK (account_type IN ('main', 'bonus', 'escrow')),
  balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'suspended', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, account_type, currency)
);

-- Create wallet transactions table for detailed transaction history
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wallet_account_id UUID REFERENCES public.wallet_accounts(id) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'bet_debit', 'bet_credit', 'bonus', 'adjustment', 'refund')),
  amount DECIMAL(15,2) NOT NULL,
  balance_before DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'processing')),
  payment_method TEXT CHECK (payment_method IN ('stripe', 'paypal', 'bank_transfer', 'card', 'crypto')),
  external_reference TEXT, -- Reference to external payment processor
  description TEXT,
  metadata JSONB DEFAULT '{}',
  processed_by UUID REFERENCES auth.users(id), -- For admin actions
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create KYC/verification table
CREATE TABLE public.user_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  kyc_status TEXT NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected', 'expired')),
  identity_verified BOOLEAN DEFAULT false,
  address_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  verification_level INTEGER DEFAULT 1 CHECK (verification_level BETWEEN 1 AND 3),
  daily_limit DECIMAL(10,2) DEFAULT 1000.00,
  monthly_limit DECIMAL(10,2) DEFAULT 10000.00,
  documents_uploaded JSONB DEFAULT '[]',
  verification_notes TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create withdrawal requests table
CREATE TABLE public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wallet_transaction_id UUID REFERENCES public.wallet_transactions(id),
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  withdrawal_method TEXT NOT NULL CHECK (withdrawal_method IN ('bank_transfer', 'paypal', 'crypto', 'check')),
  destination_details JSONB NOT NULL, -- Bank details, PayPal email, crypto address, etc.
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing', 'completed', 'failed')),
  admin_notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create admin audit log table
CREATE TABLE public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) NOT NULL,
  target_user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wallet_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallet_accounts
CREATE POLICY "Users can view their own wallet accounts" ON public.wallet_accounts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can manage wallet accounts" ON public.wallet_accounts
  FOR ALL USING (true);

-- RLS Policies for wallet_transactions
CREATE POLICY "Users can view their own transactions" ON public.wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can manage transactions" ON public.wallet_transactions
  FOR ALL USING (true);

-- RLS Policies for user_verification
CREATE POLICY "Users can view their own verification" ON public.user_verification
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own verification" ON public.user_verification
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service can manage verification" ON public.user_verification
  FOR ALL USING (true);

-- RLS Policies for withdrawal_requests
CREATE POLICY "Users can view their own withdrawal requests" ON public.withdrawal_requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create withdrawal requests" ON public.withdrawal_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service can manage withdrawal requests" ON public.withdrawal_requests
  FOR ALL USING (true);

-- RLS Policies for admin_actions (admin only)
CREATE POLICY "Service can manage admin actions" ON public.admin_actions
  FOR ALL USING (true);

-- Create function to handle wallet balance updates atomically
CREATE OR REPLACE FUNCTION public.process_wallet_transaction(
  p_user_id UUID,
  p_transaction_type TEXT,
  p_amount DECIMAL(15,2),
  p_description TEXT DEFAULT NULL,
  p_external_reference TEXT DEFAULT NULL,
  p_payment_method TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_current_balance DECIMAL(15,2);
  v_new_balance DECIMAL(15,2);
  v_transaction_id UUID;
BEGIN
  -- Get or create wallet account
  SELECT id, balance INTO v_wallet_id, v_current_balance
  FROM public.wallet_accounts
  WHERE user_id = p_user_id AND account_type = 'main' AND currency = 'USD';
  
  IF v_wallet_id IS NULL THEN
    INSERT INTO public.wallet_accounts (user_id, balance)
    VALUES (p_user_id, 0.00)
    RETURNING id, balance INTO v_wallet_id, v_current_balance;
  END IF;
  
  -- Calculate new balance
  IF p_transaction_type IN ('deposit', 'bet_credit', 'bonus', 'refund') THEN
    v_new_balance := v_current_balance + p_amount;
  ELSE
    v_new_balance := v_current_balance - p_amount;
  END IF;
  
  -- Check for sufficient funds on debits
  IF v_new_balance < 0 AND p_transaction_type IN ('withdrawal', 'bet_debit') THEN
    RAISE EXCEPTION 'Insufficient funds. Current balance: %, Required: %', v_current_balance, p_amount;
  END IF;
  
  -- Create transaction record
  INSERT INTO public.wallet_transactions (
    user_id, wallet_account_id, transaction_type, amount, 
    balance_before, balance_after, description, external_reference, 
    payment_method, metadata, status
  ) VALUES (
    p_user_id, v_wallet_id, p_transaction_type, p_amount,
    v_current_balance, v_new_balance, p_description, p_external_reference,
    p_payment_method, p_metadata, 'completed'
  ) RETURNING id INTO v_transaction_id;
  
  -- Update wallet balance
  UPDATE public.wallet_accounts 
  SET balance = v_new_balance, updated_at = now()
  WHERE id = v_wallet_id;
  
  RETURN v_transaction_id;
END;
$$;

-- Create function to handle new user wallet setup
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  -- Create main wallet account
  INSERT INTO public.wallet_accounts (user_id, balance)
  VALUES (NEW.id, 0.00);
  
  -- Create verification record
  INSERT INTO public.user_verification (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user wallet setup
CREATE TRIGGER on_auth_user_created_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_wallet();

-- Create indexes for performance
CREATE INDEX idx_wallet_accounts_user_id ON public.wallet_accounts(user_id);
CREATE INDEX idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_created_at ON public.wallet_transactions(created_at DESC);
CREATE INDEX idx_withdrawal_requests_user_id ON public.withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON public.withdrawal_requests(status);
CREATE INDEX idx_user_verification_user_id ON public.user_verification(user_id);
CREATE INDEX idx_admin_actions_admin_user_id ON public.admin_actions(admin_user_id);
CREATE INDEX idx_admin_actions_created_at ON public.admin_actions(created_at DESC);
