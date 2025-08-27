@echo off
echo 🚀 Paradise Family Restaurant Menu - VS Code Setup
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ package.json not found! Make sure you're in the project root directory.
    echo.
    pause
    exit /b 1
)

echo ✅ Project files found

REM Check if .env.local exists
if not exist ".env.local" (
    echo.
    echo 🔧 Creating .env.local file...
    echo VITE_FIREBASE_API_KEY=AIzaSyAYuSiwMkEJoTeNrvmUGh0GovPrMACRg > .env.local
    echo VITE_FIREBASE_AUTH_DOMAIN=paradise-family.firebaseapp.com >> .env.local
    echo VITE_FIREBASE_PROJECT_ID=paradise-family >> .env.local
    echo VITE_FIREBASE_STORAGE_BUCKET=paradise-family.firebasestorage.app >> .env.local
    echo VITE_FIREBASE_MESSAGING_SENDER_ID=477641412672 >> .env.local
    echo VITE_FIREBASE_APP_ID=1:477641412672:web:140084cd4275aab3b34fa5 >> .env.local
    echo VITE_FIREBASE_MEASUREMENT_ID=G-XWQXEJXV71 >> .env.local
    echo ✅ .env.local created
) else (
    echo ✅ .env.local already exists
)

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!

REM Start the development server
echo.
echo 🎯 Starting development server...
echo.
echo The application will open at: http://localhost:5173
echo.
echo Test these menu URLs:
echo   • Non-AC: http://localhost:5173?menu=dinein-non-ac
echo   • AC: http://localhost:5173?menu=dinein-ac
echo   • Takeaway: http://localhost:5173?menu=takeaway
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev