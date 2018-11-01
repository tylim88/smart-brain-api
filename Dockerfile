FROM node:8.12.0
# tell docker to use which node image from docker hub
# this is called parent image

WORKDIR /usr/src/smart-brain-api
# when we enter container we will be in this directory

# COPY package.json ./
# this copy package.json to working directory

COPY ./ ./
# copy everything from current directory into the container to working directore

RUN npm install
# run npm install when container is building
# can run many steps

CMD ["/bin/bash"]
# run what command line to run when you type docker run 
# this command go to bin/bash, which is bash shell
# default step, can only run one command