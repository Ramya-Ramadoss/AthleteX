from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

try:
    from backend.database.database import SessionLocal
    from backend.models.training_model import TrainingLog as TrainingModel
    from backend.schemas.training_schema import TrainingCreate, TrainingUpdate, Training as TrainingSchema
except ImportError:
    from database.database import SessionLocal
    from models.training_model import TrainingLog as TrainingModel
    from schemas.training_schema import TrainingCreate, TrainingUpdate, Training as TrainingSchema

router = APIRouter(prefix="/training", tags=["Training"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=TrainingSchema)
def create_training(training: TrainingCreate, db: Session = Depends(get_db)):
    new_training = TrainingModel(
        sport_id=training.sport_id,
        training_date=training.training_date,
        hours=training.hours,
    )
    db.add(new_training)
    db.commit()
    db.refresh(new_training)
    return new_training


@router.get("/", response_model=list[TrainingSchema])
def read_training_logs(db: Session = Depends(get_db)):
    return db.query(TrainingModel).all()


@router.put("/{training_id}", response_model=TrainingSchema)
def update_training(training_id: int, training: TrainingUpdate, db: Session = Depends(get_db)):
    existing_training = db.query(TrainingModel).filter(TrainingModel.id == training_id).first()
    if not existing_training:
        raise HTTPException(status_code=404, detail="Training log not found")
    existing_training.sport_id = training.sport_id
    existing_training.training_date = training.training_date
    existing_training.hours = training.hours
    db.commit()
    db.refresh(existing_training)
    return existing_training


@router.delete("/{training_id}")
def delete_training(training_id: int, db: Session = Depends(get_db)):
    existing_training = db.query(TrainingModel).filter(TrainingModel.id == training_id).first()
    if not existing_training:
        raise HTTPException(status_code=404, detail="Training log not found")
    db.delete(existing_training)
    db.commit()
    return {"detail": "Training log deleted"}
