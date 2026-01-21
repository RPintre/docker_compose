FROM node:20-alpine
WORKDIR /app
COPY ./frontend/src/ .
RUN npm install
EXPOSE 3000
CMD ["node", "index.js"]
