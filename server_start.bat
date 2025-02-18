@echo off
cd frontend
start "Frontend" cmd /c "npm run start"

cd ../backend
start "Backend" cmd /c "npm start"

echo Both frontend and backend are starting...
exit
