from fastapi import APIRouter
from .unsupervision import unsupervision

router = APIRouter(
    prefix='/workflow',
    )

router.include_router(unsupervision.router)
