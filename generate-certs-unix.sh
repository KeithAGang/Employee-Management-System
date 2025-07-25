#!/bin/sh

CERTS_DIR="certs"
CERT_FILE="$CERTS_DIR/localhost.crt"
KEY_FILE="$CERTS_DIR/localhost.key"

mkdir -p "$CERTS_DIR"

if command -v mkcert >/dev/null 2>&1; then
    echo "Using mkcert..."
    mkcert -install >/dev/null 2>&1 || true
    mkcert -cert-file "$CERT_FILE" -key-file "$KEY_FILE" localhost 127.0.0.1 ::1
elif command -v openssl >/dev/null 2>&1; then
    echo "mkcert not found, using openssl..."
    openssl req -x509 -newkey rsa:4096 -keyout "$KEY_FILE" -out "$CERT_FILE" -days 365 -nodes -subj "/CN=localhost"
else
    echo "❌ ERROR: Neither mkcert nor openssl found. Install one and retry."
    exit 1
fi

echo "✅ Certificates generated in $CERTS_DIR/"
