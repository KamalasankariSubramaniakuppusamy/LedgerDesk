"""Embedding generation for chunks."""
import hashlib
import json
from pathlib import Path

import numpy as np


# Cache directory for embeddings in dev mode
CACHE_DIR = Path(__file__).parent.parent.parent.parent / ".embedding_cache"


def _cache_key(text: str) -> str:
    return hashlib.md5(text.encode()).hexdigest()


async def generate_embedding_openai(text: str, api_key: str, model: str = "text-embedding-3-small") -> list[float]:
    """Generate embedding using OpenAI API."""
    import httpx

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.openai.com/v1/embeddings",
            headers={"Authorization": f"Bearer {api_key}"},
            json={"input": text, "model": model},
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()["data"][0]["embedding"]


def generate_embedding_local(text: str, dim: int = 1536) -> list[float]:
    """Generate a deterministic pseudo-embedding for development/demo.

    Uses TF-IDF-inspired hashing to create reproducible embeddings
    that preserve some semantic similarity for demo purposes.
    """
    np.random.seed(int(hashlib.md5(text.lower().encode()).hexdigest()[:8], 16) % (2**31))

    # Create a base embedding from word hashes
    words = text.lower().split()
    embedding = np.zeros(dim)
    for i, word in enumerate(words):
        word_hash = int(hashlib.md5(word.encode()).hexdigest()[:8], 16)
        np.random.seed(word_hash % (2**31))
        word_vec = np.random.randn(dim)
        # Weight by inverse position (earlier words matter more)
        weight = 1.0 / (1.0 + i * 0.1)
        embedding += word_vec * weight

    # Normalize
    norm = np.linalg.norm(embedding)
    if norm > 0:
        embedding = embedding / norm

    return embedding.tolist()


async def get_embedding(text: str, api_key: str | None = None, use_local: bool = True) -> list[float]:
    """Get embedding for text, using local fallback if no API key."""
    if api_key and not use_local:
        # Check cache first
        CACHE_DIR.mkdir(exist_ok=True)
        cache_file = CACHE_DIR / f"{_cache_key(text)}.json"
        if cache_file.exists():
            return json.loads(cache_file.read_text())

        embedding = await generate_embedding_openai(text, api_key)
        cache_file.write_text(json.dumps(embedding))
        return embedding

    return generate_embedding_local(text)


def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Compute cosine similarity between two vectors."""
    a_arr = np.array(a)
    b_arr = np.array(b)
    dot = np.dot(a_arr, b_arr)
    norm_a = np.linalg.norm(a_arr)
    norm_b = np.linalg.norm(b_arr)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot / (norm_a * norm_b))
