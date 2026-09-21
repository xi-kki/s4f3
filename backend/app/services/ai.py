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
        model="llama-3.1-70b-versatile",
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
        model="llama-3.1-70b-versatile"
    )
    
    return chat_completion.choices[0].message.content

async def fetch_url_preview(url: str) -> dict | None:
    """Fetch URL metadata for preview (title, description, image, favicon)"""
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            response = await client.get(url, headers={"User-Agent": "Mozilla/5.0 (compatible; S4F3Bot/1.0)"})
            if response.status_code != 200:
                return None
            
            html = response.text
            
            # Extract metadata from HTML
            title = None
            description = None
            image_url = None
            favicon_url = None
            
            # Parse meta tags
            import re
            
            # Title
            title_match = re.search(r'<title[^>]*>([^<]+)</title>', html, re.IGNORECASE)
            if title_match:
                title = title_match.group(1).strip()
            
            # Meta tags
            meta_patterns = {
                'description': [
                    r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\']',
                    r'<meta[^>]*property=["\']og:description["\'][^>]*content=["\']([^"\']+)["\']',
                    r'<meta[^>]*name=["\']twitter:description["\'][^>]*content=["\']([^"\']+)["\']',
                ],
                'image_url': [
                    r'<meta[^>]*property=["\']og:image["\'][^>]*content=["\']([^"\']+)["\']',
                    r'<meta[^>]*name=["\']twitter:image["\'][^>]*content=["\']([^"\']+)["\']',
                ],
                'favicon_url': [
                    r'<link[^>]*rel=["\']icon["\'][^>]*href=["\']([^"\']+)["\']',
                    r'<link[^>]*rel=["\']shortcut icon["\'][^>]*href=["\']([^"\']+)["\']',
                ],
            }
            
            for key, patterns in meta_patterns.items():
                for pattern in patterns:
                    match = re.search(pattern, html, re.IGNORECASE)
                    if match:
                        if key == 'description':
                            description = match.group(1).strip()
                        elif key == 'image_url':
                            image_url = match.group(1).strip()
                        elif key == 'favicon_url':
                            favicon_url = match.group(1).strip()
                        break
            
            # Extract domain for source
            from urllib.parse import urlparse
            parsed = urlparse(url)
            source = parsed.netloc.replace('www.', '')
            
            # Make favicon and image URLs absolute
            if favicon_url and not favicon_url.startswith('http'):
                favicon_url = f"{parsed.scheme}://{parsed.netloc}{favicon_url}"
            if image_url and not image_url.startswith('http'):
                image_url = f"{parsed.scheme}://{parsed.netloc}{image_url}"
            
            return {
                "title": title or source,
                "description": description or "No description available",
                "image_url": image_url,
                "favicon_url": favicon_url,
                "source": source,
            }
    except Exception:
        return None