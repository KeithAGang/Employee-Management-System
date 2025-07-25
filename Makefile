# Variables
CERTS_DIR := certs

.PHONY: dev dev-win dev-unix up down clean-certs

# Default dev: runs platform-specific
dev:
ifeq ($(OS),Windows_NT)
	$(MAKE) dev-win
else
	$(MAKE) dev-unix
endif

dev-win:
	@echo "🖥️ Running Windows cert generation script..."
	@call ./generate-certs-win.bat
	@$(MAKE) up

dev-unix:
	@echo "🖥️ Running Unix cert generation script..."
	@./generate-certs-unix.sh
	@$(MAKE) up

up:
	@echo "🐳 Starting Docker containers..."
	@docker-compose up --build

down:
	@echo "🛑 Stopping Docker containers..."
	@docker-compose down

clean-certs:
	@echo "🧹 Cleaning certificates..."
ifeq ($(OS),Windows_NT)
	@if exist $(CERTS_DIR) rmdir /s /q $(CERTS_DIR)
else
	@rm -rf $(CERTS_DIR)
endif
	@echo "✅ Certificates cleaned."
