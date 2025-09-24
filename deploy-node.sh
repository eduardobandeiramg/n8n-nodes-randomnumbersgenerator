#!/bin/bash
# Script para buildar e deployar seu nodo customizado do n8n usando npm.

set -e

##############################
# Step 0: Detect Package Name
##############################
PACKAGE_NAME=$(node -p "require('./package.json').name")

if [ -z "$PACKAGE_NAME" ]; then
  echo "Erro: não foi possível determinar o nome do package no package.json"
  exit 1
fi

echo "Nome do package detectado: '$PACKAGE_NAME'"

##############################
# Step 1: Build do Node
##############################
echo "Construindo o nodo..."
npm run build

##############################
# Step 2: Deploy para pasta ./nodes
##############################
TARGET_DIR="./nodes/$PACKAGE_NAME"
SOURCE_DIR="./dist"

echo "Deployando build para '$TARGET_DIR'..."

# Limpa versão antiga e cria diretório
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

# Copia os arquivos
cp -r "$SOURCE_DIR/"* "$TARGET_DIR/"

echo "Deploy concluído."

##############################
# Step 3: Inicia/reinicia n8n via docker-compose
##############################
echo "Subindo/reiniciando n8n..."
docker-compose up -d n8n

echo "Deploy finalizado. n8n está rodando com o nodo '$PACKAGE_NAME'."
