@echo off
setlocal

set CERTS_DIR=certs
set CERT_FILE=%CERTS_DIR%\localhost.crt
set KEY_FILE=%CERTS_DIR%\localhost.key

if not exist "%CERTS_DIR%" (
    mkdir "%CERTS_DIR%"
)

where mkcert >nul 2>&1
if %ERRORLEVEL%==0 (
    echo Using mkcert...
    mkcert -install >nul 2>&1 || echo CA already installed
    mkcert -cert-file "%CERT_FILE%" -key-file "%KEY_FILE%" localhost 127.0.0.1 ::1
    goto end
)

echo mkcert not found, trying openssl...
where openssl >nul 2>&1
if %ERRORLEVEL%==0 (
    openssl req -x509 -newkey rsa:4096 -keyout "%KEY_FILE%" -out "%CERT_FILE%" -days 365 -nodes -subj "/CN=localhost"
    goto end
)

echo ❌ ERROR: Neither mkcert nor openssl found. Install one and retry.
exit /b 1

:end
echo ✅ Certificates generated in %CERTS_DIR%/
