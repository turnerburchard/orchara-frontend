export interface Paper {
    paper_id: string;
    title: string;
    abstract: string;
    url: string;
}

export interface ApiResponse {
    results: Paper[];
    error?: string;
} 