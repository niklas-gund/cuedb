FROM node:18 AS build
WORKDIR /app
COPY package* ./
COPY yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM nginx:1.19-alpine
COPY nginx.conf /etc/nginx/
COPY .htaccess /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html
