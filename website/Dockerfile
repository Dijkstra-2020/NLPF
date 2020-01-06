# Use a lighter version of Node as a parent image
FROM mhart/alpine-node:8.11.4
WORKDIR /website
COPY package*.json /website/
COPY .env /website/
# install dependencies
RUN npm install -g npm@latest
RUN npm i --unsafe-perm
RUN npm install dotenv@8.2.0 finale-rest@1.1.0 --save
COPY . /website/
EXPOSE 80
# Run the app when the container launches
CMD ["npm", "run", "dev"]