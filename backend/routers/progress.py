from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models, database, auth, crud

router = APIRouter(
    prefix="/api/progress",
    tags=["Progress"]
)

@router.get("/solved", response_model=List[schemas.SolvedProblemResponse])
def get_solved_problems(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    problems = crud.get_solved_problems(db, user_id=current_user.id)
    return problems

@router.post("/submit", response_model=schemas.SolvedProblemResponse)
def submit_problem(submission: schemas.ProblemSubmit, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    # Basic validation is handled by Pydantic schema, but we could add more complex logic here
    # e.g., checking if problem_slug is in a predefined list of valid problems.
    solved_record = crud.submit_problem(db, user=current_user, submission=submission)
    return solved_record
