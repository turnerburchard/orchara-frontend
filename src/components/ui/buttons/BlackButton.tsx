import type { FC, ReactNode } from 'react';

interface BlackButtonProps {
    children: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
}

const BlackButton: FC<BlackButtonProps> = ({ 
    children, 
    onClick, 
    type = 'button', 
    disabled = false,
    className = ''
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-full focus:outline-none disabled:opacity-50 ${className}`}
        >
            {children}
        </button>
    );
};

export default BlackButton; 