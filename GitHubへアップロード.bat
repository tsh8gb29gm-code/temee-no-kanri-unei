@echo off
setlocal
chcp 65001 >nul

echo ========================================================
echo   GitHubへのアップロード（更新対応版）
echo ========================================================

REM Git初期化チェック
if not exist ".git" (
    echo [ERROR] Gitリポジトリが見つかりません。
    pause
    exit /b
)

echo.
echo [INFO] 変更を検出しています...
git add .
git commit -m "Fix build errors" 2>nul

echo.
echo [INFO] GitHubへアップロードしています...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] アップロードに失敗しました。
    echo 以下の点を確認してください:
    echo - 前回の「GitHubへアップロード」でのリポジトリURL設定は済んでいますか？
    echo - GitHubにログインしていますか？
) else (
    echo.
    echo [SUCCESS] アップロード完了！
    echo Vercelで自動的に再デプロイが始まります。
)

echo.
pause
