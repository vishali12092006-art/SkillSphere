import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 0, max = 5, size = 14, showCount = false, count = 0 }) => {
  return (
    <span className="rating" style={{ gap: '2px' }}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.round(value) ? '#F59E0B' : 'none'}
          color={i < Math.round(value) ? '#F59E0B' : '#D1D5DB'}
        />
      ))}
      {showCount && (
        <span style={{ marginLeft: '4px', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
          {value > 0 ? `${value.toFixed(1)}` : '–'}
          {count > 0 && ` (${count})`}
        </span>
      )}
    </span>
  );
};

export const InteractiveRating = ({ value, onChange, max = 5 }) => {
  const [hovered, setHovered] = React.useState(0);

  return (
    <span className="rating" style={{ gap: '4px' }}>
      {Array.from({ length: max }).map((_, i) => {
        const star = i + 1;
        return (
          <Star
            key={i}
            size={24}
            fill={star <= (hovered || value) ? '#F59E0B' : 'none'}
            color={star <= (hovered || value) ? '#F59E0B' : '#D1D5DB'}
            style={{ cursor: 'pointer', transition: 'all 0.1s' }}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
          />
        );
      })}
    </span>
  );
};

export default Rating;
