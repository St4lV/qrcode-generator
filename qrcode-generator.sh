#!/bin/bash

case "$1" in
  update)
    echo "Updating..."
    curl -L -o qrcode-generator.zip https://github.com/St4lV/qrcode-generator/archive/refs/heads/main.zip
    unzip -o qrcode-generator.zip -d ../
    rm qrcode-generator.zip
    chmod +x qrcode-generator.sh
    docker stop qrcode_gen 2>/dev/null || true
    docker container prune -f
    docker image prune -f
    echo "Updated successfully"
    ./qrcode-generator.sh start
    
    ;;
  start)
    echo "Starting..."
    docker start qrcode_gen 2>/dev/null || docker run -d --name qrcode_gen qrcode_gen
    echo "Started."
    ;;
  stop)
    echo "Stopping..."
    docker stop qrcode_gen
    echo "Stopped."
    ;;
  install)
    echo "Installing QR Code Generator..."
    docker build -t qrcode_gen .
    docker run -d --name qrcode_gen qrcode_gen
    echo "Installed successfully"
    ;;
  *)
    echo "Usage: $0 {start|stop|install|update}"
    exit 1
    ;;
esac