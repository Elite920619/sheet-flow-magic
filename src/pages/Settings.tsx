
import React, { useState } from 'react';
import Header from '@/components/Header';
import CanvasBackground from '@/components/CanvasBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings2, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Moon, 
  Sun, 
  Lock, 
  Mail, 
  Phone, 
  CreditCard,
  Globe,
  Smartphone,
  Key,
  Eye,
  EyeOff,
  DollarSign,
  Target,
  BarChart3,
  Zap,
  Save,
  LogOut
} from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    username: profile?.username || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    country: profile?.country || '',
    timezone: 'EST',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    valueBets: true,
    priceChanges: true,
    weeklyReport: false
  });

  const [bettingPreferences, setBettingPreferences] = useState({
    autoRefresh: true,
    soundAlerts: false,
    compactView: false,
    showProbabilities: true,
    defaultSport: 'all',
    currency: 'USD',
    defaultStake: 10,
    maxStake: 1000,
    oddsFormat: 'decimal',
    quickBetAmounts: [5, 10, 25, 50, 100],
    autoAcceptOddsChanges: false,
    showLiveScores: true,
    enableCashOut: true,
    riskManagement: true
  });

  // Update form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        username: profile.username || '',
        phone: profile.phone || '',
        country: profile.country || ''
      }));
    }
  }, [profile]);

  const handleSavePersonalInfo = async () => {
    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        phone: formData.phone,
        country: formData.country
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleNotificationSave = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleBettingPreferencesSave = () => {
    toast({
      title: "Betting Preferences Updated",
      description: "Your betting preferences have been saved.",
    });
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-transparent text-foreground relative overflow-hidden">
        <CanvasBackground />
        <Header />
        
        <div className="relative z-10 flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-transparent text-foreground relative overflow-hidden">
      <CanvasBackground />
      <Header />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Settings2 className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-slate-200">Settings</h1>
          </div>
          <p className="text-slate-400">
            Manage your account settings and betting preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50">
            <TabsTrigger value="general" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">General</TabsTrigger>
            <TabsTrigger value="betting" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">Betting</TabsTrigger>
            <TabsTrigger value="account" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">Account</TabsTrigger>
            <TabsTrigger value="security" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">Notifications</TabsTrigger>
            <TabsTrigger value="appearance" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">Appearance</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <User className="h-5 w-5 mr-2 text-blue-400" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-300">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    placeholder="Choose a unique username"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-slate-300">Country</Label>
                    <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800/50">
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-slate-300">Timezone</Label>
                    <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800/50">
                        <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                        <SelectItem value="CST">Central Time (CST)</SelectItem>
                        <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                        <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                        <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleSavePersonalInfo}
                  disabled={updateProfile.isPending || isSaving}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Betting Settings */}
          <TabsContent value="betting">
            <div className="grid gap-6">
              <Card className="bg-card/90 backdrop-blur-sm border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Target className="h-5 w-5 mr-2 text-blue-500" />
                    Betting Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultStake" className="text-foreground">Default Stake Amount ($)</Label>
                      <Input
                        id="defaultStake"
                        type="number"
                        value={bettingPreferences.defaultStake}
                        onChange={(e) => setBettingPreferences({ ...bettingPreferences, defaultStake: Number(e.target.value) })}
                        className="bg-background border-border text-foreground"
                        min="1"
                        max="10000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxStake" className="text-foreground">Maximum Stake Amount ($)</Label>
                      <Input
                        id="maxStake"
                        type="number"
                        value={bettingPreferences.maxStake}
                        onChange={(e) => setBettingPreferences({ ...bettingPreferences, maxStake: Number(e.target.value) })}
                        className="bg-background border-border text-foreground"
                        min="10"
                        max="100000"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="autoRefresh" className="text-foreground font-medium">Auto-refresh odds</Label>
                      <p className="text-sm text-muted-foreground">Automatically update odds every minute</p>
                    </div>
                    <Switch
                      id="autoRefresh"
                      checked={bettingPreferences.autoRefresh}
                      onCheckedChange={(checked) => setBettingPreferences({ ...bettingPreferences, autoRefresh: checked })}
                    />
                  </div>
                  
                  <Separator className="bg-border" />
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="soundAlerts" className="text-foreground font-medium">Sound alerts</Label>
                      <p className="text-sm text-muted-foreground">Play sound for value bet notifications</p>
                    </div>
                    <Switch
                      id="soundAlerts"
                      checked={bettingPreferences.soundAlerts}
                      onCheckedChange={(checked) => setBettingPreferences({ ...bettingPreferences, soundAlerts: checked })}
                    />
                  </div>
                  
                  <Separator className="bg-border" />
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="enableCashOut" className="text-foreground font-medium">Enable Cash Out</Label>
                      <p className="text-sm text-muted-foreground">Allow early settlement of bets</p>
                    </div>
                    <Switch
                      id="enableCashOut"
                      checked={bettingPreferences.enableCashOut}
                      onCheckedChange={(checked) => setBettingPreferences({ ...bettingPreferences, enableCashOut: checked })}
                    />
                  </div>
                  
                  <Separator className="bg-border" />
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="riskManagement" className="text-foreground font-medium">Risk Management</Label>
                      <p className="text-sm text-muted-foreground">Enable betting limits and warnings</p>
                    </div>
                    <Switch
                      id="riskManagement"
                      checked={bettingPreferences.riskManagement}
                      onCheckedChange={(checked) => setBettingPreferences({ ...bettingPreferences, riskManagement: checked })}
                    />
                  </div>

                  <Button 
                    onClick={handleBettingPreferencesSave}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Betting Preferences
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account">
            <div className="grid gap-6">
              <Card className="bg-card/90 backdrop-blur-sm border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Mail className="h-5 w-5 mr-2 text-blue-500" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email Address</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-background border-border text-foreground"
                        disabled
                      />
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Verified
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-background border-border text-foreground"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <Button 
                    onClick={handleSavePersonalInfo}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update Contact Info
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/90 backdrop-blur-sm border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <Shield className="h-5 w-5 mr-2" />
                    Account Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
                    <div>
                      <h4 className="font-medium text-foreground">Sign Out</h4>
                      <p className="text-sm text-muted-foreground">Sign out of your account</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="border-border text-foreground hover:bg-muted">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card className="bg-card/90 backdrop-blur-sm border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Lock className="h-5 w-5 mr-2 text-blue-500" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-foreground">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="bg-background border-border text-foreground pr-10"
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-foreground">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="bg-background border-border text-foreground"
                    placeholder="Enter new password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-background border-border text-foreground"
                    placeholder="Confirm new password"
                  />
                </div>

                <Button 
                  onClick={handlePasswordChange}
                  disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card className="bg-card/90 backdrop-blur-sm border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Bell className="h-5 w-5 mr-2 text-blue-500" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center text-foreground">
                    <Mail className="h-4 w-4 mr-2 text-blue-400" />
                    Email Notifications
                  </h4>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="emailNotifs" className="text-foreground font-medium">General emails</Label>
                      <p className="text-sm text-muted-foreground">Account updates and security alerts</p>
                    </div>
                    <Switch
                      id="emailNotifs"
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="valueBetEmails" className="text-foreground font-medium">Value bet alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified of high-value betting opportunities</p>
                    </div>
                    <Switch
                      id="valueBetEmails"
                      checked={notifications.valueBets}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, valueBets: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="weeklyReport" className="text-foreground font-medium">Weekly reports</Label>
                      <p className="text-sm text-muted-foreground">Summary of your betting performance</p>
                    </div>
                    <Switch
                      id="weeklyReport"
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
                    />
                  </div>
                </div>

                <Separator className="bg-border" />

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center text-foreground">
                    <Smartphone className="h-4 w-4 mr-2 text-blue-400" />
                    Push Notifications
                  </h4>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="pushNotifs" className="text-foreground font-medium">Browser notifications</Label>
                      <p className="text-sm text-muted-foreground">Real-time alerts in your browser</p>
                    </div>
                    <Switch
                      id="pushNotifs"
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="priceChanges" className="text-foreground font-medium">Price changes</Label>
                      <p className="text-sm text-muted-foreground">When odds change significantly</p>
                    </div>
                    <Switch
                      id="priceChanges"
                      checked={notifications.priceChanges}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, priceChanges: checked })}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleNotificationSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance">
            <Card className="bg-card/90 backdrop-blur-sm border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Palette className="h-5 w-5 mr-2 text-blue-500" />
                  Appearance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="themeToggle" className="flex items-center text-foreground font-medium">
                      {theme === 'dark' ? <Moon className="h-4 w-4 mr-2 text-blue-400" /> : <Sun className="h-4 w-4 mr-2 text-yellow-500" />}
                      Dark Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {theme === 'dark' ? 'Currently using dark theme' : 'Currently using light theme'}
                    </p>
                  </div>
                  <Switch
                    id="themeToggle"
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>

                <Separator className="bg-border" />

                <div className="space-y-4">
                  <Label className="text-foreground font-medium">Theme Preview</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-card text-foreground border-border">
                      <h4 className="font-medium mb-2 text-foreground">Light Theme</h4>
                      <div className="space-y-2">
                        <div className="h-2 bg-blue-200 rounded"></div>
                        <div className="h-2 bg-green-200 rounded w-3/4"></div>
                        <div className="h-2 bg-purple-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-muted text-foreground border-border">
                      <h4 className="font-medium mb-2 text-foreground">Dark Theme</h4>
                      <div className="space-y-2">
                        <div className="h-2 bg-blue-600 rounded"></div>
                        <div className="h-2 bg-green-600 rounded w-3/4"></div>
                        <div className="h-2 bg-purple-600 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="compactView" className="text-foreground font-medium">Compact view</Label>
                    <p className="text-sm text-muted-foreground">Show more information in less space</p>
                  </div>
                  <Switch
                    id="compactView"
                    checked={bettingPreferences.compactView}
                    onCheckedChange={(checked) => setBettingPreferences({ ...bettingPreferences, compactView: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
