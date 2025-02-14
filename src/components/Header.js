import React from 'react';
import logo from '../img/logo_text.png';
import turner from '../img/turner.jpg';

const Header = () => (
    <header className="bg-white flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <a href="/" className="flex items-center">
            <img src={logo} alt="Orchera Logo" className="h-10 w-auto" />
        </a>
        <button className="focus:outline-none">
            <img
                src={turner}
                alt="Profile"
                className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-600"
            />
        </button>
    </header>
);

export default Header;
