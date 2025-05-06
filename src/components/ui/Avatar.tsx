import React from "react";

interface AvatarProps {
  email: string;
}

const Avatar: React.FC<AvatarProps> = ({ email }) => {
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-16 h-16 rounded-full bg-red-400 text-white flex items-center justify-center text-2xl font-bold ">
        {initial}
      </div>
      <p className="text-sm text-gray-700 break-all text-center">{email}</p>
    </div>
  );
};

export default Avatar;
