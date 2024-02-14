FROM node:18
WORKDIR /srv
COPY package* ./
COPY yarn.lock ./
COPY . ./
RUN yarn
CMD yarn dev