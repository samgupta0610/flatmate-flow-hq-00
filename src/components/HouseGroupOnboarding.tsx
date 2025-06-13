
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Users, Copy, Check, User, Phone, UserCheck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHouseGroup } from '@/hooks/useHouseGroup';
import { useProfile } from '@/hooks/useProfile';
import { useHouseholdContacts } from '@/hooks/useHouseholdContacts';

interface HouseGroupOnboardingProps {
  onComplete: () => void;
}

const HouseGroupOnboarding: React.FC<HouseGroupOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'name' | 'choose' | 'create' | 'join' | 'contacts' | 'success'>('name');
  const [userName, setUserName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [createdCode, setCreatedCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Household contacts state
  const [cookName, setCookName] = useState('');
  const [cookPhone, setCookPhone] = useState('');
  const [maidName, setMaidName] = useState('');
  const [maidPhone, setMaidPhone] = useState('');
  
  const { toast } = useToast();
  const { createHouseGroup, joinHouseGroup, loading, error } = useHouseGroup();
  const { updateProfile } = useProfile();
  const { addContact } = useHouseholdContacts();

  const handleNameSubmit = async () => {
    if (!userName.trim()) return;
    
    // Save the user name to profile
    await updateProfile({ username: userName.trim() });
    setStep('choose');
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    const houseGroup = await createHouseGroup(groupName.trim());
    if (houseGroup) {
      setCreatedCode(houseGroup.join_code);
      setStep('contacts');
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) return;

    const success = await joinHouseGroup(joinCode.trim().toUpperCase());
    if (success) {
      setStep('contacts');
    }
  };

  const handleContactsSubmit = async () => {
    try {
      // Add cook contact if provided
      if (cookName.trim() && cookPhone.trim()) {
        await addContact({
          contact_type: 'cook',
          name: cookName.trim(),
          phone_number: cookPhone.trim()
        });
      }

      // Add maid contact if provided
      if (maidName.trim() && maidPhone.trim()) {
        await addContact({
          contact_type: 'maid',
          name: maidName.trim(),
          phone_number: maidPhone.trim()
        });
      }

      if (createdCode) {
        setStep('success');
      } else {
        onComplete();
        toast({
          title: "Setup Complete! 🎉",
          description: "Welcome to your house group",
        });
      }
    } catch (error) {
      console.error('Error saving contacts:', error);
      // Continue anyway since contacts are optional
      if (createdCode) {
        setStep('success');
      } else {
        onComplete();
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(createdCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Join code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the code manually",
        variant: "destructive",
      });
    }
  };

  // New name collection step
  if (step === 'name') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-maideasy-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-maideasy-secondary">
              Welcome to MaidEasy! 👋
            </CardTitle>
            <CardDescription>
              Let's start by getting to know you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">What's your name?</Label>
              <Input
                id="userName"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="text-base h-12"
              />
            </div>
            
            <Button
              onClick={handleNameSubmit}
              disabled={!userName.trim()}
              className="w-full h-12 bg-maideasy-primary hover:bg-maideasy-primary/90 text-white font-medium text-base shadow-lg"
            >
              <User className="w-5 h-5 mr-2" />
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'choose') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-maideasy-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-maideasy-secondary">
              Hi {userName}! 👋
            </CardTitle>
            <CardDescription>
              Connect with your housemates to share tasks and manage your home together
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setStep('create')}
              className="w-full h-16 bg-maideasy-primary hover:bg-maideasy-primary/90 text-white font-medium shadow-lg flex items-center gap-3"
            >
              <Home className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">Create a New House Group</div>
                <div className="text-sm opacity-90">Start fresh with your household</div>
              </div>
            </Button>
            
            <Button
              onClick={() => setStep('join')}
              variant="outline"
              className="w-full h-16 border-2 border-maideasy-primary text-maideasy-primary hover:bg-maideasy-primary hover:text-white font-medium shadow-lg flex items-center gap-3"
            >
              <Users className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">Join an Existing Group</div>
                <div className="text-sm opacity-70">Enter your housemate's invite code</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'create') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-maideasy-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-maideasy-secondary">Create House Group</CardTitle>
            <CardDescription>
              Give your house group a name that everyone will recognize
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="e.g., Flat 102, The Green House"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="text-base h-12"
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('choose')}
                className="flex-1 h-12 font-medium"
              >
                Back
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || loading}
                className="flex-1 h-12 bg-maideasy-primary hover:bg-maideasy-primary/90 text-white font-medium shadow-lg"
              >
                {loading ? 'Creating...' : 'Create Group'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'join') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-maideasy-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-maideasy-secondary">Join House Group</CardTitle>
            <CardDescription>
              Enter the 6-character code shared by your housemate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="joinCode">Invite Code</Label>
              <Input
                id="joinCode"
                placeholder="e.g., X3F1Z7"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="text-base h-12 text-center font-mono text-lg tracking-wider"
                maxLength={6}
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('choose')}
                className="flex-1 h-12 font-medium"
              >
                Back
              </Button>
              <Button
                onClick={handleJoinGroup}
                disabled={joinCode.length !== 6 || loading}
                className="flex-1 h-12 bg-maideasy-primary hover:bg-maideasy-primary/90 text-white font-medium shadow-lg"
              >
                {loading ? 'Joining...' : 'Join Group'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'contacts') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-maideasy-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-maideasy-secondary flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Add Household Contacts
            </CardTitle>
            <CardDescription>
              Add your cook and maid contacts (optional - you can skip this step)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Cook Details (Optional)</Label>
                <Input
                  placeholder="Cook's name"
                  value={cookName}
                  onChange={(e) => setCookName(e.target.value)}
                  className="h-10"
                />
                <Input
                  placeholder="Cook's phone number"
                  value={cookPhone}
                  onChange={(e) => setCookPhone(e.target.value)}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Maid Details (Optional)</Label>
                <Input
                  placeholder="Maid's name"
                  value={maidName}
                  onChange={(e) => setMaidName(e.target.value)}
                  className="h-10"
                />
                <Input
                  placeholder="Maid's phone number"
                  value={maidPhone}
                  onChange={(e) => setMaidPhone(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleContactsSubmit}
                className="flex-1 h-12 font-medium"
              >
                Skip
              </Button>
              <Button
                onClick={handleContactsSubmit}
                className="flex-1 h-12 bg-maideasy-primary hover:bg-maideasy-primary/90 text-white font-medium shadow-lg"
              >
                <Phone className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-maideasy-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-maideasy-secondary">
              House Group Created! 🎉
            </CardTitle>
            <CardDescription>
              Share this code with your housemates so they can join
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
              <div className="text-2xl font-mono font-bold text-maideasy-secondary tracking-wider">
                {createdCode}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="mt-2 text-maideasy-primary hover:text-maideasy-primary/80"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            
            <Button
              onClick={onComplete}
              className="w-full h-12 bg-maideasy-primary hover:bg-maideasy-primary/90 text-white font-medium shadow-lg"
            >
              Continue to MaidEasy
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default HouseGroupOnboarding;
