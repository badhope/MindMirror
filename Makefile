PYTHON ?= python3
PIP ?= pip3

.PHONY: help install dev test test-backend test-frontend lint format typecheck build \
        docker-up docker-down docker-logs clean

help:  ## Show this help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install:  ## Install backend deps (uses a venv at backend/.venv if you make one).
	cd backend && $(PIP) install -r requirements.txt

dev:  ## Run backend in dev mode.
	cd backend && $(PYTHON) run.py

test: test-backend test-frontend  ## Run everything.

test-backend:  ## Run pytest in the backend.
	cd backend && $(PYTHON) -m pytest

test-frontend:  ## Run the React unit tests (887 assertions across 7 files).
	for f in tests/unit/*.mjs; do node --import tsx "$$f" || exit 1; done

lint:  ## ESLint the frontend.
	npm run lint

format:  ## Auto-format frontend (Prettier).
	npm run format

typecheck:  ## tsc --noEmit.
	npm run typecheck

build:  ## Vite production build.
	npm run build

docker-up:  ## Bring the full stack up.
	docker compose up -d --build

docker-down:  ## Stop everything.
	docker compose down

docker-logs:  ## Tail logs from the running stack.
	docker compose logs -f --tail=100

clean:  ## Remove build artefacts and caches.
	rm -rf dist backend/__pycache__ backend/app/__pycache__ backend/.pytest_cache \
	       backend/app/*/__pycache__ backend/app/*/*/__pycache__ .vite node_modules/.vite
