// This file contains example API call patterns for Hugging Face
// See src/services/huggingface.service.ts for actual implementations

export const exampleFetch = async (token: string, resumeText: string) => {
    const response = await fetch("https://api-inference.huggingface.co/models/your-model", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ inputs: resumeText }),
    });
    return response;
};
