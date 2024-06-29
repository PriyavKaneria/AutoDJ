# Variables
PYTHON = python3
VENV = env
PIP = $(VENV)/scripts/pip.exe
PYTHON_VENV = $(VENV)/scripts/python.exe
SCRIPT = dj_audience_counter.py
IMAGE_PATH = images/plain.png

# Targets
.PHONY: all setup install run-opinion run-battle clean

all: setup install

setup:
	@echo "Setting up virtual environment..."
	$(PYTHON) -m venv $(VENV)

install:
	@echo "Installing dependencies..."
	$(PIP) install -r requirements.txt

run-opinion:
	@echo "Running in opinion_count mode..."
	$(PYTHON_VENV) $(SCRIPT) --mode opinion_count --image $(IMAGE_PATH)

run-opinion-camera:
	@echo "Running in opinion_count mode with camera..."
	$(PYTHON_VENV) $(SCRIPT) --mode opinion_count

run-battle:
	@echo "Running in battle_opinion mode..."
	$(PYTHON_VENV) $(SCRIPT) --mode battle_opinion --image $(IMAGE_PATH)

run-battle-camera:
	@echo "Running in battle_opinion mode with camera..."
	$(PYTHON_VENV) $(SCRIPT) --mode battle_opinion

clean:
	@echo "Cleaning up..."
	rm -rf $(VENV)

help:
	@echo "Available commands:"
	@echo "  make setup     : Set up a virtual environment"
	@echo "  make install   : Install dependencies"
	@echo "  make run-opinion : Run in opinion_count mode (replace path/to/your/image.jpg with your image path)"
	@echo "  make run-battle  : Run in battle_opinion mode (replace path/to/your/image.jpg with your image path)"
	@echo "  make clean     : Remove the virtual environment"
	@echo "  make help      : Show this help message"