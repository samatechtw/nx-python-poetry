from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.api import upload_item, user, auth

api_router = APIRouter()

@api_router.get('/health/app')
def healthcheck() -> None:
    return JSONResponse({ 'status': 'ok' })