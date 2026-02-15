"""
NyayaSaathiAI — FastAPI Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging_config import logger
from app.core.exceptions import NyayaException, nyaya_exception_handler
from app.db.database import create_all_tables
from app.api.v1.router import api_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="NyayaSaathiAI",
        description="AI-powered Legal Justice Platform",
        version="2.0.0",
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Exception handlers
    app.add_exception_handler(NyayaException, nyaya_exception_handler)

    # Routes
    app.include_router(api_router)

    @app.on_event("startup")
    async def startup():
        logger.info("Starting NyayaSaathiAI...")
        create_all_tables()
        logger.info("NyayaSaathiAI ready ✅")

    @app.get("/health")
    async def health():
        return {"status": "healthy", "version": "2.0.0"}

    return app


app = create_app()
