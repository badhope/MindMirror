from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings


_is_sqlite = settings.DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if _is_sqlite else {}

engine_kwargs = {"connect_args": connect_args}
if not _is_sqlite:
    engine_kwargs.update(
        {
            "pool_pre_ping": True,
            "pool_size": 10,
            "max_overflow": 20,
            # Recycle connections well before NAT / load-balancer idle
            # timeouts typically kick in (AWS NLB defaults to 350s, k8s
            # service default is unlimited but proxies in front often
            # aren't). 1800s is a conservative middle ground.
            "pool_recycle": 1800,
        }
    )

engine = create_engine(settings.DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
