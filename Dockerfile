FROM node:18.16.0-alpine
# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN #npm install --global yarn
RUN yarn install
RUN yarn global add react-scripts@5.0.1

EXPOSE 3001
# add app
COPY . ./

# start app
CMD ["yarn", "start"]