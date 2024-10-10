'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ClaimFormProps = {
  definitionId: string;
};

export function ClaimForm({ definitionId }: ClaimFormProps) {
  const [nip05, setNip05] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch(`/api/badge/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nip05,
          badgeId: definitionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: 'Badge claimed successfully!' });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to claim badge.',
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/no-unused-vars
    } catch (error: any) {
      setResult({
        success: false,
        message: 'An error occurred while claiming the badge.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Claim NOSTR Badge</CardTitle>
        <CardDescription>
          Enter your NIP-05 address to claim your badge
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nip05">NIP-05 Address</Label>
            <Input
              id="nip05"
              type="text"
              placeholder="you@example.com"
              value={nip05}
              onChange={(e) => setNip05(e.target.value)}
              required
            />
          </div>
          {result && (
            <Alert variant={result.success ? 'default' : 'destructive'}>
              <AlertTitle>{result.success ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : (
              'Claim Badge'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
