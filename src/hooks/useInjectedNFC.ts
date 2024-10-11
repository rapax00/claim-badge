import { InjectedNFCContext } from '@/context/InjectedNFC';
import { useContext } from 'react';

interface PrintReturns {
  isAvailable: boolean;
  read: () => Promise<string>;
  abortReadCtrl: () => void;
}

export const useInjectedNFC = (): PrintReturns => {
  const { isAvailable, subscribe, unsubscribe } =
    useContext(InjectedNFCContext);

  return {
    isAvailable,
    read: subscribe,
    abortReadCtrl: unsubscribe,
  };
};
