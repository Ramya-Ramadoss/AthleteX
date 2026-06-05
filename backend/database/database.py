import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Use DATABASE_URL from environment if provided. This allows connecting to
# a real PostgreSQL server in production, or falling back to a lightweight
# SQLite database for quick local development.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./athletex.db")

# Create SQLAlchemy engine. SQLite requires a special connect_args value.
if DATABASE_URL.startswith("sqlite"):
	engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
	engine = create_engine(DATABASE_URL)

# Create a session factory bound to the engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for SQLAlchemy models
Base = declarative_base()
