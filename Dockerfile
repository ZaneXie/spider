FROM node:6

RUN npm config set registry https://registry.npm.taobao.org
RUN npm install -g typings typescript mocha
