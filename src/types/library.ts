export interface Paper {
    id: string;
    paper_id: string;
    title: string;
    authors: string[];
    abstract?: string;
    doi?: string;
    publication_date?: string;
    file_path: string;
    created_at: string;
    updated_at: string;
}

export interface UserPapersResponse {
    papers: Paper[];
} 