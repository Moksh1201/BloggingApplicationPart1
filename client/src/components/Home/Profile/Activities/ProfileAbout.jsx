import React from "react";
import { Blog } from "../../../../Context/Context"; 

const ProfileAbout = ({ profileData, setEditModal, setSettingsModal }) => {
  const { currentUser } = Blog();

  return (
    <div className="w-full">
      <p className="text-2xl first-letter:uppercase">Bio:  {profileData?.bio || "No bio available"}
      </p>

      {profileData?.email && (
        <p className="mt-2 text-lg text-gray-600">Email: {profileData.email}</p>
      )}

      <div className="mt-4 flex gap-6">
        <div className="flex items-center">
          <span className="font-semibold">Followers:</span>
          <span className="ml-2">{profileData?.followers?.length || 0}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold">Following:</span>
          <span className="ml-2">{profileData?.following?.length || 0}</span>
        </div>
      </div>

      {currentUser?.uid === profileData?.userId && (
        <div className="text-right mt-6">
          <button
            onClick={() => setEditModal(true)}
            className="border border-black py-2 px-5 rounded-full text-black hover:bg-gray-100 transition duration-300"
          >
            Edit Profile
          </button>
        </div>
      )}

      
    </div>
  );
};

export default ProfileAbout;
