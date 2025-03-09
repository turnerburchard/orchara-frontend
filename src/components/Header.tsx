import type { FC } from 'react'
import Profile from './Profile';

const Header: FC = () => (
    <header className="bg-white flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <a href="/" className="flex items-center">
            <img src="/logo_text.png" alt="Orchara Logo" className="h-10 w-auto" />
        </a>
        <Profile />
    </header>
);

export default Header;
