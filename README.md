[![Build Status](https://api.travis-ci.org/Awk34/aksite.svg)](https://travis-ci.org/Awk34/aksite)
[![Dependency Status](https://david-dm.org/awk34/aksite.svg)](https://david-dm.org/awk34/aksite)
[![devDependency Status](https://david-dm.org/awk34/aksite/dev-status.svg)](https://david-dm.org/awk34/aksite#info=devDependencies)

Andrew Koroluk
===================

##Building Locally
1. [Install Git](http://www.git-scm.com/downloads)

2. [Install MongoDB](https://www.mongodb.org/downloads) and have a running daemon
	
3. [Install Node.js & NPM](http://nodejs.org/download/) (Node ^4.2.2, npm ^2.0.0)

4. [Install GraphicsMagick](http://www.graphicsmagick.org/) and make sure it is added to your PATH

5. Install Bower globally

	`npm install -g bower`

6. Install Gulp globally

	`npm install -g gulp`

7. Download the source files
    1. Download ZIP: [https://github.com/Awk34/aksite/archive/master.zip]
    2. HTTPS:  `git clone https://github.com/Awk34/aksite.git`
    3. SSH: `git clone git@github.com:Awk34/aksite.git`
	
	`cd aksite`
	
8. Install Node.js dependencies

	`npm install`

9. Install Bower dependencies

	`bower install`
	
10.  Run the local server under the development environment

	`gulp serve`

=====

##Testing

From the project root, run `npm test`
