#!/bin/bash

rm -rf /home/ubuntu/aksite

export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

#apt-get install git
#
#curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
#source ~/.bash_profile
#source ~/.bashrc
nvm install 4.3.1
#
#npm install -g forever gulp
