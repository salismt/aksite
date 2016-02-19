#!/bin/bash

apt-get install git

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
source ~/.bash_profile
source ~/.bashrc
nvm install 4.3.0

npm install -g forever gulp-cli
