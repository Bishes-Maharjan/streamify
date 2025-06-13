import { axiosInstance } from './axios';

export const getOutgoingFriendReqs = async () => {
  const res = await axiosInstance.get('user/outgoing-friend-request');
  return res.data;
};

export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get('user/recommendation');
  return res.data;
};

export const getUserFriends = async () => {
  const res = await axiosInstance.get('user/friends');

  return res.data.friends;
};

export const sendFriendRequest = async (id: string) => {
  const res = await axiosInstance.post(`user/friend-request/${id}/`);
  return res.data;
};

export const getFriendRequest = async () => {
  const res = await axiosInstance.get('user/friend-request');
  return res.data;
};

export const acceptFriendRequest = async (id: string) => {
  const res = await axiosInstance.patch(`user/accept/friend-request/${id}`);

  return res.data;
};

export const rejectFriendRequest = async (id: string) => {
  const res = await axiosInstance.delete(`user/reject/friend-request/${id}`);
  return res.data;
};

export const getStreamToken = async () => {
  const res = await axiosInstance.get('chat/token');
  console.log('res', res);
  return res.data;
};
