import type { SummaryResponse } from '../types/summary';

export const validateSummaryResponse = (data: unknown): data is SummaryResponse => {
    if (!data || typeof data !== 'object') return false;
    
    const response = data as Record<string, unknown>;
    if (typeof response.summary !== 'string') return false;
    if (!Array.isArray(response.citations)) return false;
    
    return response.citations.every((citation: unknown) => {
        if (!citation || typeof citation !== 'object') return false;
        const cit = citation as Record<string, unknown>;
        return (
            typeof cit.id === 'number' &&
            typeof cit.paper_id === 'string' &&
            typeof cit.title === 'string' &&
            typeof cit.url === 'string' &&
            typeof cit.context === 'string'
        );
    });
}; 