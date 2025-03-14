# 🐠 ChatBocal

ChatBocal est un chatbot local propulsé par **Ollama** et plusieurs modèles, notamment **Llama 3.2**, **DeepSeek-LLM**, **DeepSeek-R1** et **Phi3**, avec une application Next.js qui gère à la fois l’interface utilisateur et l’API backend et une base de données PostgreSQL. L'ensemble tourne grâce à Docker 🐳.

---

## 🚀 Stack technique

- **Application** : Next.js (React + API Routes)
- **LLM** : Ollama avec Llama 3.2
- **Database** : PostgreSQL avec Drizzle ORM
- **Containerisation** : Docker + Docker Compose

---

## ⚙️ Installation

### 1. Cloner le projet
```bash
git clone https://github.com/ton-utilisateur/chatbocal.git
cd chatbocal
```

### 2. Configuration
Crée un fichier `.env` à partir de l'exemple :
```bash
cp .env.example .env
```
Adapte les variables si besoin.

### 3. Lancer les services
```bash
docker-compose up --build
```

---

## 🌐 Accès

- Application (Frontend & Backend API) : [http://localhost:3000](http://localhost:3000)
- Ollama (LLM) : [http://localhost:11434](http://localhost:11434)
- Database (PostgreSQL) : [http://localhost:5432](http://localhost:5432)

---

## 🛠️ Commandes utiles

```bash
# Arrêter les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f

# Accéder à un conteneur
docker exec -it chatbocal-backend-1 sh
```

---

## 📝 Todo

- [ ] Pouvoir uploader des fichiers.
- [ ] Déployer en production.
- [ ] Ajouter des tests.

---

## 📄 Licence

Apache 2.0 © [Maxime Dubois](https://github.com/makcimerrr)