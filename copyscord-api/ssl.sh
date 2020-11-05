#!/bin/bash
openssl genrsa 2048 > ./cert/server.key
chmod 400 ./cert/server.key
openssl req -new -x509 -nodes -sha256 -days 365 -key ./cert/server.key -out ./cert/server.crt