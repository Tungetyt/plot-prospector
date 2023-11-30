All operations and commands should be done/run in root folder

# Prerequisites

- git
- docker
- pnpm

# Getting started

1. Create .env file with the content below:

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
   DATABASE_HOSTNAME=db
   DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DATABASE_HOSTNAME}:${POSTGRES_PORT}/${POSTGRES_DB}
   ```

   XXXXXXXXXXXXXXXXXXXXXXXXXXXXX - specific secret key\
   xxxxxxxxxxxxxxxxxxxxxxxxxxxxx - whatever secret key\
   Get GOOGLE_CLIENT from https://console.cloud.google.com/apis/credentials \
   For non docker development (slower) use:
   `DATABASE_HOSTNAME=localhost` instead

2. Make sure Docker is running and Internet connection is established
3. Run `docker:build`
4. Open up http://localhost:<APP_PORT> in a web browser. The application should be fully functional at this point
5. Run `pnpm i`
6. Run `prisma:local:generate-types`

# Installing new dependencies

1. Run `pnpm i <new-dependency-name>`
2. Delete running docker containers
3. Run `docker:build`

# DB migrations

1. Make desired changes in `schema.prisma` file
2. Make sure containers are running
3. Run `prisma:migrate`
4. Restart Typescript Service in your IDE, or IDE itself, in order to see updated prisma types

# DB GUI

1. Make sure containers are running
2. Run `prisma:studio`

# Web Browser for development

Google Chrome is preferred. Firefox is slow to hot reload.

# ENV

After adding new env variable to .env file, it is recommended to provide corresponding variable type in env.ts file.

# Ignore files

The repository employs an automated generation of ignore files: .dockerignore, .prettierignore, and .eslintignore. These are formed by merging specific and general ignore files. The process occurs during the commit phase.

Note: Do not modify these auto-generated ignore files manually. Update the respective .specific file or .gitignore as required. Manual changes to auto-generated files will be overwritten on the next commit.

# Useful scripts

Deleting all running containers, images and volumes: `docker rm -f $(docker ps -a -q); docker rmi -f $(docker images -a -q); docker volume rm $(docker volume ls -q)`

# Troubleshooting

- Error in running container, or in "Install dependencies based on the preferred package manager":\
  - `Error: request to https://binaries.prisma.sh/all_commits/6b0aef69b7cdfc787f822ecd7cdc76d5f1991584/linux-musl-openssl-3.0.x/libquery_engine.so.node.sha256 failed, reason: write EPROTO 58CB15ADDF7F0000:error:0A000152:SSL routines:final_renegotiate:unsafe legacy renegotiation disabled:../deps/openssl/openssl/ssl/statem/extensions.c:921:`\
    Solution: Disable VPN
  - ```[next-js deps 4/4] RUN   if [ -f yarn.lock ]; then yarn --frozen-lockfile;   elif [ -f package-lock.json ]; then npm ci;   elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile;   else echo "Lockfile not found." && exit 1;   fi:
    0.573 yarn global v1.22.19
    0.631 [1/4] Resolving packages...
    2.390 error An unexpected error occurred: "https://registry.yarnpkg.com/pn
    pm: write EPROTO 58AB52C9A37F0000:error:0A000152:SSL routines:final_renego
    tiate:unsafe legacy renegotiation disabled:../deps/openssl/openssl/ssl/statem/extensions.c:921:
    2.390 ".
    2.390 info If you think this is a bug, please open a bug report with the i
    nformation provided in "/usr/local/share/.config/yarn/global/yarn-error.log".
    2.390 info Visit https://yarnpkg.com/en/docs/cli/global for documentation about this command.
    ------
    failed to solve: process "/bin/sh -c if [ -f yarn.lock ]; then yarn --froz
    en-lockfile;   elif [ -f package-lock.json ]; then npm ci;   elif [ -f pnp
    m-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile;   el
    se echo \"Lockfile not found.\" && exit 1;   fi" did not complete successfully: exit code: 1
    ```
    Solution: Disable VPN
