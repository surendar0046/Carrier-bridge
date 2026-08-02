import React from 'react';

export interface ButtonNativeProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export const ButtonNative: React.FC<ButtonNativeProps> = ({
  title,
  onPress,
  disabled = false,
}) => {
  return (
    <button
      onClick={onPress}
      disabled={disabled}
      style={{
        backgroundColor: '#2563eb',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '12px',
        border: 'none',
        fontWeight: 'bold',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {title}
    </button>
  );
};
