
import React from 'react';
import ProfileSettings from '@/components/ProfileSettings';

const Profile = () => {
  return (
    <div className="p-4 md:p-8 pb-32 md:pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-maideasy-secondary">Profile Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and preferences</p>
        </div>
        
        <ProfileSettings />
      </div>
    </div>
  );
};

export default Profile;
