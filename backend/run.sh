#!/bin/bash
# Backend startup helper for AthleteX
cd "$(dirname "$0")"/..

python -m pip install -r requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
