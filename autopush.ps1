param(
  [string]$Message = ""
)

$ProjectDir = "c:\Users\MK INNOVEXA\Downloads\calcpoint-react"
Set-Location $ProjectDir

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  CalcPoint >> GitHub >> Vercel Auto-Deploy" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check git is available
try {
  $gitVersion = git --version 2>&1
  Write-Host "[OK] Git: $gitVersion" -ForegroundColor Green
} catch {
  Write-Host "[ERROR] Git not found. Install from https://git-scm.com" -ForegroundColor Red
  exit 1
}

# Show changed files
Write-Host ""
Write-Host "[INFO] Changed files:" -ForegroundColor Yellow
$changedFiles = git status --short
if (-not $changedFiles) {
  Write-Host "   Nothing to commit - already up to date." -ForegroundColor Gray
  exit 0
}
$changedFiles | ForEach-Object { Write-Host "   $_" -ForegroundColor White }

# Build commit message
if (-not $Message) {
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
  $fileCount  = ($changedFiles | Measure-Object).Count
  $Message    = "chore: update $fileCount file(s) [$timestamp]"
}

Write-Host ""
Write-Host "[INFO] Commit message: $Message" -ForegroundColor Cyan

# Stage all changes
Write-Host ""
Write-Host "[STEP 1] Staging all changes..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] git add failed" -ForegroundColor Red; exit 1 }

# Commit
Write-Host "[STEP 2] Committing..." -ForegroundColor Yellow
git commit -m $Message
if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] git commit failed" -ForegroundColor Red; exit 1 }

# Push to GitHub
Write-Host "[STEP 3] Pushing to GitHub (origin/main)..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "[RETRY] Trying with --set-upstream..." -ForegroundColor Red
  git push --set-upstream origin main
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  [SUCCESS] Changes pushed to GitHub!" -ForegroundColor Green
Write-Host "  [DEPLOY]  Vercel is now auto-deploying..." -ForegroundColor Green
Write-Host "  [DASH]    https://vercel.com/dashboard" -ForegroundColor Green
Write-Host "  [REPO]    https://github.com/khurram-123/calcpoint-react" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
