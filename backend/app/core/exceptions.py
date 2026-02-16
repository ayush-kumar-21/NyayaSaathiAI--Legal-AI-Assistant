from fastapi import Request
from fastapi.responses import JSONResponse
from datetime import datetime


class NyayaException(Exception):
    def __init__(self, message: str, code: str, status_code: int = 400):
        self.message = message
        self.code = code
        self.status_code = status_code


class InvalidStatusTransition(NyayaException):
    def __init__(self, from_status, to_status):
        super().__init__(
            message=f"Cannot transition from {from_status} to {to_status}",
            code="INVALID_STATUS_TRANSITION",
            status_code=422
        )


class CaseNotFound(NyayaException):
    def __init__(self, identifier):
        super().__init__(
            message=f"Case not found: {identifier}",
            code="CASE_NOT_FOUND",
            status_code=404
        )


class EvidenceTampered(NyayaException):
    def __init__(self, evidence_id):
        super().__init__(
            message=f"Evidence {evidence_id} hash mismatch - possible tampering",
            code="EVIDENCE_TAMPERED",
            status_code=409
        )


class UnauthorizedAccess(NyayaException):
    def __init__(self, role: str):
        super().__init__(
            message=f"Role '{role}' not authorized for this action",
            code="UNAUTHORIZED",
            status_code=403
        )


async def nyaya_exception_handler(request: Request, exc: NyayaException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.code,
            "message": exc.message,
            "timestamp": datetime.utcnow().isoformat()
        }
    )
