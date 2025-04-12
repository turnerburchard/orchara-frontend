import type { FC } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import UploadModal from './UploadModal';
import { BlackButton } from '../ui/buttons';

const Library: FC = () => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Library</h1>
                <BlackButton 
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2"
                >
                    <CloudArrowUpIcon className="h-5 w-5" />
                    Upload papers
                </BlackButton>
            </div>
            <UploadModal 
                isOpen={isUploadModalOpen} 
                onClose={() => setIsUploadModalOpen(false)} 
            />
        </div>
    );
};

export default Library; 