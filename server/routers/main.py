from .workflow import workflow
from .user import user
from fastapi import APIRouter

router = APIRouter()

router.include_router(workflow.router)
router.include_router(user.router)