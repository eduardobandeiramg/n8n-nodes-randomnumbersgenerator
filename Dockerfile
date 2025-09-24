FROM n8nio/n8n:latest

WORKDIR /home/node/.n8n

# Copia todo o projeto
COPY . /home/node/.n8n/

# Ajusta permissões
USER root
RUN chown -R node:node /home/node/.n8n
USER node

# Instala dependências e ferramentas de build globais
RUN npm install
RUN npm install -g typescript gulp rimraf

# Build do projeto
RUN npm run build

CMD ["n8n", "start"]
