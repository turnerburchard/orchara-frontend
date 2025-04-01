import config from '../config';
import { sampleResponse } from '../mockData/sampleResponse';
import type { Paper, ApiResponse } from '../types';

export const searchPapers = async (query: string, clusterSize: number): Promise<Paper[]> => {
    try {
        const response = await fetch(`${config.apiUrl}/api/search`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                query,
                cluster_size: clusterSize 
            })
        });
        
        const responseText = await response.text();
        if (!responseText) {
            throw new Error('Empty response from server');
        }

        const data = JSON.parse(responseText) as ApiResponse;
        if (!response.ok) {
            throw new Error(data.error || 'Search failed.');
        } else if (!data.results) {
            throw new Error('Invalid response format: missing results');
        }

        return data.results;
    } catch (err) {
        // Use sample data for any connection errors or when API is unavailable
        if (err instanceof Error && (
            err.message.includes('Failed to fetch') || 
            err.message.includes('Connection refused') ||
            err.message.includes('NetworkError') ||
            !config.apiUrl
        )) {
            return sampleResponse.papers.map(paper => ({
                paper_id: String(paper.paper_id),
                title: paper.title,
                abstract: paper.abstract,
                url: paper.url
            }));
        }
        return [];
    }
}; 