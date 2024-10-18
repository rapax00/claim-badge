'use client';

import { useState, useCallback, useEffect } from 'react';
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

import { useCard } from '@/hooks/useCard';
import { ScanAction, ScanCardStatus } from '@/types/card';
import { LNURLResponse, LNURLWStatus } from '@/types/lnurl';

type ClaimFormProps = {
  definitionId: string;
};

export function ClaimForm({ definitionId }: ClaimFormProps) {
  const [nip05, setNip05] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [cardStatus, setCardStatus] = useState<LNURLWStatus>(LNURLWStatus.IDLE);
  const [nfcError, setNfcError] = useState<string | null>(null);
  const { isAvailable, status: scanStatus, scan, stop } = useCard();

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

  const processNfcClaim = useCallback(
    async (response: LNURLResponse) => {
      console.log('processNfcClaim', response);
      alert(`Badge claimed successfully! ${response}`);
      // setCardStatus(LNURLWStatus.CALLBACK);
      // try {
      //   const claimResponse = await fetch(`/api/badge/claim-nfc`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       badgeId: definitionId,
      //       nfcData: response,
      //     }),
      //   });

      //   const data = await claimResponse.json();

      //   if (claimResponse.ok) {
      //     setCardStatus(LNURLWStatus.DONE);
      //     setResult({ success: true, message: 'Badge claimed successfully via NFC!' });
      //   } else {
      //     throw new Error(data.error || 'Failed to claim badge via NFC.');
      //   }
      // } catch (error) {
      //   setCardStatus(LNURLWStatus.ERROR);
      //   setNfcError((error as Error).message);
      //   setResult({
      //     success: false,
      //     message: 'An error occurred while claiming the badge via NFC.',
      //   });
      // }
    },
    [definitionId]
  );

  const startNfcRead = useCallback(async () => {
    try {
      setIsScanning(true);
      setResult(null);
      setNfcError(null);

      const lnurlResponse = await scan(ScanAction.EXTENDED_SCAN);

      if (lnurlResponse.tag === 'laWallet:withdrawRequest') {
        await processNfcClaim(lnurlResponse);
      }
    } catch (e) {
      setCardStatus(LNURLWStatus.ERROR);
      setNfcError((e as Error).message);
    } finally {
      setIsScanning(false);
    }
  }, [scan, processNfcClaim]);

  useEffect(() => {
    switch (scanStatus) {
      case ScanCardStatus.SCANNING:
        setCardStatus(LNURLWStatus.SCANNING);
        break;
      case ScanCardStatus.REQUESTING:
        setCardStatus(LNURLWStatus.REQUESTING);
        break;
      case ScanCardStatus.ERROR:
        setCardStatus(LNURLWStatus.ERROR);
        break;
    }
  }, [scanStatus]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Claim NOSTR Badge</CardTitle>
        <CardDescription>
          Enter your NIP-05 address or use NFC to claim your badge
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
          {nfcError && (
            <Alert variant="destructive">
              <AlertTitle>NFC Error</AlertTitle>
              <AlertDescription>{nfcError}</AlertDescription>
            </Alert>
          )}
          {cardStatus === LNURLWStatus.SCANNING && (
            <Alert>
              <AlertTitle>NFC</AlertTitle>
              <AlertDescription>
                Ready to scan NFC. Please tap your card.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <div className="flex flex-col gap-2 w-full">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                'Claim Badge via NIP-05'
              )}
            </Button>
            {isAvailable && (
              <Button
                type="button"
                className="w-full"
                disabled={isScanning}
                onClick={startNfcRead}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning NFC...
                  </>
                ) : (
                  'Claim Badge via NFC'
                )}
              </Button>
            )}
            <Button
              className="w-full"
              onClick={() => (window.location.href = `/`)}
            >
              Back to Badge Gallery
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
