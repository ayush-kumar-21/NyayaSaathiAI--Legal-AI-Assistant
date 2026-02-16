"""
Structured logging configuration.
Named logging_config.py to avoid shadowing Python's logging module.
"""
import logging
import sys
from app.core.config import settings


def setup_logging() -> logging.Logger:
    """Configure application logging."""
    log_level = logging.DEBUG if settings.ENVIRONMENT == "development" else logging.INFO

    # Create formatter
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)

    # Root logger
    root_logger = logging.getLogger("nyaya_saathi")
    root_logger.setLevel(log_level)
    root_logger.addHandler(console_handler)

    # Suppress noisy loggers
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

    return root_logger


logger = setup_logging()
