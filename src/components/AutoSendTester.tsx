import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Play, TestTube, Clock } from 'lucide-react';

const AutoSendTester = () => {
  const [isTestingNow, setIsTestingNow] = useState(false);
  const [isTestingForce, setIsTestingForce] = useState(false);
  const { toast } = useToast();

  const testAutoSendNow = async () => {
    setIsTestingNow(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-auto-send', {
        body: { forceTest: false }
      });

      if (error) throw error;

      toast({
        title: "Auto-Send Test Completed ✅",
        description: data.message || "Test executed successfully",
      });

      console.log('Test result:', data);
    } catch (error: any) {
      console.error('Auto-send test error:', error);
      toast({
        title: "Test Failed",
        description: error.message || 'Failed to test auto-send',
        variant: "destructive"
      });
    } finally {
      setIsTestingNow(false);
    }
  };

  const testAutoSendForce = async () => {
    setIsTestingForce(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-auto-send', {
        body: { forceTest: true }
      });

      if (error) throw error;

      toast({
        title: "Force Test Completed ✅",
        description: "Contact time updated to current time and test executed",
      });

      console.log('Force test result:', data);
    } catch (error: any) {
      console.error('Force auto-send test error:', error);
      toast({
        title: "Force Test Failed",
        description: error.message || 'Failed to force test auto-send',
        variant: "destructive"
      });
    } finally {
      setIsTestingForce(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Auto-Send Testing
        </CardTitle>
        <CardDescription>
          Test the auto-send functionality to ensure it's working correctly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Regular Test</h4>
            <p className="text-xs text-muted-foreground">
              Tests with current schedule settings
            </p>
            <Button 
              onClick={testAutoSendNow}
              disabled={isTestingNow || isTestingForce}
              className="w-full"
              variant="outline"
            >
              {isTestingNow ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Test Now
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Force Test</h4>
            <p className="text-xs text-muted-foreground">
              Updates schedule to current time and tests immediately
            </p>
            <Button 
              onClick={testAutoSendForce}
              disabled={isTestingNow || isTestingForce}
              className="w-full"
            >
              {isTestingForce ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Force Testing...
                </>
              ) : (
                <>
                  <TestTube className="mr-2 h-4 w-4" />
                  Force Test
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg">
          <h5 className="text-sm font-medium mb-2">How Testing Works:</h5>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong>Regular Test:</strong> Checks if auto-send should trigger based on current schedule</li>
            <li>• <strong>Force Test:</strong> Temporarily updates send time to current time for immediate testing</li>
            <li>• Both tests will show results in toast notifications and console logs</li>
            <li>• Check the browser console for detailed execution logs</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoSendTester;