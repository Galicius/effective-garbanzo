FROM node:20-alpine

# Install required build dependencies
RUN apk add --no-cache python3 py3-pip make g++ libc-dev cairo-dev pango-dev libjpeg-turbo-dev libpng-dev giflib-dev

# Set working directory
WORKDIR /app

# Install dependencies
COPY aplikacija/package*.json ./
RUN npm install

# Copy source code and build
COPY aplikacija ./
RUN npm run build

# Stage 2: Use NGINX for serving
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
