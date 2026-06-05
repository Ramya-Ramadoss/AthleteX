from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.database.database import engine, Base
    from backend.routes import sports, training, performance
except ImportError:
    from database.database import engine, Base
    from routes import sports, training, performance

app = FastAPI(title="AthleteX Sports Training Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sports.router)
app.include_router(training.router)
app.include_router(performance.router)

Base.metadata.create_all(bind=engine)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to AthleteX Sports Training Tracker API"}
