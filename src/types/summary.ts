import { Paper } from './paper';

export interface Citation {
    id: number;
    paper_id: string;
    title: string;
    url: string;
    context: string;
}

export interface SummaryResponse {
    summary: string;
    citations: Citation[];
} 