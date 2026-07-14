import httpx
from app.core.config import settings

async def get_embedding(text: str) -> list:
    """Get embedding vector for text using OpenAI"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/embeddings",
            headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
            json={"input": text, "model": "text-embedding-3-small"}
        )
        return response.json()["data"][0]["embedding"]

async def summarize_content(url: str, title: str = "", content: str = "") -> dict:
    """Summarize content using Groq"""
    from groq import Groq
    
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    prompt = f"""Analyze this bookmark and return JSON:
    URL: {url}
    Title: {title}
    Content snippet: {content[:500]}
    
    Return: {{"summary": "2-sentence summary", "tags": ["tag1", "tag2", "tag3"], "content_type": "link|article|video|tool|image"}}"""
    
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"}
    )
    
    import json
    return json.loads(chat_completion.choices[0].message.content)

async def chat_with_bookmarks(message: str, bookmarks_context: str) -> str:
    """Chat with user's bookmarks using Groq"""
    from groq import Groq
    
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": f"You are a helpful AI assistant for a bookmark manager. Answer questions about the user's saved bookmarks.\n\nBookmarks context:\n{bookmarks_context}"},
            {"role": "user", "content": message}
        ],
        model="llama-3.3-70b-versatile"
    )
    
    return chat_completion.choices[0].message.content
