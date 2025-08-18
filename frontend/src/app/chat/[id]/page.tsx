'use client';

import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  ImageIcon,
  MicIcon,
  PaperclipIcon,
  StopCircleIcon,
  VideoIcon,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type {
  Attachment,
  Channel as ChannelType,
  LocalMessage,
  StreamChat as StreamChatType,
} from 'stream-chat';
import { StreamChat } from 'stream-chat';

import ChatLoader from '@/components/ChatLoader';
import { useAuthUser } from '@/hooks/useAuthUser';
import { User } from '@/interfaces/allInterface';
import { getStreamToken, getUser } from '@/lib/friend.api';
import Image from 'next/image';
import Link from 'next/link';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const ChatPage = () => {
  const params = useParams();
  const targetUserId = params?.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { user: authUser }: { user: User } = useAuthUser();
  const {data: getuser} = useQuery({
    queryKey: ['user', targetUserId],
    queryFn: ()=> getUser(targetUserId),
  })
 
  const [chatClient, setChatClient] = useState<StreamChatType | null>(null);
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
  });
 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Recording timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    const initChat = async () => {
      if (!STREAM_API_KEY || !tokenData || !authUser || !targetUserId) {
        return;
      }

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.image,
          },
          tokenData
        );

        const channelId = [authUser._id, targetUserId].sort().join('-');

        const currChannel = client.channel('messaging', channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        // Load existing messages - Direct assignment without casting
        const state = currChannel.state;
        setMessages(Object.values(state.messages));

        // Listen for new messages
        currChannel.on('message.new', (event) => {
          if (event?.message) {
            setMessages((prev) => {
              // Check if message already exists to prevent duplicates
              const messageExists = prev.some(
                (msg) => msg.id === event.message?.id
              );
              if (messageExists) {
                return prev;
              }
              // Convert the new message to LocalMessage format
              return [...prev, event.message as unknown as LocalMessage];
            });
          }
        });

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error('Stream chat error:', error);
        toast.error('Could not connect to chat.');
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [tokenData, authUser, targetUserId, chatClient]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !channel || sending) return;

    setSending(true);
    try {
      await channel.sendMessage({ text: newMessage.trim() });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!channel || !chatClient || sending) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Check if client is connected
    if (!chatClient.user) {
      toast.error('Chat not connected. Please refresh the page.');
      return;
    }

    setSending(true);
    try {
      // Upload file to Stream's CDN first
      const uploadResponse = await channel.sendFile(file);

      // Create attachment object with the uploaded file URL
      const attachment: Attachment = {
        type: 'image',
        image_url: uploadResponse.file,
        file_size: file.size,
        mime_type: file.type,
        title: file.name,
      };

      // Send message with image attachment
      await channel.sendMessage({
        text: `📸 ${file.name}`,
        attachments: [attachment],
      });

      toast.success('Image sent successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to send image');
    } finally {
      setSending(false);
      setShowAttachmentOptions(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        await sendVoiceMessage(audioBlob);

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendVoiceMessage = async (audioBlob: Blob) => {
    if (!channel || !chatClient || sending) return;

    // Check if client is connected
    if (!chatClient.user) {
      toast.error('Chat not connected. Please refresh the page.');
      return;
    }

    setSending(true);
    try {
      // Create a File object from the blob
      const audioFile = new File([audioBlob], `voice-${Date.now()}.wav`, {
        type: 'audio/wav',
      });

      // Upload file to Stream's CDN first
      const uploadResponse = await channel.sendFile(audioFile);

      // Create attachment object with the uploaded file URL
      const attachment: Attachment = {
        type: 'audio',
        asset_url: uploadResponse.file,
        file_size: audioFile.size,
        mime_type: 'audio/wav',
        title: 'Voice Message',
      };

      await channel.sendMessage({
        text: '🎵 Voice message',
        attachments: [attachment],
      });

      toast.success('Voice message sent!');
    } catch (error) {
      console.error('Error sending voice message:', error);
      toast.error('Failed to send voice message');
    } finally {
      setSending(false);
      setShowAttachmentOptions(false);
    }
  };

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `📹 Join me in this video call: ${callUrl}`,
      });

      toast.success('Video call link sent!');

      // Also open the call in current window
      window.open(callUrl, '_blank');
    }
  };

  const renderAttachment = (attachment: Attachment) => {
    switch (attachment.type) {
      case 'image':
        return (
          <div className="mt-2 max-w-xs">
            <Image
              src={attachment.image_url || attachment.asset_url || ''}
              alt={attachment.title || 'Image'}
              width={300}
              height={200}
              className="rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() =>
                window.open(
                  attachment.image_url || attachment.asset_url,
                  '_blank'
                )
              }
            />
          </div>
        );
      case 'audio':
        return (
          <div className="mt-2">
            <audio controls className="max-w-xs" src={attachment.asset_url}>
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case 'file':
        return (
          <div className="mt-2 p-3 bg-base-300 rounded-lg max-w-xs">
            <div className="flex items-center gap-2">
              <PaperclipIcon className="h-4 w-4" />
              <a
                href={attachment.asset_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:underline truncate"
              >
                {attachment.title || 'File'}
              </a>
            </div>
            {attachment.file_size &&
              typeof attachment.file_size === 'number' && (
                <p className="text-xs text-base-content/60 mt-1">
                  {(attachment.file_size / 1024).toFixed(1)} KB
                </p>
              )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderMessageContent = (text: string) => {
    // URL regex pattern
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    if (!urlRegex.test(text)) {
      return <span>{text}</span>;
    }

    const parts = text.split(urlRegex);

    return (
      <span>
        {parts.map((part, index) => {
          const uniqueKey = `msg-part-${index}-${part.slice(0, 10)}`;
          if (urlRegex.test(part)) {
            return (
              <a
                key={uniqueKey}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline font-medium opacity-90 hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                {part.includes('/call/') ? '🎬 Join Video Call' : part}
              </a>
            );
          }
          return <span key={uniqueKey}>{part}</span>;
        })}
      </span>
    );
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: string | Date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const groupMessagesByDate = (messages: LocalMessage[]) => {
    const groups: { [key: string]: LocalMessage[] } = {};

    messages.forEach((message) => {
      if (message.created_at) {
        const dateKey = new Date(message.created_at).toDateString();
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(message);
      }
    });

    return groups;
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-screen bg-base-100">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Chat Header - Fixed positioning relative to viewport */}
      <div className="sticky top-16 z-40 bg-base-100/95 backdrop-blur-sm border-b border-base-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <Link href="/" className="btn btn-ghost btn-circle btn-sm">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-10 h-10 rounded-full ring-2 ring-base-300">
                  <Image
                    fill
                    sizes="80px"
                    src={`${getuser.image}`}
                    alt="User"
                    className="rounded-full"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-base-content text-sm">
                  {getuser.fullName}
                </h3>
          
              </div>
            </div>
          </div>

          {/* Call Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleVideoCall}
              className="btn btn-ghost btn-circle btn-sm"
            >
              <VideoIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-base-50">
        <div className="p-4 space-y-4 pb-6">
          {Object.entries(messageGroups).map(([dateKey, dayMessages]) => (
            <div key={dateKey} className="space-y-3">
              {/* Date Divider */}
              <div className="flex items-center justify-center py-2">
                <div className="bg-base-200 text-base-content/60 text-xs px-3 py-1 rounded-full font-medium">
                  {formatDate(dateKey)}
                </div>
              </div>

              {/* Messages for this date */}
              <div className="space-y-3">
                {dayMessages.map((message, msgIndex) => {
                  const isOwn = message.user?.id === authUser._id;
                  const messageKey = `${message.id}-${msgIndex}-${dateKey}`;
                  return (
                    <div
                      key={messageKey}
                      className={`flex gap-2 ${
                        isOwn ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="avatar flex-shrink-0">
                        <div className="w-auto h-auto rounded-full">
                          <Image
                            fill
                            sizes="80px"
                            src={
                              message.user?.image ||
                              `https://ui-avatars.com/api/?name=${message.user?.name}&background=random`
                            }
                            alt={message.user?.name || 'User'}
                            className="rounded-full"
                          />
                        </div>
                      </div>

                      {/* Message Content */}
                      <div
                        className={`flex flex-col max-w-[70%] ${
                          isOwn ? 'items-end' : 'items-start'
                        }`}
                      >
                        {/* Message Header */}
                        <div
                          className={`text-xs text-base-content/50 mb-1 ${
                            isOwn ? 'text-right' : 'text-left'
                          }`}
                        >
                          {!isOwn && (
                            <span className="font-medium">
                              {message.user?.name}
                            </span>
                          )}
                          {message.created_at && (
                            <span className={!isOwn ? 'ml-2' : ''}>
                              {formatTime(message.created_at)}
                            </span>
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`px-4 py-2 rounded-2xl max-w-full break-words ${
                            isOwn
                              ? 'bg-primary text-primary-content rounded-br-md'
                              : 'bg-base-200 text-base-content rounded-bl-md'
                          }`}
                        >
                          {/* Text Content */}
                          {message.text && (
                            <div className="text-sm leading-relaxed">
                              {renderMessageContent(message.text)}
                            </div>
                          )}

                          {/* Attachments */}
                          {message.attachments &&
                            message.attachments.length > 0 && (
                              <div className="space-y-2">
                                {message.attachments.map(
                                  (attachment, attIndex) => (
                                    <div key={`${message.id}-att-${attIndex}`}>
                                      {renderAttachment(attachment)}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="bg-red-500 text-white px-4 py-2 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            Recording... {formatDuration(recordingTime)}
          </span>
        </div>
      )}

      {/* Attachment Options */}
      {showAttachmentOptions && (
        <div className="bg-base-100 border-t border-base-200 p-4">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-circle btn-primary"
              disabled={sending}
            >
              <ImageIcon className="h-5 w-5" />
            </button>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`btn btn-circle ${
                isRecording ? 'btn-error' : 'btn-secondary'
              }`}
              disabled={sending}
            >
              {isRecording ? (
                <StopCircleIcon className="h-5 w-5" />
              ) : (
                <MicIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Message Input - Fixed at bottom */}
      <div className="sticky bottom-0 bg-base-100 border-t border-base-200 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
            className="btn btn-circle btn-ghost"
            disabled={sending || isRecording}
          >
            <PaperclipIcon className="h-5 w-5" />
          </button>

          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="input input-bordered w-full pr-12 rounded-full bg-base-200 border-base-300 focus:border-primary focus:bg-base-100 transition-colors"
                disabled={sending || isRecording}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending || isRecording}
                  className="btn btn-primary btn-circle btn-sm disabled:opacity-50"
                >
                  {sending ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
