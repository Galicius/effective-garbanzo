# Stage 1: Build Stage
FROM node:20-alpine as build

WORKDIR /app

# Install dependencies
COPY aplikacija/package*.json ./
RUN npm install

# Copy source code and build
COPY aplikacija ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
