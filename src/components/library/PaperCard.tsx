import type { FC } from 'react';
import type { Paper } from '../../types/library';
import { DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline';

interface PaperCardProps {
    paper: Paper;
    onDelete?: (paperId: string) => void;
}

const PaperCard: FC<PaperCardProps> = ({ paper, onDelete }) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Unknown date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
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
                
                {paper.authors && paper.authors.length > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {paper.authors.join(', ')}
                    </div>
                )}
                
                <div className="flex flex-wrap gap-2 mt-2">
                    {paper.doi && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            DOI: {paper.doi}
                        </span>
                    )}
                    {paper.publication_date && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Published: {formatDate(paper.publication_date)}
                        </span>
                    )}
                    {paper.created_at && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            Added: {formatDate(paper.created_at)}
                        </span>
                    )}
                </div>
                
                {paper.abstract && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {paper.abstract}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PaperCard; 