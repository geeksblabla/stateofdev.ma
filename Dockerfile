# Stage 1: Build Stage
FROM node:18 as builder

RUN npm install --unsafe-perm=true -g netlify-cli

WORKDIR /app

# Copy only the necessary files for installing dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the source code
COPY . .

# https://stackoverflow.com/questions/69394632/webpack-build-failing-with-err-ossl-evp-unsupported
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build the application
RUN yarn build

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8888/ || exit 1

EXPOSE 8888

ENTRYPOINT ["yarn", "start"]

