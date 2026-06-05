from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

try:
    from backend.database.database import SessionLocal
    from backend.models.sport_model import Sport as SportModel
    from backend.schemas.sport_schema import SportCreate, SportUpdate, Sport as SportSchema
except ImportError:
    from database.database import SessionLocal
    from models.sport_model import Sport as SportModel
    from schemas.sport_schema import SportCreate, SportUpdate, Sport as SportSchema

router = APIRouter(prefix="/sports", tags=["Sports"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=SportSchema)
def create_sport(sport: SportCreate, db: Session = Depends(get_db)):
    new_sport = SportModel(sport_name=sport.sport_name)
    db.add(new_sport)
    db.commit()
    db.refresh(new_sport)
    return new_sport


@router.get("/", response_model=list[SportSchema])
def read_sports(db: Session = Depends(get_db)):
    return db.query(SportModel).all()


@router.put("/{sport_id}", response_model=SportSchema)
def update_sport(sport_id: int, sport: SportUpdate, db: Session = Depends(get_db)):
    existing_sport = db.query(SportModel).filter(SportModel.id == sport_id).first()
    if not existing_sport:
        raise HTTPException(status_code=404, detail="Sport not found")
    existing_sport.sport_name = sport.sport_name
    db.commit()
    db.refresh(existing_sport)
    return existing_sport


@router.delete("/{sport_id}")
def delete_sport(sport_id: int, db: Session = Depends(get_db)):
    existing_sport = db.query(SportModel).filter(SportModel.id == sport_id).first()
    if not existing_sport:
        raise HTTPException(status_code=404, detail="Sport not found")
    db.delete(existing_sport)
    db.commit()
    return {"detail": "Sport deleted"}
