# Prerequisites

- docker

# Getting started

1. Create .env file in root folder with the content below:

   ```
   #Google
   GOOGLE_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   GOOGLE_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXX

   #Auth
   NEXTAUTH_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   APP_PORT=3000
   NEXTAUTH_URL=http://localhost:${APP_PORT}

   #Database
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   POSTGRES_DB=plot_prospector
   POSTGRES_PORT=5432
   DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:${POSTGRES_PORT}/${POSTGRES_DB}
   ```

   XXXXXXXXXXXXXXXXXXXXXXXXXXXXX - specific secret key\
   xxxxxxxxxxxxxxxxxxxxxxxxxxxxx - whatever secret key\
   Get GOOGLE_CLIENT from https://console.cloud.google.com/apis/credentials

2. Run `docker:build`
3. Open up http://localhost:3000/ in a web browser

# DB migrations

1. Make desired changes in `schema.prisma` file
2. Make sure containers are running
3. Run `prisma:migrate`
4. Restart Typescript Service in your IDE, or IDE itself, in order to see updated prisma types

# DB GUI

1. Make sure containers are running
2. Run `prisma:studio`

# Useful scripts

Removing all running containers, images and volumes: `docker rm -f $(docker ps -a -q); docker rmi -f $(docker images -a -q); docker volume rm $(docker volume ls -q)`

# ENV

After adding new env variable to .env file, it is recommended to provide corresponding variable type in env.ts file.

# Ignore files

Our repository employs an automated generation of ignore files: .dockerignore, .prettierignore, and .eslintignore. These are formed by merging specific and general ignore files. The process occurs during the commit phase.

Note: Do not modify these auto-generated ignore files manually. Update the respective .specific file or .gitignore as required. Manual changes to auto-generated files will be overwritten on the next commit.

# Troubleshooting

- Error in running container, or in "Install dependencies based on the preferred package manager" step:\
  `Error: request to https://binaries.prisma.sh/all_commits/6b0aef69b7cdfc787f822ecd7cdc76d5f1991584/linux-musl-openssl-3.0.x/libquery_engine.so.node.sha256 failed, reason: write EPROTO 58CB15ADDF7F0000:error:0A000152:SSL routines:final_renegotiate:unsafe legacy renegotiation disabled:../deps/openssl/openssl/ssl/statem/extensions.c:921:`\
  Solution: Disable VPN
- Errors in running container: `Error: P1001: Can't reach database server at db:5432`, or `/bin/sh: pnpm: not found`\
  Solution: It looks like these errors can be ignored

# Setting up in Production

// TODO
