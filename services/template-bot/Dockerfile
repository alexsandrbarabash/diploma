FROM node:18-alpine 
COPY package.json package.json
COPY yarn.lock  yarn.lock
COPY tsconfig.json  tsconfig.json
COPY tsconfig.build.json  tsconfig.build.json
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 5001
# Start application
CMD ["node", "dist/main.js" ]