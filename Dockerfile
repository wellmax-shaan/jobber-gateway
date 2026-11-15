 FROM node:21-alpine3.18 as builder

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY tools ./tools
COPY .npmrc ./
COPY src ./src

WORKDIR /app
RUN apk add --no-cache curl
COPY package.json ./
COPY tsconfig.json ./
COPY .npmrc ./
RUN npm install -g pm2 npm@latest
RUN npm ci --production
COPY --from=builder /app/build ./build

EXPOSE 4001

CMD [ "npm", "run", "start" ]