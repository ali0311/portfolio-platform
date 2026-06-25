# --- Stage 1: build the production bundle -----------------------------------
FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_URL=http://localhost:4000
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
COPY .npmrc ./

RUN npm ci --userconfig ./.npmrc

COPY . .

RUN npm run build

# --- Stage 2: serve static files via nginx ----------------------------------
FROM nginx:1.27-alpine AS runner

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
