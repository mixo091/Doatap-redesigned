FROM node:12.18.0

WORKDIR /doatap

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]