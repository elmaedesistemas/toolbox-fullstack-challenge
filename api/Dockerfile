FROM node:14.21.3-bullseye-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production

COPY src ./src

USER node

EXPOSE 3001

CMD ["npm", "start"]