import { useState, useRef, useEffect } from 'react';

const ENABLE_EXTERNAL_LINK = true; // Toggle this flag to enable/disable external link

const Profile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const menu = menuRef.current;
            if (!menu || !menu.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleProfileClick = () => {
        if (ENABLE_EXTERNAL_LINK) {
            window.location.href = "https://turnerburchard.com";
        } else {
            toggleMenu();
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={handleProfileClick} className="focus:outline-none" type="button">
                <img
                    src="/turner.jpg"
                    alt="Profile"
                    className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-600"
                />
            </button>
            {!ENABLE_EXTERNAL_LINK && isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                    <ul className="py-2">
                        <li>
                            <button
                                onClick={() => alert('Log Out')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                type="button"
                            >
                                Log Out
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => alert('Upgrade to Full Version')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                type="button"
                            >
                                Upgrade to Full Version
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => alert('About Orchara')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                type="button"
                            >
                                About Orchara
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Profile;
