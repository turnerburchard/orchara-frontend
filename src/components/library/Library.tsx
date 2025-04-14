import type { FC } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import UploadModal from './UploadModal';
import { BlackButton } from '../ui/buttons';
import { useUserPapers } from '../../hooks/useUserPapers';
import PaperCard from './PaperCard';

const Library: FC = () => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const { papers, loading, error, refreshPapers, deletePaper } = useUserPapers();

    const handleDeletePaper = async (paperId: string) => {
        const success = await deletePaper(paperId);
        if (!success) {
            console.error('Failed to delete paper');
        }
    };

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

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            ) : papers.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No papers found in your library.</p>
                    <BlackButton 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 mx-auto"
                    >
                        <CloudArrowUpIcon className="h-5 w-5" />
                        Upload your first paper
                    </BlackButton>
                </div>
            ) : (
                <div className="space-y-4">
                    {papers.map(paper => (
                        <PaperCard 
                            key={paper.id} 
                            paper={paper} 
                            onDelete={handleDeletePaper}
                        />
                    ))}
                </div>
            )}

            <UploadModal 
                isOpen={isUploadModalOpen} 
                onClose={() => setIsUploadModalOpen(false)} 
                onSuccess={refreshPapers}
            />
        </div>
    );
};

export default Library; 