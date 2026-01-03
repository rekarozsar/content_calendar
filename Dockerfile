# Multi-stage Dockerfile for building and serving the Angular app
# Build stage: use Node to install dependencies and compile the app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies (use npm ci for reproducible install)
COPY package*.json ./
RUN npm ci --silent --no-audit --progress=false

# Copy source and build the production bundle
COPY . .
RUN npm run build -- --configuration=production

# Production stage: serve static files with nginx
FROM nginx:stable-alpine

# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx config if present (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build artifacts. Angular typically writes to dist/<project>/ or dist/<project>/browser
# Copy the whole dist directory and then normalize so index.html sits at /usr/share/nginx/html
COPY --from=build /app/dist/ /usr/share/nginx/html/

# If the build produced a nested folder (e.g. dist/content_calendar/browser), move its contents to webroot
RUN INDEX_DIR=$(find /usr/share/nginx/html -type f -name index.html -exec dirname {} \; | head -n 1) && \
		if [ -n "$INDEX_DIR" ] && [ "$INDEX_DIR" != "/usr/share/nginx/html" ]; then \
			echo "[docker] moving contents of $INDEX_DIR to webroot"; \
			cp -a "$INDEX_DIR/." /usr/share/nginx/html/ || true; \
		fi

# Ensure nginx can read files
RUN chown -R nginx:nginx /usr/share/nginx/html || true
RUN chmod -R 755 /usr/share/nginx/html || true

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

