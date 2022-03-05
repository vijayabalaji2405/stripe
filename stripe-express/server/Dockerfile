FROM node:16
WORKDIR /usr/src/app

#install package
COPY package.json .
RUN npm install


#specify production envirnment
ENV NODE_ENV=production


#copy files over
COPY . .

#build it
RUN npm run build


#serve it
CMD ["npm" , "start"]


