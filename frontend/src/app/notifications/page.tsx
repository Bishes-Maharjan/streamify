'use client';
import NoNotificationsFound from '@/components/NoNotification';
import { RequestDB } from '@/interfaces/allInterface';
import {
  acceptFriendRequest,
  getFriendRequest,
  rejectFriendRequest,
} from '@/lib/friend.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast, { ErrorIcon, Toaster } from 'react-hot-toast';

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequest,
  });

  const {
    mutate: acceptRequestMutation,
    isPending: isAcceptPending,
    error,
  } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      setTimeout(() => {
        router.refresh();
      }, 1000);
    },
    onError: (error) => {
      if (error && isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    },
  });
  console.log(error);
  const { mutate: rejectRequestMutation, isPending: isRejectPending } =
    useMutation({
      mutationFn: rejectFriendRequest,
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
        queryClient.invalidateQueries({ queryKey: ['friends'] });
      },
    });

  const incomingRequests = friendRequests?.incomingFriendRequest || [];
  const acceptedRequests = friendRequests?.accpetedFriendRequest || [];
  const rejectedRequests = friendRequests?.rejectedFriendRequest || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Toaster />
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request: RequestDB) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <Image
                                sizes="80px"
                                fill
                                src={request.sender.image}
                                alt={request.sender.fullName}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {request.sender.fullName}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="mx-1 px-1">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => acceptRequestMutation(request._id)}
                              disabled={isAcceptPending || isRejectPending}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => rejectRequestMutation(request._id)}
                              disabled={isAcceptPending || isRejectPending}
                            >
                              Reject
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification: RequestDB) => (
                    <div
                      key={notification._id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            {notification.receiver.image && (
                              <Image
                                fill
                                sizes="80px"
                                src={notification.receiver.image}
                                alt={notification.receiver.fullName}
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notification.receiver.fullName}
                            </h3>
                            <p className="text-sm my-1">
                              {notification.receiver.fullName} accepted your
                              friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* REJECTED REQS NOTIFICATONS */}
            {rejectedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  Rejections
                </h2>

                <div className="space-y-3">
                  {rejectedRequests.map((notification: RequestDB) => (
                    <div
                      key={notification._id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            {notification.receiver.image && (
                              <Image
                                fill
                                sizes="80px"
                                src={notification.receiver.image}
                                alt={notification.receiver.fullName}
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notification.receiver.fullName}
                            </h3>
                            <p className="text-sm my-1">
                              {notification.receiver.fullName} rejected your
                              friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-error">
                            <ErrorIcon className="h-3 w-3 mr-1" />
                            Rejected
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 &&
              acceptedRequests.length === 0 &&
              rejectedRequests.length === 0 && <NoNotificationsFound />}
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;
