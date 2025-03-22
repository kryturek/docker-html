# Start from the official Nginx base image
FROM nginx:alpine

# Copy your custom HTML into the default nginx public folder
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY nginx/default.conf /etc/nginx/conf.d/default.conf