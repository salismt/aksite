#!/bin/bash

NODE_ENV=production FACEBOOK_ID=5785462937955 FACEBOOK_SECRET=c22c765290a6b4341aec903a2b60f58a GOOGLE_ID=693903895035-1lk6sfgma8o270mk4icngumgnomuahob.apps.googleusercontent.com GOOGLE_SECRET=guxErTez9HmJvURJRSyLi2II TWITTER_ID=hmxlHnYyEjC34BhB1hshiAcHI TWITTER_SECRET=TJwWelNAtAF9kze9T8layUw9CDrjjyqwciOLfLCW28I0AHU2x3 LINKEDIN_ID=75yzb6tgaxvubn LINKEDIN_SECRET=c8tnBGJP1UPxmEWH GITHUB_ID=bef6241a643a8397e002 GITHUB_SECRET=f3cf99c1c6e56fb00a1010b7df94f375d8a98b0d MONGOLAB_URI=mongodb://52.5.62.173:27017/aksite OPBEAT_ORGANIZATION_ID=e591a56fc20640149595597b429afdf9 OPBEAT_APP_ID=0618c6ba60 OPBEAT_SECRET_TOKEN=dabe4275f0701ee51bde9bb1723d4bc911cd5903 forever --minUptime 1000ms --spinSleepTime 1000ms -c "node --harmony" /home/ubuntu/aksite/dist/server