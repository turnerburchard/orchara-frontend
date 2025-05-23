import type { FC } from 'react';
import type { Paper } from '../../types/library';
import { BlackButton } from '../ui/buttons';

interface PaperDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    paper: Paper;
}

const PaperDetailsModal: FC<PaperDetailsModalProps> = ({ isOpen, onClose, paper }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Paper Details
                    </h1>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Title
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                            {paper.title || 'Untitled Paper'}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Authors
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 line-clamp-1">
                            {paper.authors?.length ? paper.authors.join(', ') : 'No authors listed'}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Abstract
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-10">
                            {paper.abstract || 'No abstract available'}
                        </p>
                    </div>
                </div>
                
                <div className="flex justify-end">
                    <BlackButton onClick={onClose}>
                        Close
                    </BlackButton>
                </div>
            </div>
        </div>
    );
};

export default PaperDetailsModal; 