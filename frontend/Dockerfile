FROM node:20-alpine

WORKDIR /app

# Copia só os arquivos de dependência primeiro (cache de build)
COPY package.json package-lock.json ./
RUN npm ci

# Copia o resto do código
COPY . .

EXPOSE 5173

# --host é essencial: sem isso o Vite só escuta em localhost DENTRO do container,
# e fica inacessível de fora
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]