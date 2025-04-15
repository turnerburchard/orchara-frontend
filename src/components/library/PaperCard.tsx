import type { FC } from 'react';
import { useState } from 'react';
import type { Paper } from '../../types/library';
import {TrashIcon } from '@heroicons/react/24/outline';
import PaperDetailsModal from './PaperDetailsModal';

interface PaperCardProps {
    paper: Paper;
    onDelete?: (paperId: string) => void;
}

const PaperCard: FC<PaperCardProps> = ({ paper, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (onDelete) {
            onDelete(paper.paper_id);
        }
        setIsDeleteConfirmOpen(false);
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <h3 
                            className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() => setIsModalOpen(true)}
                        >
                            {paper.title || 'Untitled Paper'}
                        </h3>
                        <div className="flex space-x-2">
                            {onDelete && (
                                <button 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={handleDeleteClick}
                                    title="Delete paper"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <PaperDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                paper={paper}
            />

            {/* Delete Confirmation Modal */}
            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Confirm Deletion
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Are you sure you want to delete "{paper.title || 'Untitled Paper'}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PaperCard; 