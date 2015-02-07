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
	
	`$ ~ cd Downloads/aksite`
	
3. Install Node.js & NPM
	http://nodejs.org/download/
4. Install GraphicsMagick
	The site depends upon the `gm` module, which depends upon GraphicsMagick being installed and added to the machine's path. Download it [here](http://www.graphicsmagick.org/).
5. Install Bower globally

	`npm install -g bower`
	> **Note:** On *nix Operating systems, global NPM installations must be run with `sudo`

6. Install Grunt globally

	`npm install -g grunt`
	
7. Install Node.js dependencies

	`$ ~/Downloads/aksite npm install`

8. Install Bower dependencies

	`$ ~/Downloads/aksite bower install`
	
9.  Run the local server under the development environment

	`$ ~/Downloads/aksite grunt serve`