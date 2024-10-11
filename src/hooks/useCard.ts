// React/Next
import { useCallback, useState } from 'react';

// Thirdparty
import axios from 'axios';
import { normalizeLNURL } from '@/lib/utils';

// Types
import { ScanCardStatus, ScanAction } from '@/types/card';
import { LNURLResponse } from '@/types/lnurl';

// Hooks
import { useNfc } from 'use-nfc-hook';
import { useInjectedNFC } from './useInjectedNFC';

export type CardReturns = {
  isAvailable: boolean;
  permission: string;
  status: ScanCardStatus;
  requestLNURL: (url: string, type: ScanAction) => Promise<LNURLResponse>;
  scanURL: () => Promise<string>;
  scan: (type?: ScanAction) => Promise<LNURLResponse>;
  stop: () => void;
};

const FEDERATION_ID = process.env.NEXT_PUBLIC_FEDERATION_ID!;

const requestLNURL = async (url: string, type?: ScanAction) => {
  const normalizedUrl = normalizeLNURL(url);
  const headers = type
    ? {
        'Content-Type': 'application/json',
        'X-LaWallet-Action': type,
        'X-LaWallet-Param': `federationId=${FEDERATION_ID}, tokens=BTC`,
      }
    : { 'Content-Type': 'application/json' };

  let response;
  try {
    response = await axios.get(normalizedUrl, {
      headers: headers,
    });
  } catch (e) {
    throw new Error('RESPONSE: ' + JSON.stringify((e as Error).message));
  }

  if (response.status < 200 || response.status >= 300) {
    // alert(JSON.stringify(response.data))
    throw new Error('Hubo un error: ' + JSON.stringify(response.data));
  }

  return response.data;
};

export const useCard = (): CardReturns => {
  const {
    isNDEFAvailable,
    permission,
    read,
    abortReadCtrl: abortReadNativeCtrl,
  } = useNfc();
  const {
    isAvailable: isInjectedAvailable,
    read: readInjected,
    abortReadCtrl: abortReadInjectedCtrl,
  } = useInjectedNFC();
  const [status, setStatus] = useState<ScanCardStatus>(ScanCardStatus.IDLE);

  const readNative = useCallback(async (): Promise<string> => {
    const response = await read();
    const record = response.message.records[0];
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(record.data);
  }, [read]);

  const scan = async (type?: ScanAction): Promise<LNURLResponse> => {
    setStatus(ScanCardStatus.SCANNING);
    let url = '';
    try {
      url = await scanURL();
    } catch (error) {
      alert('ALERT on reading: ' + JSON.stringify(error));
      console.log('ERROR ', error);
      setStatus(ScanCardStatus.ERROR);
      throw error;
    }

    setStatus(ScanCardStatus.REQUESTING);
    const response = await requestLNURL(url, type);
    setStatus(ScanCardStatus.DONE);
    if (response?.status === 'ERROR') {
      throw new Error(response.reason);
    }
    return response;
  };

  const scanURL = async (): Promise<string> => {
    const response = await (isInjectedAvailable
      ? readInjected()
      : readNative());
    return response.replace('lnurlw://', 'https://');
  };

  return {
    isAvailable: isInjectedAvailable || !!isNDEFAvailable,
    permission,
    status,
    requestLNURL,
    scan,
    scanURL,
    stop: isInjectedAvailable ? abortReadInjectedCtrl : abortReadNativeCtrl,
  };
};
