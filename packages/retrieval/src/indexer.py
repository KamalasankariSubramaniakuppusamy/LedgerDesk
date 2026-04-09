"""Policy document indexing service."""
import uuid

import structlog
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.policy import PolicyDocument, PolicyChunk
from chunker import chunk_policy_document
from embeddings import get_embedding

logger = structlog.get_logger()


async def index_policy_document(
    db: AsyncSession,
    doc_id: uuid.UUID,
    api_key: str | None = None,
) -> int:
    """Index a policy document: chunk it and generate embeddings."""
    result = await db.execute(select(PolicyDocument).where(PolicyDocument.id == doc_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise ValueError(f"Document {doc_id} not found")

    # Delete existing chunks
    await db.execute(
        text("DELETE FROM policy_chunks WHERE document_id = :doc_id"),
        {"doc_id": doc_id},
    )

    # Chunk the document
    chunks = chunk_policy_document(doc.title, doc.content, str(doc_id))
    logger.info("indexing_document", doc_id=str(doc_id), title=doc.title, chunks=len(chunks))

    # Generate embeddings and save chunks
    for chunk in chunks:
        embedding = await get_embedding(chunk.content, api_key=api_key, use_local=True)

        db_chunk = PolicyChunk(
            id=uuid.uuid4(),
            document_id=doc_id,
            chunk_index=chunk.chunk_index,
            content=chunk.content,
            section_title=chunk.section_title,
            embedding=embedding,
            extra_data=chunk.metadata,
        )
        db.add(db_chunk)

    await db.flush()
    logger.info("document_indexed", doc_id=str(doc_id), chunks_created=len(chunks))
    return len(chunks)


async def index_all_policies(db: AsyncSession, api_key: str | None = None) -> dict:
    """Index all active policy documents."""
    result = await db.execute(
        select(PolicyDocument).where(PolicyDocument.is_active)
    )
    docs = result.scalars().all()

    total_chunks = 0
    for doc in docs:
        count = await index_policy_document(db, doc.id, api_key)
        total_chunks += count

    return {"documents_indexed": len(docs), "total_chunks": total_chunks}
