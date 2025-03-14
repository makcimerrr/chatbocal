# Use the node base image
FROM node:18-alpine

# Installer les outils client PostgreSQL
RUN apk add --no-cache postgresql-client

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of your application files
COPY . .

# Build the Next.js application
RUN pnpm run build

# Expose the port your app will run on
EXPOSE 3000

# Define the command to run your application in production mode
CMD ["pnpm", "start"]