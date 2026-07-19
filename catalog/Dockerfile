FROM node:20-slim

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . . 

RUN npx prisma generate 

EXPOSE 5013

CMD ["npm", "run", "dev"]
