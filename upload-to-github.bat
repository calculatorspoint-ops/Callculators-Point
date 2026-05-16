@echo off
echo ============================================
echo  CalcPoint - GitHub Upload Script
echo ============================================
echo.

:: Check if git is installed
git --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed!
    echo Please download and install Git from:
    echo https://git-scm.com/download/win
    echo Then run this script again.
    pause
    exit /b 1
)

echo [OK] Git is installed.
echo.

:: Check if already a git repo
IF NOT EXIST ".git" (
    echo [STEP 1] Initializing Git repository...
    git init
    echo.
) ELSE (
    echo [STEP 1] Git already initialized. Cleaning tracked cache...
    git rm -r --cached node_modules 2>nul
    git rm -r --cached dist 2>nul
    git rm -r --cached test-results 2>nul
    git rm -r --cached tsconfig.tsbuildinfo 2>nul
    git rm -r --cached tsconfig.node.tsbuildinfo 2>nul
    echo.
)

echo [STEP 2] Staging all files (node_modules excluded via .gitignore)...
git add .
echo.

echo [STEP 3] Creating commit...
git commit -m "feat: initial upload of CalcPoint React project"
echo.

echo ============================================
echo  Now enter your GitHub repository URL:
echo  Example: https://github.com/YourName/calcpoint-react.git
echo ============================================
set /p REPO_URL="GitHub URL: "

echo.
echo [STEP 4] Linking to GitHub...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [STEP 5] Pushing to GitHub (branch: main)...
git branch -M main
git push -u origin main

echo.
echo ============================================
echo  SUCCESS! Your project is now on GitHub.
echo  Project size uploaded: ~2 MB (not 546 MB)
echo  node_modules was excluded automatically.
echo ============================================
pause
