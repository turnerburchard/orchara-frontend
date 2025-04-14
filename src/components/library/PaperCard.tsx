import type { FC } from 'react';
import type { Paper } from '../../types/library';
import { DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline';

interface PaperCardProps {
    paper: Paper;
    onDelete?: (paperId: string) => void;
}

const PaperCard: FC<PaperCardProps> = ({ paper, onDelete }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {paper.title || 'Untitled Paper'}
                    </h3>
                    <div className="flex space-x-2">
                        {paper.file_path && (
                            <button 
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() => window.open(paper.file_path, '_blank')}
                                title="View PDF"
                            >
                                <DocumentTextIcon className="h-5 w-5" />
                            </button>
                        )}
                        {onDelete && (
                            <button 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => onDelete(paper.paper_id)}
                                title="Delete paper"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaperCard; 