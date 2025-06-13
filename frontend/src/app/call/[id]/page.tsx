'use client';

import {
  Call,
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import '@stream-io/video-react-sdk/dist/css/styles.css';

import PageLoader from '@/components/PageLoader';
import { useAuthUser } from '@/hooks/useAuthUser';
import { getStreamToken } from '@/lib/friend.api';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const CallPage = () => {
  const params = useParams();
  const callId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const router = useRouter();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user: authUser, isLoading } = useAuthUser();

  const {
    data: tokenData,
    isLoading: tokenLoading,
    error: tokenError,
  } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      // Reset error state
      setError(null);

      if (!STREAM_API_KEY) {
        setError('Stream API key is missing');
        setIsConnecting(false);
        return;
      }

      if (!tokenData || !authUser || !callId) {
        console.log('Missing data:', {
          tokenData: !!tokenData,
          authUser: !!authUser,
          callId,
        });
        return;
      }

      try {
        console.log('Initializing call with:', {
          apiKey: STREAM_API_KEY,
          userId: authUser._id,
          userName: authUser.fullName,
          callId,
        });

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.image,
        };

        // Create video client
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData,
        });

        console.log('Video client created, joining call...');

        // Create and join call
        const callInstance = videoClient.call('default', callId);

        // Join with more options for better reliability
        await callInstance.join({
          create: true,
          data: {
            members: [{ user_id: authUser._id }],
          },
        });

        console.log('Call joined successfully');

        setClient(videoClient);
        setCall(callInstance);
      } catch (err) {
        console.error('Call join error:', err);
        setError(
          'Failed to join call. Please check your connection and try again.'
        );
        toast.error('Failed to join call. Try again.');
      } finally {
        setIsConnecting(false);
      }
    };

    if (!isLoading && !tokenLoading) {
      initCall();
    }
  }, [tokenData, authUser, callId, isLoading, tokenLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
      if (client) {
        client.disconnectUser().catch(console.error);
      }
    };
  }, [call, client]);

  // Show loading while authentication or token is loading
  if (isLoading || tokenLoading) {
    return <PageLoader />;
  }

  // Show error if token fetch failed
  if (tokenError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">Failed to get authentication token</p>
          <button onClick={() => router.push('/')} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show error if call initialization failed
  if (error && !isConnecting) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setError(null);
                setIsConnecting(true);
                // Trigger re-initialization
                window.location.reload();
              }}
              className="btn btn-primary"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="btn btn-outline"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while connecting to call
  if (isConnecting) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <PageLoader />
        <p className="mt-4 text-base-content/70">Connecting to call...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black">
      {client && call ? (
        <StreamVideo client={client}>
          <StreamTheme>
            <StreamCall call={call}>
              <CallContent onLeave={() => router.push('/')} />
            </StreamCall>
          </StreamTheme>
        </StreamVideo>
      ) : (
        <div className="h-screen flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="text-white mb-4">
              Could not load the call. Try refreshing.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CallContent = ({ onLeave }: { onLeave: () => void }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      onLeave();
    }
  }, [callingState, onLeave]);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p>Joining call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen relative">
      <SpeakerLayout />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <CallControls />
      </div>
    </div>
  );
};

export default CallPage;
