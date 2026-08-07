// Date formatting
export const formatDate = (dateStr) => {
  if (!dateStr) return 'Not scheduled';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'Not scheduled';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateStr);
};

// Profile completion percentage
export const getProfileCompletion = (user) => {
  if (!user) return 0;
  const fields = [
    user.name,
    user.bio,
    user.city,
    user.avatar,
    user.skillsTeach?.length > 0,
    user.skillsLearn?.length > 0,
    user.experienceLevel,
    user.availability,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Status color map for badges
export const statusConfig = {
  pending: { label: 'Pending', className: 'badge-warning' },
  accepted: { label: 'Accepted', className: 'badge-success' },
  rejected: { label: 'Rejected', className: 'badge-error' },
  upcoming: { label: 'Upcoming', className: 'badge-success' },
  completed: { label: 'Completed', className: 'badge-primary' },
  cancelled: { label: 'Cancelled', className: 'badge-error' },
};

// Avatar URL helper
export const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http')) return avatar;
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://skillsphere-cuyg.onrender.com'}/${avatar}`;
};

// Categories list
export const SKILL_CATEGORIES = [
  'Technology',
  'Design',
  'Business',
  'Language',
  'Music',
  'Arts',
  'Sports',
  'Other',
];

export const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
export const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Evenings', 'Flexible', 'Not Available'];

// Error message extractor
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (!error?.response && (error?.code === 'ERR_NETWORK' || error?.code === 'ECONNREFUSED' || error?.message === 'Network Error')) {
    return 'Cannot connect to server. Please make sure the backend server (port 5000) and MongoDB are running.';
  }
  return (
    error?.message ||
    'Something went wrong. Please try again.'
  );
};
