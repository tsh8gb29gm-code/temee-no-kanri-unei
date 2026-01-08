@echo off
setlocal
chcp 65001 >nul

echo ===================================================
echo   てめえの管理運営 - インターネット公開ランチャー
echo ===================================================
echo.

REM Node.jsの確認
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.jsが見つかりません。
    echo 以下のサイトからNode.js（LTS版）をインストールしてください。
    echo https://nodejs.org/
    echo.
    echo インストール後、このスクリプトを再度実行してください。
    echo.
    pause
    exit /b
)

REM 依存関係のインストール確認
if not exist "node_modules" (
    echo [INFO] 依存関係をインストールしています...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install に失敗しました。
        pause
        exit /b
    )
)

echo [INFO] アプリケーションをビルド・起動しています...

REM 開発サーバーをバックグラウンドで起動
start /b npm run dev

echo [INFO] サーバー起動待機中...
timeout /t 5 /nobreak >nul

echo.
echo ===================================================
echo   重要: 以下の情報を確認してください
echo ===================================================
echo.
echo スマホでアクセスした際、パスワードを求められる場合があります。
echo その場合は、以下のIPアドレスを入力してください:
echo.

REM 公開IP（パスワード）を取得・表示
for /f %%i in ('curl -s https://loca.lt/mytunnelpassword') do set TUNNEL_PASSWORD=%%i
echo   パスワード (Tunnel Password): %TUNNEL_PASSWORD%
echo.
echo ===================================================
echo.

echo [INFO] 公開URLを発行しています...
echo.
echo 以下のURLにスマホからアクセスしてください:
echo.

REM Localtunnelを起動
call npx localtunnel --port 5173

pause
