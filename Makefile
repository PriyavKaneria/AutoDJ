.PHONY: server
server:
	@echo "Starting server..."
	uvicorn server.main:app --reload

.PHONY: studio
studio:
	@echo "Starting studio..."
	cd studio && npm run dev

# Path: Makefile