import type { Paper } from '../types/paper';
import { sampleResponse } from '../mockData/sampleResponse';

export const isSampleData = (papers: Paper[]) => {
    if (!papers?.length) return false;
    return papers.length === sampleResponse.papers.length &&
        papers.every((paper, index) => 
            paper.paper_id === sampleResponse.papers[index].paper_id &&
            paper.title === sampleResponse.papers[index].title
        );
}; 