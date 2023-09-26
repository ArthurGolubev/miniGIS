from fastapi import APIRouter
from .workflow import workflow
from .user import user
from .automation import automation
from .algorithm import algorithm

router = APIRouter()



router.include_router(workflow.router)
router.include_router(user.router)
router.include_router(automation.router)
router.include_router(algorithm.router)
