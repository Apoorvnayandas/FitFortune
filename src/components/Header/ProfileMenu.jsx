import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ProfileMenu = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // Get user data from context or localStorage
  useEffect(() => {
    if (user) {
      setUserData(user);
    } else {
      // Try to get from localStorage as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
    }
  }, [user]);
  
  // Get user's display name from metadata or email
  const displayName = userData?.user_metadata?.fullName || 
                      userData?.email?.split('@')[0] || 
                      'User';
  
  // Get first letter of name for avatar placeholder
  const avatarLetter = displayName.charAt(0).toUpperCase();
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear localStorage user data
      localStorage.removeItem('user');
      localStorage.removeItem('demoUser');
      
      // Call signOut if available
      if (signOut) {
        await signOut();
      }
      
      navigate('/');
      // Force reload to clear any cached auth state
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
      // Force logout anyway by clearing localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('demoUser');
      navigate('/');
      window.location.reload();
    }
  };
  
  // Don't render if no user data
  if (!userData) {
    return null;
  }
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center gap-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* User avatar */}
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
          {avatarLetter}
        </div>
        
        {/* Username */}
        <span className="hidden md:block text-gray-700 font-medium">
          {displayName}
        </span>
        
        {/* Dropdown arrow */}
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
          </div>
          
          <a 
            href="#" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              navigate('/dashboard');
            }}
          >
            Dashboard
          </a>
          
          <a 
            href="#" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              navigate('/profile');
            }}
          >
            Profile Settings
          </a>
          
          <a 
            href="#" 
            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              handleLogout();
            }}
          >
            Sign Out
          </a>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu; 