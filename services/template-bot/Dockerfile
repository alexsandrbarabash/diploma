FROM node:18-alpine 
COPY package.json package.json
COPY tsconfig.json  tsconfig.json
COPY tsconfig.build.json  tsconfig.build.json
RUN npm install
COPY . .
RUN npm run prisma:generate
RUN npm run build
EXPOSE 5001
# Start application
CMD ["npm", "run", "start:prod" ]