#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Stat-Assist Demo Launcher ===${NC}"
echo -e "${YELLOW}This script will start all Stat-Assist services for demonstration.${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is required but not installed. Please install Node.js 18+ to run this demo.${NC}"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}Python 3 is required but not installed. Please install Python 3.9+ to run this demo.${NC}"
    exit 1
fi

# Create virtual environments if they don't exist
if [ ! -d "statassist-api/venv" ]; then
    echo -e "${GREEN}Creating virtual environment for API service...${NC}"
    python3 -m venv statassist-api/venv
fi

if [ ! -d "powersim-service/venv" ]; then
    echo -e "${GREEN}Creating virtual environment for PowerSim service...${NC}"
    python3 -m venv powersim-service/venv
fi

# Install dependencies
echo -e "${GREEN}Installing API service dependencies...${NC}"
source statassist-api/venv/bin/activate
pip install -r statassist-api/requirements.txt
deactivate

echo -e "${GREEN}Installing PowerSim service dependencies...${NC}"
source powersim-service/venv/bin/activate
pip install -r powersim-service/requirements.txt
deactivate

echo -e "${GREEN}Installing UI dependencies...${NC}"
cd statassist-ui && npm install && cd ..

# Start services
echo -e "${GREEN}Starting all services...${NC}"
echo -e "${YELLOW}API service will run on http://localhost:8000${NC}"
echo -e "${YELLOW}PowerSim service will run on http://localhost:8001${NC}"
echo -e "${YELLOW}UI will run on http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop all services${NC}"

# Start services in background
source statassist-api/venv/bin/activate
cd statassist-api && python -m uvicorn app.main:app --reload --port 8000 &
API_PID=$!
cd ..

source powersim-service/venv/bin/activate
cd powersim-service && python -m uvicorn app.main:app --reload --port 8001 &
POWERSIM_PID=$!
cd ..

cd statassist-ui && npm run dev &
UI_PID=$!
cd ..

# Wait for user to press Ctrl+C
trap "kill $API_PID $POWERSIM_PID $UI_PID; exit" INT
wait
