
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Users, Copy, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHouseGroup } from '@/hooks/useHouseGroup';

interface HouseGroupOnboardingProps {
  onComplete: () => void;
}

const HouseGroupOnboarding: React.FC<HouseGroupOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'choose' | 'create' | 'join' | 'success'>('choose');
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [createdCode, setCreatedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { createHouseGroup, joinHouseGroup, loading, error } = useHouseGroup();

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    const houseGroup = await createHouseGroup(groupName.trim());
    if (houseGroup) {
      setCreatedCode(houseGroup.join_code);
      setStep('success');
      toast({
        title: "House Group Created! 🏠",
        description: `Share the code "${houseGroup.join_code}" with your housemates`,
      });
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) return;

    const success = await joinHouseGroup(joinCode.trim().toUpperCase());
    if (success) {
      onComplete();
      toast({
        title: "Successfully Joined! 🎉",
        description: "Welcome to your house group",
      });
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

  if (step === 'choose') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-maideasy-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-maideasy-navy">
              Join or Create House Group
            </CardTitle>
            <CardDescription>
              Connect with your housemates to share tasks and manage your home together
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setStep('create')}
              className="w-full h-16 bg-maideasy-blue hover:bg-maideasy-blue/90 flex items-center gap-3"
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
              className="w-full h-16 border-2 border-maideasy-blue text-maideasy-blue hover:bg-maideasy-blue hover:text-white flex items-center gap-3"
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
            <CardTitle className="text-xl font-bold text-maideasy-navy">Create House Group</CardTitle>
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
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || loading}
                className="flex-1 bg-maideasy-blue hover:bg-maideasy-blue/90"
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
            <CardTitle className="text-xl font-bold text-maideasy-navy">Join House Group</CardTitle>
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
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleJoinGroup}
                disabled={joinCode.length !== 6 || loading}
                className="flex-1 bg-maideasy-blue hover:bg-maideasy-blue/90"
              >
                {loading ? 'Joining...' : 'Join Group'}
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
            <CardTitle className="text-xl font-bold text-maideasy-navy">
              House Group Created! 🎉
            </CardTitle>
            <CardDescription>
              Share this code with your housemates so they can join
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
              <div className="text-2xl font-mono font-bold text-maideasy-navy tracking-wider">
                {createdCode}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="mt-2 text-maideasy-blue hover:text-maideasy-blue/80"
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
              className="w-full bg-maideasy-blue hover:bg-maideasy-blue/90"
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
