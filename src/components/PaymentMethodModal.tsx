
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Mail } from 'lucide-react';
import { useAddPaymentMethod } from '@/hooks/useBetting';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ isOpen, onClose }) => {
  const [cardData, setCardData] = useState({
    card_number: '',
    card_holder_name: '',
    card_expiry: '',
    card_cvv: '',
    is_default: false
  });

  const [paypalData, setPaypalData] = useState({
    paypal_email: '',
    is_default: false
  });

  const addPaymentMethod = useAddPaymentMethod();

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPaymentMethod.mutate({
      type: 'card',
      ...cardData
    }, {
      onSuccess: () => {
        onClose();
        setCardData({
          card_number: '',
          card_holder_name: '',
          card_expiry: '',
          card_cvv: '',
          is_default: false
        });
      }
    });
  };

  const handlePaypalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPaymentMethod.mutate({
      type: 'paypal',
      ...paypalData
    }, {
      onSuccess: () => {
        onClose();
        setPaypalData({
          paypal_email: '',
          is_default: false
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Payment Method</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="card" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">Credit Card</TabsTrigger>
            <TabsTrigger value="paypal">PayPal</TabsTrigger>
          </TabsList>

          <TabsContent value="card">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Credit/Debit Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCardSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card_number">Card Number</Label>
                    <Input
                      id="card_number"
                      type="text"
                      value={cardData.card_number}
                      onChange={(e) => setCardData({ ...cardData, card_number: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card_holder_name">Cardholder Name</Label>
                    <Input
                      id="card_holder_name"
                      type="text"
                      value={cardData.card_holder_name}
                      onChange={(e) => setCardData({ ...cardData, card_holder_name: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card_expiry">Expiry Date</Label>
                      <Input
                        id="card_expiry"
                        type="text"
                        value={cardData.card_expiry}
                        onChange={(e) => setCardData({ ...cardData, card_expiry: e.target.value })}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card_cvv">CVV</Label>
                      <Input
                        id="card_cvv"
                        type="text"
                        value={cardData.card_cvv}
                        onChange={(e) => setCardData({ ...cardData, card_cvv: e.target.value })}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="card_default"
                      checked={cardData.is_default}
                      onCheckedChange={(checked) => setCardData({ ...cardData, is_default: checked })}
                    />
                    <Label htmlFor="card_default">Set as default payment method</Label>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={addPaymentMethod.isPending}>
                    {addPaymentMethod.isPending ? 'Adding...' : 'Add Card'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paypal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  PayPal Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaypalSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypal_email">PayPal Email</Label>
                    <Input
                      id="paypal_email"
                      type="email"
                      value={paypalData.paypal_email}
                      onChange={(e) => setPaypalData({ ...paypalData, paypal_email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="paypal_default"
                      checked={paypalData.is_default}
                      onCheckedChange={(checked) => setPaypalData({ ...paypalData, is_default: checked })}
                    />
                    <Label htmlFor="paypal_default">Set as default payment method</Label>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={addPaymentMethod.isPending}>
                    {addPaymentMethod.isPending ? 'Adding...' : 'Add PayPal'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodModal;
