#!/bin/bash

source ~/.bashrc

export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

nvm use 4.3.1

aws s3 cp s3://aksite-deploy/env /root/

NODE_ENV=production $(/root/env) forever start --minUptime 1000ms --spinSleepTime 1000ms /home/ubuntu/aksite/dist/server
