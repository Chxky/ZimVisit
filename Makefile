.PHONY: help install dev build test lint format clean docker-up docker-down docker-build reset-db

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "Installing Node.js dependencies..."
	npm install
	@echo "Installing Python dependencies..."
	cd apps/backend/ai-service && pip install -r requirements.txt

dev: ## Run all services in development mode
	npm run dev

build: ## Build all apps for production
	npm run build

test: ## Run all tests
	cd apps/backend/nestjs && npm test
	cd apps/backend/ai-service && python -m pytest tests/ -v

test-backend: ## Run backend tests only
	cd apps/backend/nestjs && npm test

test-ai: ## Run AI service tests only
	cd apps/backend/ai-service && python -m pytest tests/ -v

lint: ## Run linting across all projects
	npm run lint

format: ## Format code with Prettier
	npx prettier --write "**/*.{ts,tsx,js,json,md,yml,yaml}"

format-check: ## Check formatting without writing
	npx prettier --check "**/*.{ts,tsx,js,json,md,yml,yaml}"

docker-up: ## Start all Docker services
	docker compose up -d

docker-down: ## Stop all Docker services
	docker compose down

docker-build: ## Rebuild all Docker images
	docker compose build

docker-reset: ## Full reset — wipes database volumes
	docker compose down -v

docker-logs: ## Tail logs from all services
	docker compose logs -f

docker-ps: ## List running services
	docker compose ps

migration-generate: ## Generate a new TypeORM migration
	cd apps/backend/nestjs && npm run migration:generate -- name=$(name)

migration-run: ## Run pending migrations
	cd apps/backend/nestjs && npm run migration:run

reset-db: ## Wipe and recreate the database
	docker compose down -v
	docker compose up -d postgres redis
	@echo "Waiting for Postgres..."
	@sleep 5
	docker compose up -d ai-service api
	@echo "Done. Register users via POST /api/v1/auth/register"
