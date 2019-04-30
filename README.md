# ME-ASSISTANT
## Dépendances
- Docker/Docker Desktop => 2.0.0.3
- NodeJS =>10.15.3, npm =>6.4.1
- Prisma => 1.30
- Vue CLI => 3.5.5
## Serveur
### Développement

- Installation des dépendances :  `npm install`
- Lancement du serveur Prisma et de la base de donnée : `docker-compose up -d`
- Déploiement des models : `prisma deploy`
- Lancement en mode développement : `npm run dev`

### Production
- Installation des dépendances : `npm install --only=prod`
- Container lancé avec un serveur prisma et une base de donnée mongoDB
- Configurer les variables d'environnement `.env` ou `.env.local`
- Déploiement des models : `prisma deploy`
- Compilation du serveur : `npm run build`

## Client
### Développement
- Installation des dépendances : `npm install`
- Lancement en mode développement : `npm run serve`
---
### Production

- Installation des dépendances : `npm install --only=prod`
- Configuration des variables d'environnement : `.env` ou `.env.local`
- Compilation de l'application : `npm run build`