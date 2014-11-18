[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) 

Andrew Koroluk
===================

##Building Locally
1. Install Git
	http://www.git-scm.com/downloads
2. Download the source files
    1. Download `.zip`
    2. HTTPS:  `git clone https://USERNAME@bitbucket.org/awk34/aksite.git`
    3. SSH: `git clone git@bitbucket.org:awk34/aksite.git`
3. Install Node.js & NPM
	http://nodejs.org/download/
4. Install Bower globally

	`npm install -g bower`
	> **Note:** On *nix Operating systems, global NPM installations must be run with `sudo`

5. Install Grunt globally

	`npm install -g grunt`
	
6. Install Node.js dependencies

	```
	$ ~ cd Downloads/aksite`
	$ ~/Downloads/aksite npm install
	
	```
7. Install Bower dependencies

	```
	$ ~/Downloads/aksite bower install
	
	```
8.  Run the local server under the development environment

	```
	$ ~/Downloads/aksite grunt serve
	
	```

