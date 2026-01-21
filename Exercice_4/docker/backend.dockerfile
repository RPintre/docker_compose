FROM node:20-alpine
WORKDIR /app
COPY ./back/src/package.json .
RUN npm install
COPY ./back/src .
EXPOSE 5000
CMD ["node", "index.js"]
