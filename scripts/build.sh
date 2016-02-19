#!/bin/bash

source ~/.bashrc

export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

nvm install 4.3.1
nvm use 4.3.1

cd /home/ubuntu/aksite
gulp build
