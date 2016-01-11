![Build Status](https://codeship.com/projects/63c8f830-8803-0133-06c0-2eae657aa6d0/status?branch=master)
[![Dependency Status](https://david-dm.org/awk34/aksite.svg)](https://david-dm.org/awk34/aksite)
[![devDependency Status](https://david-dm.org/awk34/aksite/dev-status.svg)](https://david-dm.org/awk34/aksite#info=devDependencies)

Andrew Koroluk
===================

##Technologies Used

* MongoDB
* ExpressJS
* AngularJS
* Node.js
* Git
* Babel
* Gulp
* Webpack
* D3
* Karma
* Mocha
* Protractor
* Socket.io
* Sass
* Codeship
* Amazon Web Services
* JetBrains WebStorm
* Atlassian SourceTree

##Running Locally
1. [Install Git](http://www.git-scm.com/downloads)

2. [Install MongoDB](https://www.mongodb.org/downloads) and have a running daemon

3. [Install Node.js & NPM](http://nodejs.org/download/) (Node ^4.2.3, npm ^2.14.2)

4. [Install GraphicsMagick](http://www.graphicsmagick.org/) and make sure it is added to your PATH

5. Install Gulp globally

	`npm install -g gulp`

6. Download the source files
    1. Download ZIP: [https://github.com/Awk34/aksite/archive/master.zip]
    2. HTTPS:  `git clone https://github.com/Awk34/aksite.git`
    3. SSH: `git clone git@github.com:Awk34/aksite.git`

	`cd aksite`

7. Install Node.js dependencies

	`npm install`

8.  Run the local server under the development environment

	`gulp serve`

=====

##Building

1. `gulp build`

2. `NODE_ENV=production node dist/server/`

##Testing

From the project root, run `gulp test`
