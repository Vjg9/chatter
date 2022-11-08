FROM node:19-alpine AS build

WORKDIR /app
COPY . .
RUN npm i 
ENV DATABASE_URL "file:./prod.db"
ENV SECRET="907c64c3ec2108a8158d4e331242d9bb295e8f6c8920c0066079d5c62202dc6c546f83d6cfdd1dd3684f439afbf19f76b1c1565f0ae58fdf801bf6206ae2db51"	 
RUN npx prisma migrate deploy
RUN npx tsc

FROM node:19-alpine AS deploy

WORKDIR /app
ENV DATABASE_URL "file:./prod.db"
ENV SECRET="907c64c3ec2108a8158d4e331242d9bb295e8f6c8920c0066079d5c62202dc6c546f83d6cfdd1dd3684f439afbf19f76b1c1565f0ae58fdf801bf6206ae2db51"	 
COPY --from=build /app/dist .
COPY --from=build /app/package.json .
COPY --from=build /app/prisma .
RUN npm i --only=prod
RUN npx prisma generate
RUN mkdir static && mkdir static/user && mkdir static/chat
ENTRYPOINT ["node", "main.js"]
