# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the application dependencies
RUN npm install
#RUN nmp run build

# Copy the rest of your application code
COPY . .

# Copy the start script
COPY start.sh ./

# Make the start script executable
RUN chmod +x start.sh

# Expose the port the app runs on
EXPOSE 5001
EXPOSE 6379

# Docker
ENV DOCKER_CONTAINER true

# Command to run the start script
#CMD ["./start.sh"]
CMD ["node", "server.js"]
#CMD nmp run ["service", "redis-server", "start"] && nmp run ["node", "server.js"]
