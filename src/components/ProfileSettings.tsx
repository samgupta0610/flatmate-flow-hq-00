
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Home, Code } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useProfile } from '@/hooks/useProfile';
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';

const ProfileSettings: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();
  const { houseGroup } = useHouseGroupInfo();

  useEffect(() => {
    if (profile) {
      setUserName(profile.username || '');
      setFlatNumber(profile.phone_number || ''); // Using phone_number field for flat number
    }
    if (houseGroup) {
      setGroupCode(houseGroup.join_code || '');
    }
  }, [profile, houseGroup]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await updateProfile({
        username: userName,
        phone_number: flatNumber, // Using phone_number field for flat number
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
    // Reset to original values
    setUserName(profile?.username || '');
    setFlatNumber(profile?.phone_number || '');
    setGroupCode(houseGroup?.join_code || '');
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Settings
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

        {/* Display Current Info */}
        <div className="pt-4 border-t space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Current Profile</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <p className="font-medium">{userName || 'Not set'}</p>
            </div>
            <div>
              <span className="text-gray-500">Flat:</span>
              <p className="font-medium">{flatNumber || 'Not set'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
