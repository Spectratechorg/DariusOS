from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.audit import record_audit_event
from app.core.security import create_access_token, get_password_hash, verify_password, UserRole
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserCreateRequest, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticates email and password, returning JWT bearer token."""
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    token = create_access_token(
        subject=user.id,
        role=UserRole(user.role) if user.role in [r.value for r in UserRole] else UserRole.ENGINEER
    )

    record_audit_event(
        db=db,
        action="USER_LOGIN",
        user_id=user.id,
        resource_type="user",
        resource_id=user.id,
        details={"email": user.email, "role": user.role}
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(request: UserCreateRequest, db: Session = Depends(get_db)):
    """Registers a new user account with hashed credentials."""
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )

    user = User(
        email=request.email,
        full_name=request.full_name,
        hashed_password=get_password_hash(request.password),
        role=request.role if request.role in ["admin", "engineer", "viewer"] else "engineer",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    record_audit_event(
        db=db,
        action="USER_REGISTERED",
        user_id=user.id,
        resource_type="user",
        resource_id=user.id,
        details={"email": user.email, "role": user.role}
    )

    return user


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Returns profile details of the authenticated caller."""
    return current_user
