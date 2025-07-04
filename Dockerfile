# Black-Jack/Dockerfile
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy static files
COPY index.html style.css script.js images/ sounds/ ./

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
