
import React from 'react';
import ProfileSettings from '@/components/ProfileSettings';

const Profile = () => {
  return (
    <div 
      className="h-full overflow-auto"
      style={{ 
        height: window.innerWidth < 768 ? 'calc(100vh - 80px)' : '100vh',
        padding: '1rem',
        maxWidth: '768px',
        margin: '0 auto'
      }}
    >
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-maideasy-secondary">Profile</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your account settings</p>
      </div>
      
      <ProfileSettings />
    </div>
  );
};

export default Profile;
