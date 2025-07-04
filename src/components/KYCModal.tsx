
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Upload,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useKYC, UserVerification } from '@/hooks/useKYC';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  kyc: UserVerification | null;
}

const KYCModal: React.FC<KYCModalProps> = ({ isOpen, onClose, kyc }) => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const { updateKYC, isUpdating } = useKYC();

  const getVerificationProgress = () => {
    if (!kyc) return 0;
    
    let completed = 0;
    const total = 4;
    
    if (kyc.email_verified) completed++;
    if (kyc.phone_verified) completed++;
    if (kyc.identity_verified) completed++;
    if (kyc.address_verified) completed++;
    
    return (completed / total) * 100;
  };

  const getStatusIcon = (verified: boolean) => {
    return verified ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> :
      <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handlePhoneVerification = () => {
    updateKYC({ phone_verified: true });
  };

  const handleAddressVerification = () => {
    updateKYC({ address_verified: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-blue-600">
            <Shield className="h-5 w-5 mr-2" />
            Identity Verification
          </DialogTitle>
          <DialogDescription>
            Complete your verification to increase your limits and unlock all features
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Verification Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Verification Progress</span>
              <Badge className={getStatusColor(kyc?.kyc_status || 'pending')}>
                {kyc?.kyc_status || 'pending'}
              </Badge>
            </div>
            <Progress value={getVerificationProgress()} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {Math.round(getVerificationProgress())}% Complete
            </div>
          </div>

          {/* Current Limits */}
          <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
            <h4 className="font-medium mb-3 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
              Current Limits
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Daily Limit</div>
                <div className="font-medium">${kyc?.daily_limit?.toFixed(2) || '1,000.00'}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Monthly Limit</div>
                <div className="font-medium">${kyc?.monthly_limit?.toFixed(2) || '10,000.00'}</div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="identity">Identity</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Email Verification</span>
                  </div>
                  {getStatusIcon(kyc?.email_verified || false)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Phone Verification</span>
                    </div>
                    {getStatusIcon(kyc?.phone_verified || false)}
                  </div>
                  
                  {!kyc?.phone_verified && (
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                      <Button 
                        onClick={handlePhoneVerification}
                        disabled={!phone || isUpdating}
                        size="sm"
                      >
                        Verify Phone
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Identity Verification */}
            <TabsContent value="identity" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Identity Document</span>
                  </div>
                  {getStatusIcon(kyc?.identity_verified || false)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Address Verification</span>
                    </div>
                    {getStatusIcon(kyc?.address_verified || false)}
                  </div>
                  
                  {!kyc?.address_verified && (
                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Main St, City, State, ZIP"
                      />
                      <Button 
                        onClick={handleAddressVerification}
                        disabled={!address || isUpdating}
                        size="sm"
                      >
                        Verify Address
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Document Upload */}
            <TabsContent value="documents" className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="font-medium mb-2">Upload Documents</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a government-issued ID and proof of address
                </p>
                <Button variant="outline" disabled>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
              
              {kyc?.documents_uploaded && kyc.documents_uploaded.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium">Uploaded Documents</h5>
                  {kyc.documents_uploaded.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span className="text-sm">{doc.name || `Document ${index + 1}`}</span>
                      <Badge variant="outline">Pending Review</Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KYCModal;
