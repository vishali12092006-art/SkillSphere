import React from 'react';
import { getInitials, getAvatarUrl } from '../../utils/helpers';

const Avatar = ({ user, size = 'md', className = '' }) => {
  const sizeClass = `avatar-${size}`;
  const avatarUrl = getAvatarUrl(user?.avatar);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={user?.name || 'User'}
        className={`avatar ${sizeClass} ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  return (
    <div className={`avatar-fallback ${sizeClass} ${className}`}>
      {getInitials(user?.name)}
    </div>
  );
};

export default Avatar;
