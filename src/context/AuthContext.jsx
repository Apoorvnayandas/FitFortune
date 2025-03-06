import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import profileService from '../services/profileService';

// Create the AuthContext
const AuthContext = createContext();

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if the site is running in production
  const isProduction = window.location.hostname !== 'localhost' && 
                       window.location.hostname !== '127.0.0.1';
  
  console.log('Auth environment:', { isProduction, hostname: window.location.hostname });

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('Found stored user:', !!parsedUser);
        setUser(parsedUser);
        
        // Try to fetch profile if user exists
        const fetchStoredProfile = async () => {
          try {
            if (parsedUser && parsedUser.id) {
              const { profile: userProfile } = await profileService.getProfile(parsedUser.id);
              if (userProfile) {
                setProfile(userProfile);
              }
            }
          } catch (error) {
            console.log('No profile found for stored user');
          }
        };
        
        fetchStoredProfile();
      }
    } catch (e) {
      console.error('Error parsing stored user:', e);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Get current session and user
        const { session } = await authService.getSession();
        
        if (session) {
          const { user: currentUser } = await authService.getUser();
          setUser(currentUser);
          
          // Fetch user profile
          if (currentUser) {
            const { profile: userProfile } = await profileService.getProfile(currentUser.id);
            setProfile(userProfile);
          }
        }
        
        // Set up auth state change listener
        const { subscription } = authService.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event);
          
          if (session) {
            const { user: currentUser } = await authService.getUser();
            setUser(currentUser);
            
            // Fetch user profile
            if (currentUser) {
              const { profile: userProfile } = await profileService.getProfile(currentUser.id);
              setProfile(userProfile);
            }
          } else {
            setUser(null);
            setProfile(null);
          }
          
          setLoading(false);
        });
        
        // Clean up listener on unmount
        return () => {
          subscription?.unsubscribe();
        };
      } catch (err) {
        console.error('Error initializing auth state:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user: newUser, error: signUpError } = await authService.signUp(email, password, userData);
      
      if (signUpError) {
        setError(signUpError);
        return { success: false, error: signUpError };
      }
      
      return { success: true, user: newUser };
    } catch (err) {
      const errorMessage = err.message || 'Failed to sign up';
      console.error('Sign up error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user: signedInUser, error: signInError } = await authService.signIn(email, password);
      
      if (signInError) {
        setError(signInError);
        return { success: false, error: signInError };
      }
      
      if (!signedInUser) {
        const noUserError = 'Invalid email or password';
        setError(noUserError);
        return { success: false, error: noUserError };
      }
      
      // Set the user in state
      setUser(signedInUser);
      
      // Store in localStorage - crucial for persistence in deployed environments
      localStorage.setItem('user', JSON.stringify(signedInUser));
      console.log('User stored in localStorage:', !!signedInUser);
      
      // Try to fetch profile if available
      try {
        const { profile: userProfile } = await profileService.getProfile(signedInUser.id);
        if (userProfile) {
          setProfile(userProfile);
        }
      } catch (profileError) {
        console.log('No profile found, will be created if needed');
      }
      
      return { success: true, user: signedInUser };
    } catch (err) {
      const errorMessage = err.message || 'Failed to sign in';
      console.error('Sign in error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.signOut();
      
      // Clear user from state and localStorage
      setUser(null);
      setProfile(null);
      localStorage.removeItem('user');
      localStorage.removeItem('demoUser');
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to sign out';
      console.error('Sign out error:', errorMessage);
      setError(errorMessage);
      
      // Force clear storage anyway
      localStorage.removeItem('user');
      localStorage.removeItem('demoUser');
      setUser(null);
      setProfile(null);
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: resetError } = await authService.resetPassword(email);
      
      if (resetError) {
        setError(resetError);
        return { success: false, error: resetError };
      }
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to reset password';
      console.error('Reset password error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        const noUserError = 'You must be logged in to update your profile';
        setError(noUserError);
        return { success: false, error: noUserError };
      }
      
      const updatedProfileData = {
        ...profileData,
        id: user.id,
        updated_at: new Date().toISOString()
      };
      
      const { profile: updatedProfile, error: updateError } = await profileService.updateProfile(
        user.id,
        updatedProfileData
      );
      
      if (updateError) {
        setError(updateError);
        return { success: false, error: updateError };
      }
      
      setProfile(updatedProfile);
      
      // Update user metadata in localStorage if fullName changed
      if (profileData.fullName) {
        const updatedUser = { 
          ...user, 
          user_metadata: { 
            ...user.user_metadata, 
            fullName: profileData.fullName 
          } 
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return { success: true, profile: updatedProfile };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile';
      console.error('Update profile error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Upload avatar
  const uploadAvatar = async (file) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        const noUserError = 'You must be logged in to upload an avatar';
        setError(noUserError);
        return { success: false, error: noUserError };
      }
      
      const { url, error: uploadError } = await profileService.uploadAvatar(user.id, file);
      
      if (uploadError) {
        setError(uploadError);
        return { success: false, error: uploadError };
      }
      
      // Update profile with new avatar URL
      const updatedProfile = {
        ...profile,
        avatar_url: url,
        updated_at: new Date().toISOString()
      };
      
      setProfile(updatedProfile);
      return { success: true, url };
    } catch (err) {
      const errorMessage = err.message || 'Failed to upload avatar';
      console.error('Upload avatar error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update email
  const updateEmail = async (newEmail) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        const noUserError = 'You must be logged in to update your email';
        setError(noUserError);
        return { success: false, error: noUserError };
      }
      
      const { error: updateError } = await authService.updateEmail(newEmail);
      
      if (updateError) {
        setError(updateError);
        return { success: false, error: updateError };
      }
      
      // Update user in state
      const updatedUser = {
        ...user,
        email: newEmail
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update email';
      console.error('Update email error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        const noUserError = 'You must be logged in to update your password';
        setError(noUserError);
        return { success: false, error: noUserError };
      }
      
      const { error: updateError } = await authService.updatePassword(newPassword);
      
      if (updateError) {
        setError(updateError);
        return { success: false, error: updateError };
      }
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update password';
      console.error('Update password error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    uploadAvatar,
    updateEmail,
    updatePassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 