# Multi-stage build for OmniPulse AI Studio
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN node ./node_modules/typescript/bin/tsc --noEmit && node ./node_modules/vite/bin/vite.js build

# Production Nginx Server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
