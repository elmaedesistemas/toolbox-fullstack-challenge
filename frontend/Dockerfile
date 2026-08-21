FROM node:16.20.2-bullseye-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY babel.config.js webpack.config.js ./
COPY public ./public
COPY src ./src

RUN npm run build

FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]