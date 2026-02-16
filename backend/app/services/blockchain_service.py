import uuid
import hashlib
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models import BlockchainRecord
from app.core.logging_config import logger


class BlockchainService:
    """Akhand Ledger - Simple blockchain implementation for evidence integrity."""

    def __init__(self, db: Session):
        self.db = db

    def _get_last_block(self) -> BlockchainRecord | None:
        return self.db.query(BlockchainRecord).order_by(
            BlockchainRecord.block_number.desc()
        ).first()

    def _compute_block_hash(self, data_hash: str, prev_hash: str,
                            block_number: int, nonce: int = 0) -> str:
        """Compute block hash from components."""
        block_data = f"{data_hash}{prev_hash}{block_number}{nonce}"
        return hashlib.sha256(block_data.encode()).hexdigest()

    def anchor_record(self, data_hash: str, reference_id: str,
                      reference_table: str) -> BlockchainRecord:
        """Anchor a record to the blockchain."""
        last_block = self._get_last_block()
        prev_hash = last_block.block_hash if last_block else "0" * 64
        block_number = (last_block.block_number + 1) if last_block else 1

        block_hash = self._compute_block_hash(data_hash, prev_hash, block_number)

        record = BlockchainRecord(
            id=str(uuid.uuid4()),
            record_type=reference_table.upper(),
            reference_id=reference_id,
            reference_table=reference_table,
            data_hash=data_hash,
            previous_hash=prev_hash,
            block_hash=block_hash,
            block_number=block_number,
            nonce=0,
        )
        self.db.add(record)
        logger.info(f"Blockchain: Block #{block_number} anchored for {reference_table}/{reference_id[:8]}")
        return record

    def verify_chain(self) -> bool:
        """Verify the entire blockchain is intact."""
        blocks = self.db.query(BlockchainRecord).order_by(
            BlockchainRecord.block_number
        ).all()

        for i, block in enumerate(blocks):
            if i == 0:
                if block.previous_hash != "0" * 64:
                    return False
            else:
                if block.previous_hash != blocks[i - 1].block_hash:
                    logger.error(f"Chain broken at block #{block.block_number}")
                    return False

            expected_hash = self._compute_block_hash(
                block.data_hash, block.previous_hash, block.block_number
            )
            if block.block_hash != expected_hash:
                logger.error(f"Hash mismatch at block #{block.block_number}")
                return False

        return True
