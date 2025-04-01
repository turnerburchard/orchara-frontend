import { Paper } from '../types/paper';

export interface SampleResponse {
    papers: Paper[];
    summary: {
        summary: string;
        citations: Array<{
            id: number;
            paper_id: string;
            title: string;
            url: string;
            context: string;
        }>;
    };
}

export const sampleResponse: SampleResponse = {
    papers: [
        {
            paper_id: "1",
            title: "Attention Is All You Need",
            abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
            url: "https://arxiv.org/abs/1706.03762"
        },
        {
            paper_id: "2",
            title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
            abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text.",
            url: "https://arxiv.org/abs/1810.04805"
        },
        {
            paper_id: "3",
            title: "Language Models are Few-Shot Learners",
            abstract: "Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets of thousands or tens of thousands of examples.",
            url: "https://arxiv.org/abs/2005.14165"
        }
    ],
    summary: {
        summary: "Recent advances in transformer architectures have revolutionized natural language processing {{cite:1}}. The introduction of self-attention mechanisms and bidirectional training has led to significant improvements in language understanding tasks {{cite:2}}. These models have demonstrated remarkable few-shot learning capabilities {{cite:3}}.",
        citations: [
            {
                id: 1,
                paper_id: "1",
                title: "Attention Is All You Need",
                url: "https://arxiv.org/abs/1706.03762",
                context: "Introduction of the transformer architecture"
            },
            {
                id: 2,
                paper_id: "2",
                title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
                url: "https://arxiv.org/abs/1810.04805",
                context: "Bidirectional training in language models"
            },
            {
                id: 3,
                paper_id: "3",
                title: "Language Models are Few-Shot Learners",
                url: "https://arxiv.org/abs/2005.14165",
                context: "Few-shot learning capabilities"
            }
        ]
    }
}; 