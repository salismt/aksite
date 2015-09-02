[![Build Status](https://api.travis-ci.org/Awk34/aksite.svg)](https://travis-ci.org/Awk34/aksite)
[![Dependency Status](https://david-dm.org/awk34/aksite.svg)](https://david-dm.org/awk34/aksite)
[![devDependency Status](https://david-dm.org/awk34/aksite/dev-status.svg)](https://david-dm.org/awk34/aksite#info=devDependencies)

Andrew Koroluk
===================

##Building Locally
1. [Install Git](http://www.git-scm.com/downloads)

2. [Install MongoDB](https://www.mongodb.org/downloads)
	
3. [Install Node.js & NPM](http://nodejs.org/download/)

4. [Install GraphicsMagick](http://www.graphicsmagick.org/) and make sure it is added to your PATH

5. Install Bower globally

	`npm install -g bower`
	> **Note:** On *nix Operating systems, global NPM installations must be run with `sudo`

6. Install Grunt globally

	`npm install -g grunt`

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

	`grunt serve`

=====

##Testing

Install `grunt-cli` locally (`npm install grunt-cli`)

From the project root, run `npm test`
