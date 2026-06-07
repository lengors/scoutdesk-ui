FROM node:24.11.1-alpine3.22 AS builder
COPY . /app/
WORKDIR /app
RUN npm ci --ignore-scripts
RUN npm run build

FROM nginx:1.29.3-alpine3.22-slim
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf