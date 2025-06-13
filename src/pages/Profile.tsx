
import React from 'react';
import ProfileSettings from '@/components/ProfileSettings';

const Profile = () => {
  return (
    <div className="p-4 max-w-md mx-auto md:max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-maideasy-secondary">Profile</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your account settings</p>
      </div>
      
      <ProfileSettings />
    </div>
  );
};

export default Profile;
