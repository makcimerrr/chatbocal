# 🐠 ChatBocal

ChatBocal est un chatbot local propulsé par **Ollama** et le modèle **Llama 3.2**, avec un backend Express, un frontend Next.js et une base de données PostgreSQL. L'ensemble tourne grâce à Docker 🐳.

---

## 🚀 Stack technique

- **Frontend** : Next.js (React)
- **Backend** : Express.js (Node.js)
- **LLM** : Ollama avec Llama 3.2
- **Database** : PostgreSQL
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

- Frontend : [http://localhost:3000](http://localhost:3000)
- Backend API : [http://localhost:3001/api/chat](http://localhost:3001/api/chat)
- Ollama (LLM) : [http://localhost:11434](http://localhost:11434)

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

- [ ] Ajouter la persistance des historiques de chat.
- [ ] Déployer en production.
- [ ] Ajouter des tests.

---

## 📄 Licence

MIT © [Maxime Dubois](https://github.com/makcimerrr)