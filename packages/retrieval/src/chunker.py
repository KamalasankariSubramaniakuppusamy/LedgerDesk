"""Document chunking for policy documents."""

import re
import uuid
from dataclasses import dataclass, field


@dataclass
class Chunk:
    content: str
    chunk_index: int
    section_title: str | None = None
    document_id: str | None = None
    document_title: str | None = None
    metadata: dict = field(default_factory=dict)
    id: str = field(default_factory=lambda: str(uuid.uuid4()))


def chunk_markdown(
    content: str, max_chunk_size: int = 1500, overlap: int = 200
) -> list[Chunk]:
    """Chunk markdown content by sections, with size limits."""
    sections = re.split(r"\n(?=###?\s)", content)
    chunks: list[Chunk] = []

    for section in sections:
        section = section.strip()
        if not section:
            continue

        # Extract section title
        title_match = re.match(r"^#{1,4}\s+(.+)", section)
        section_title = title_match.group(1).strip() if title_match else None

        if len(section) <= max_chunk_size:
            chunks.append(
                Chunk(
                    content=section,
                    chunk_index=len(chunks),
                    section_title=section_title,
                )
            )
        else:
            # Split large sections by paragraphs
            paragraphs = section.split("\n\n")
            current = ""
            for para in paragraphs:
                if len(current) + len(para) + 2 > max_chunk_size and current:
                    chunks.append(
                        Chunk(
                            content=current.strip(),
                            chunk_index=len(chunks),
                            section_title=section_title,
                        )
                    )
                    # Keep overlap from end of previous chunk
                    if overlap > 0 and len(current) > overlap:
                        current = current[-overlap:] + "\n\n" + para
                    else:
                        current = para
                else:
                    current = current + "\n\n" + para if current else para

            if current.strip():
                chunks.append(
                    Chunk(
                        content=current.strip(),
                        chunk_index=len(chunks),
                        section_title=section_title,
                    )
                )

    return chunks


def chunk_policy_document(title: str, content: str, doc_id: str) -> list[Chunk]:
    """Chunk a policy document and attach metadata."""
    chunks = chunk_markdown(content)
    for chunk in chunks:
        chunk.document_id = doc_id
        chunk.document_title = title
        chunk.metadata = {
            "source": "policy",
            "document_title": title,
            "section": chunk.section_title,
        }
    return chunks