- Errors in running container: `Error: P1001: Can't reach database server at db:5432`, or `/bin/sh: pnpm: not found`\
  Solution: It looks like these errors can be ignored
- Error in Browser DevTools: `Unhandled Runtime Error
ChunkLoadError: Loading chunk app/[locale]/page failed.
(missing: http://localhost:3000/_next/static/chunks/app/%5Blocale%5D/page.js)`\
   Solution: Refresh the page
- Warnings in Browser DevTools:
  - `The resource http://localhost:3000/_next/static/css/app/[locale]/layout.css?v=1691919891150 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate as value and it is preloaded intentionally.` \
    Solution: Ignore
  - `[Fast Refresh] performing full reload` \
    Solution: Ignore
  - ```
    Failed to compile
    ./globals.css.webpack[javascript/auto]!=!./node_modules/.pnpm/next@14.0.3_@babel+core@7.23.3_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[12].oneOf[12].use[2]!./node_modules/.pnpm/next@14.0.3_@babel+core@7.23.3_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[12].oneOf[12].use[3]!./globals.css
    SyntaxError: Unexpected token, expected ";" (33:9)
    This error occurred during the build process and can only be dismissed by fixing the error.
    ```
    Solution: \
    1. fix compiling errors in code
    2. delete running containers
    3. run `docker:build`
    4. refresh the page couple of times
- Warning in Browser DevTools after Plot cancellation: `Form submission canceled because the form is not connected` \
  Solution: Ignore
- Error in Browser DevTools after renaming file:
  ```
  Failed to read source code from /app/features/PlotCreationController/PlotInfoForm/action.ts
  Caused by:
  No such file or directory (os error 2)
  ```
  Solution: Ignore
- Error in Browser DevTools after building app with Turbopack:

  ```Error: failed to receive message
  Caused by:
  - reading packet length
  - timeout while receiving message from process
  - deadline has elapsed

  This error happened while generating the page. Any console logs will be displayed in the terminal window.
  ```

  Solution: Unknown

- Error in terminal while running `docker:build`:

  ```
  request returned Internal Server Error for API route and version
  http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.24/containers/json?all=1&filters=%7B%22label%22%3A%7B%22com.docker.compose.config-hash%22%3Atrue%2C%22com.docker.compose.project%3Dplot-prospector%22%3Atrue%7D%7D,
  check if the server supports the requested API version
   ELIFECYCLE  Command failed with exit code 1.
  ```

  Solution: Docker is not running. Start Docker

- Error running migration:

  - ```
    > plot-prospector@0.1.0 prisma:migrate C:\dev\di\plot-prospector
    > docker-compose exec next-js npx prisma migrate dev && npx prisma generate
    Environment variables loaded from .env
    Prisma schema loaded from schema.prisma
    Datasource "db": PostgreSQL database "plot_prospector", schema "public" at "db:5432"

    Error: P1002


    The database server at `db`:`5432` was reached but timed out.

    Please try again.

    Please make sure your database server is running at `db`:`5432`.

    Context: Timed out trying to acquire a postgres advisory lock (SELECT pg_advisory_lock(72707369)). Elapsed: 10000ms. See https://pris.ly/d/migrate-advisory-locking for details.


    ELIFECYCLE  Command failed with exit code 1.
    ```

    Solution: \

    1. Delete running docker containers
    2. Run `docker:build`
    3. Run `prisma:migrate` again

  - ```
    > plot-prospector@0.1.0 prisma:migrate C:\dev\di\plot-prospector
    > docker-compose exec next-js npx prisma migrate dev && npx prisma generate

    > Downloading Prisma engines for Node-API for linux-musl-openssl-3.0.x [] 0% ELIFECYCLE  Command failed with exit code 137.

    Process finished with exit code 1
    ```

    Solution: \

    1. Delete running docker containers
    2. Turn off VPN
    3. Run `docker:build`
    4. Run `prisma:migrate` again

# Deployment

// TODO
