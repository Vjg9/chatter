FROM node:19-alpine AS build

WORKDIR /app
COPY . .
RUN npm i 
RUN npm run build

FROM nginx:1.23.2-alpine AS deploy

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
