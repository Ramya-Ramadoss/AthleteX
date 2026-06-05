from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

try:
    from backend.database.database import SessionLocal
    from backend.models.performance_model import Performance as PerformanceModel
    from backend.schemas.performance_schema import PerformanceCreate, PerformanceUpdate, Performance as PerformanceSchema
except ImportError:
    from database.database import SessionLocal
    from models.performance_model import Performance as PerformanceModel
    from schemas.performance_schema import PerformanceCreate, PerformanceUpdate, Performance as PerformanceSchema

router = APIRouter(prefix="/performance", tags=["Performance"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=PerformanceSchema)
def create_performance(performance: PerformanceCreate, db: Session = Depends(get_db)):
    overall_score = (performance.speed + performance.accuracy + performance.stamina) / 3
    new_performance = PerformanceModel(
        speed=performance.speed,
        accuracy=performance.accuracy,
        stamina=performance.stamina,
        overall_score=overall_score,
    )
    db.add(new_performance)
    db.commit()
    db.refresh(new_performance)
    return new_performance


@router.get("/", response_model=list[PerformanceSchema])
def read_performance_records(db: Session = Depends(get_db)):
    return db.query(PerformanceModel).all()


@router.put("/{performance_id}", response_model=PerformanceSchema)
def update_performance(performance_id: int, performance: PerformanceUpdate, db: Session = Depends(get_db)):
    existing_performance = db.query(PerformanceModel).filter(PerformanceModel.id == performance_id).first()
    if not existing_performance:
        raise HTTPException(status_code=404, detail="Performance record not found")
    existing_performance.speed = performance.speed
    existing_performance.accuracy = performance.accuracy
    existing_performance.stamina = performance.stamina
    existing_performance.overall_score = (performance.speed + performance.accuracy + performance.stamina) / 3
    db.commit()
    db.refresh(existing_performance)
    return existing_performance


@router.delete("/{performance_id}")
def delete_performance(performance_id: int, db: Session = Depends(get_db)):
    existing_performance = db.query(PerformanceModel).filter(PerformanceModel.id == performance_id).first()
    if not existing_performance:
        raise HTTPException(status_code=404, detail="Performance record not found")
    db.delete(existing_performance)
    db.commit()
    return {"detail": "Performance record deleted"}
