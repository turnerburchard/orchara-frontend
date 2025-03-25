import { writeFile } from 'node:fs/promises';

async function fetchSampleResponse() {
    const API_URL = "http://localhost:5001";
    
    try {
        const response = await fetch(`${API_URL}/api/search`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                query: "machine learning transformers attention",
                cluster_size: 5 
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch sample response');
        }

        const data = await response.json();
        
        // Now fetch the summary for these papers
        const summaryResponse = await fetch(`${API_URL}/api/summarize_papers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ papers: data.results }),
        });

        if (!summaryResponse.ok) {
            throw new Error('Failed to fetch sample summary');
        }

        const summaryData = await summaryResponse.json();

        // Combine the data
        const sampleData = {
            papers: data.results,
            summary: summaryData
        };

        // Write to file
        await writeFile(
            'src/mockData/sampleResponse.json',
            JSON.stringify(sampleData, null, 2)
        );

        console.log('Sample response saved to src/mockData/sampleResponse.json');
    } catch (error) {
        console.error('Error fetching sample:', error);
    }
}

fetchSampleResponse(); 