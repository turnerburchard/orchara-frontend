import type { FC } from 'react'
import Profile from './Profile';
import { Link } from 'react-router-dom';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const Header: FC = () => (
    <header className="bg-white flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
            <a href="/" className="flex items-center">
                <img src="/logo_text.png" alt="Orchara Logo" className="h-10 w-auto" />
            </a>
            <Link 
                to="/library" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
            >
                <BookOpenIcon className="h-5 w-5" />
                Library
            </Link>
        </div>
        <Profile />
    </header>
);

export default Header;
