from sqlalchemy.orm import Session
from . import models, schemas, auth

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        points=0
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_solved_problems(db: Session, user_id: int):
    return db.query(models.SolvedProblem).filter(models.SolvedProblem.user_id == user_id).all()

def submit_problem(db: Session, user: models.User, submission: schemas.ProblemSubmit):
    existing = db.query(models.SolvedProblem).filter(
        models.SolvedProblem.user_id == user.id,
        models.SolvedProblem.problem_slug == submission.problem_slug
    ).first()

    if existing:
        return existing

    new_solved = models.SolvedProblem(
        user_id=user.id,
        problem_slug=submission.problem_slug,
        language=submission.language
    )
    
    user.points += 10

    db.add(new_solved)
    db.commit()
    db.refresh(new_solved)
    return new_solved
