FROM node:latest
WORKDIR /home 
# create home directory
COPY package*.json /home
RUN npm install
COPY . /home
CMD ["npm","start"]

# docker build -t mogame-server:latest .
# docker run -d -p 8080:3000 mogame-server
# docker logs CONTAINER_ID
# docker container stop CONTAINER_ID
# docker rm CONTAINER_ID
# docker rmi IMAGE_ID
# docker rmi -f IMAGE_ID
# docker tag local-image:mogame-server new-repo:mogame-server
# docker tag mogame-server:latest azerc/mogame-server:latest
# docker push azerc/mogame-server:latest
