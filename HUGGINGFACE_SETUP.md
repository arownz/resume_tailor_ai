# 🤖 Hugging Face Integration Guide

This guide will walk you through setting up Hugging Face for Resume Tailor AI.

## What is Hugging Face?

Hugging Face is a platform that provides access to thousands of machine learning models. We use it for:
- **Named Entity Recognition (NER)**: Extract skills, companies, and other entities from resumes
- **Zero-Shot Classification**: Match skills and roles without training custom models
- **Text Generation**: Create tailored cover letters and summaries
- **Semantic Similarity**: Calculate how well a resume matches a job description

## Step-by-Step Setup

### 1. Create a Hugging Face Account

1. Go to [https://huggingface.co/join](https://huggingface.co/join)
2. Sign up with your email or GitHub account
3. Verify your email address

### 2. Generate an API Token

1. Once logged in, click on your profile picture (top right)
2. Select **Settings** from the dropdown
3. Click on **Access Tokens** in the left sidebar
4. Click **New token**
5. Give your token a name (e.g., "Resume Tailor AI")
6. Select **Read** permission (free tier)
7. Click **Generate token**
8. **Important**: Copy the token immediately - you won't be able to see it again!

### 3. Add Token to Your Project

Open your `.env` file and add:

```env
VITE_HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Replace `hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual token.

### 4. Verify Installation

Start your development server:

```bash
npm run dev
```

Try uploading a resume in the dashboard. If you see analysis results, Hugging Face is working correctly!

## Models Used

The application uses several pre-trained models:

| Model | Purpose | Size | Speed |
|-------|---------|------|-------|
| `dslim/bert-base-NER` | Extract entities (skills, companies) | Small | Fast |
| `facebook/bart-large-mnli` | Zero-shot skill matching | Large | Medium |
| `sentence-transformers/all-MiniLM-L6-v2` | Calculate semantic similarity | Small | Fast |
| `gpt2` | Generate cover letters | Small | Fast |
| `facebook/bart-large-cnn` | Summarize text | Large | Medium |
| `deepset/roberta-base-squad2` | Extract keywords | Medium | Fast |

## Rate Limits

### Free Tier
- **1,000 requests per month** (usually enough for development)
- Rate limited to prevent abuse
- Slower inference (shared infrastructure)

### Paid Tiers
If you need more:
- **Pro**: $9/month - 100,000 requests
- **Enterprise**: Custom pricing - Unlimited requests + dedicated infrastructure

Check [Hugging Face Pricing](https://huggingface.co/pricing) for details.

## Best Practices

### 1. Cache Results
If analyzing the same resume multiple times, cache the parsed results:

```typescript
// Store parsed resume in state
const [cachedResume, setCachedResume] = useState<Resume | null>(null);
```

### 2. Batch Requests
Group API calls when possible to reduce total requests.

### 3. Use Lighter Models
For faster processing, consider these alternatives:
- Replace `bart-large` with `bart-base` for smaller models
- Use `distilbert` instead of `bert` for faster inference

### 4. Handle Errors Gracefully

```typescript
try {
  const result = await HuggingFaceService.extractEntities(text);
} catch (error) {
  // Fall back to basic pattern matching
  console.error('AI analysis failed, using fallback:', error);
}
```

## Troubleshooting

### Error: "Invalid API token"
- Double-check your `.env` file
- Ensure the token starts with `hf_`
- Generate a new token if needed

### Error: "Rate limit exceeded"
- Wait a few minutes and try again
- Upgrade to a paid tier if needed
- Implement request caching

### Slow Response Times
- Free tier uses shared infrastructure
- Consider upgrading for faster responses
- Use smaller models when possible

### Model Not Found
- Check if the model name is correct
- Some models may be deprecated - check Hugging Face Hub for alternatives

## Alternative: Self-Hosted Models

For production, you can host models yourself:

### Option 1: Hugging Face Spaces
1. Deploy your own inference endpoint
2. Update service to point to your endpoint
3. No rate limits!

### Option 2: Local Inference
Install transformers library:
```bash
pip install transformers torch
```

Create a local API server (Python):
```python
from transformers import pipeline
from flask import Flask, request

app = Flask(__name__)
classifier = pipeline("zero-shot-classification")

@app.route("/classify", methods=["POST"])
def classify():
    data = request.json
    result = classifier(data["text"], data["labels"])
    return result

app.run(port=5000)
```

Update TypeScript service:
```typescript
const response = await fetch('http://localhost:5000/classify', {
  method: 'POST',
  body: JSON.stringify({ text, labels }),
});
```

## Customizing Models

You can replace any model in `src/services/huggingface.service.ts`:

```typescript
static async extractEntities(text: string): Promise<any[]> {
  const response = await hf.tokenClassification({
    model: 'your-custom-model-name', // Change this
    inputs: text,
  });
  return response;
}
```

Find models on [Hugging Face Hub](https://huggingface.co/models).

## Testing Without API Key

For development without an API key, the app will:
1. Show a warning in console
2. Use fallback pattern matching
3. Return mock scores (for UI testing)

This allows frontend development without AI dependencies.

## Next Steps

1. ✅ Set up your Hugging Face account
2. ✅ Generate and add your API token
3. ✅ Test the integration with a sample resume
4. 📊 Monitor your usage in [Hugging Face Settings](https://huggingface.co/settings/tokens)
5. 🚀 Deploy to production when ready!

## Resources

- [Hugging Face Documentation](https://huggingface.co/docs)
- [Inference API Docs](https://huggingface.co/docs/api-inference)
- [Model Hub](https://huggingface.co/models)
- [Community Forum](https://discuss.huggingface.co/)

## Need Help?

- Check the [Hugging Face Discord](https://discord.gg/hugging-face)
- Browse [Stack Overflow](https://stackoverflow.com/questions/tagged/huggingface)
- Open an issue in this repository

---

**Happy coding! 🎉**
