from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.content import Resource
from app.schemas.content import ResourceCreate, ResourceUpdate, Resource as ResourceResponse

router = APIRouter()

@router.get("/", response_model=List[ResourceResponse])
def read_resources(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve resources.
    """
    resources = db.query(Resource).offset(skip).limit(limit).all()
    return resources

@router.post("/", response_model=ResourceResponse)
def create_resource(
    *,
    db: Session = Depends(deps.get_db),
    resource_in: ResourceCreate,
) -> Any:
    """
    Create new resource.
    """
    resource = Resource(**resource_in.model_dump())
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource

@router.get("/{resource_id}", response_model=ResourceResponse)
def read_resource(
    resource_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific resource by id.
    """
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found",
        )
    return resource 