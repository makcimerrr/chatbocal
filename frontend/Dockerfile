# Utilise l'image officielle Node.js
FROM node:18

# Crée le dossier de l'app
WORKDIR /app

# Copie les fichiers de dépendances et installe
COPY package*.json ./
RUN npm install

# Copie le reste du code source
COPY . .

# Build l'application Next.js
RUN npm run build

# Expose le port de Next.js
EXPOSE 3000

# Lance Next.js en production
CMD ["npm", "start"]