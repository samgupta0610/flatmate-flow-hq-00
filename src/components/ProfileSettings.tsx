
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch, FormControlLabel } from '@mui/material';
import { User, Home, Code, Mail, Globe, Palette } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useProfile } from '@/hooks/useProfile';
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/contexts/ThemeContext';
import HouseholdContactsManager from './HouseholdContactsManager';
import VendorContactsManager from './VendorContactsManager';

const ProfileSettings: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('english');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();
  const { houseGroup } = useHouseGroupInfo();
  const { user } = useAuth();
  const { mode, setTheme } = useTheme();

  useEffect(() => {
    if (profile) {
      setUserName(profile.username || '');
      setFlatNumber(profile.phone_number || '');
      setPreferredLanguage(profile.preferred_language || 'english');
    }
    if (houseGroup) {
      setGroupCode(houseGroup.join_code || '');
    }
    if (user) {
      setUserEmail(user.email || '');
    }
  }, [profile, houseGroup, user]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await updateProfile({
        username: userName,
        phone_number: flatNumber,
        preferred_language: preferredLanguage,
      });
      
      setIsEditing(false);
      toast({
        title: "Profile Updated! ✅",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setUserName(profile?.username || '');
    setFlatNumber(profile?.phone_number || '');
    setPreferredLanguage(profile?.preferred_language || 'english');
    setGroupCode(houseGroup?.join_code || '');
    setUserEmail(user?.email || '');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Manage your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="user-name"
                type="text"
                placeholder="Enter your full name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="user-email"
                type="email"
                value={userEmail}
                disabled={true}
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">
                Email cannot be changed here. Please contact support if needed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flat-number" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Flat Number
              </Label>
              <Input
                id="flat-number"
                type="text"
                placeholder="e.g. 101, A-25, etc."
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred-language" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Preferred Language
              </Label>
              <Select value={preferredLanguage} onValueChange={setPreferredLanguage} disabled={!isEditing}>
                <SelectTrigger id="preferred-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                  <SelectItem value="telugu">Telugu</SelectItem>
                  <SelectItem value="kannada">Kannada</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Default language for task messages and notifications.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group-code" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                House Group Code
              </Label>
              <Input
                id="group-code"
                type="text"
                value={groupCode}
                disabled={true}
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">
                This is your house group's unique code. Share it with others to invite them.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-maideasy-primary hover:bg-maideasy-primary/90"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>

          <div className="pt-4 border-t space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Current Profile</h4>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>
                <p className="font-medium">{userName || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <p className="font-medium">{userEmail || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-500">Flat:</span>
                <p className="font-medium">{flatNumber || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-500">Language:</span>
                <p className="font-medium">{preferredLanguage ? preferredLanguage.charAt(0).toUpperCase() + preferredLanguage.slice(1) : 'English'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Switch
            checked={mode === 'dark'}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            color="primary"
          />
        </CardContent>
      </Card>

      {/* Household Contacts Manager */}
      <HouseholdContactsManager />

      {/* Vendor Contacts Manager */}
      <VendorContactsManager />
    </div>
  );
};

export default ProfileSettings;
