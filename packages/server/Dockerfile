FROM oven/bun:1.1.6-alpine as base

# Set the working directory in the container
WORKDIR /usr/src/app
# Need this for the health checks to pass
RUN apk add curl

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base as install
RUN mkdir -p /temp/dev
COPY package.json /temp/dev/
RUN cd /temp/dev && bun install

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
RUN cd /temp/prod && bun install --production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# verify that the app builds before deploys
ENV NODE_ENV=production
RUN bun run build

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/src/ .
COPY --from=prerelease /usr/src/app/package.json .

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "./index.ts" ]
