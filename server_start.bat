@echo off
cd frontend
start "Frontend" cmd /c "npm run start"

cd ../backend
start "Backend" cmd /c "pm2 start index.js"

echo Both frontend and backend are starting...
exit
