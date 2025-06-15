export const handleOAuthLogin = () => {
  const backendUrl =
    (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') +
    '/auth/google';

  window.location.href = backendUrl;
};
