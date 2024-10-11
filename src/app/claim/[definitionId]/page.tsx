import { ClaimForm } from '@/components/ClaimForm';
import { InjectedNFCProvider } from '@/context/InjectedNFC';

type Props = {
  params: { definitionId: string };
};

export default function Page(props: Props) {
  const { params } = props;

  return (
    <InjectedNFCProvider>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ClaimForm definitionId={params.definitionId} />
      </div>
    </InjectedNFCProvider>
  );
}
