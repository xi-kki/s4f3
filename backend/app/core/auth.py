from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import httpx
from app.core.config import settings
from functools import lru_cache

security = HTTPBearer()

# Cache JWKS from Supabase
@lru_cache(maxsize=1)
async def get_supabase_jwks():
    """Fetch Supabase JWT signing keys"""
    try:
        async with httpx.AsyncClient() as client:
            # Get Supabase JWT secret from API settings
            response = await client.get(
                f"{settings.SUPABASE_URL}/auth/v1/jwks",
                headers={"apikey": settings.SUPABASE_ANON_KEY}
            )
            return response.json()
    except Exception:
        return None

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Verify JWT token and return user_id"""
    token = credentials.credentials
    
    try:
        # Decode JWT using Supabase JWT secret
        # Supabase uses HS256 with the JWT secret
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: no user ID"
            )
        
        return user_id
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )

# Optional auth - allows unauthenticated access but extracts user_id if present
async def optional_verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))
) -> str | None:
    """Optional JWT verification - returns user_id or None"""
    if not credentials:
        return None
    
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
        return payload.get("sub")
    except:
        return None
