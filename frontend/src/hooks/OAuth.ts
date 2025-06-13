export const handleOAuthLogin = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  window.location.href = `${apiUrl}/auth/google`;
};
