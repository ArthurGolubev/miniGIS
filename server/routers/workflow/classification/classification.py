from fastapi import APIRouter
from .unsupervised import unsupervised

router = APIRouter(
    prefix='/classification',
    )

router.include_router(unsupervised.router)
