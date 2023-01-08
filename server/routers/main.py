from .workflow import workflow
from fastapi import APIRouter

router = APIRouter()
router.include_router(workflow.router)