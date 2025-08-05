// Mock hook for authentication
export const useAuth = () => {
  return {
    isEditor: true, // Assume user is always an editor for now
    // In a real app, this would be based on user roles from your auth provider
  };
};
