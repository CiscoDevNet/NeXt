# NeXt UI Framework

NeXt UI toolkit is an HTML5/JavaScript based toolkit for network web application. Provide high performance and high quality framework and network centric topology component.

https://wiki.opendaylight.org/view/NeXt:Main

Current version : 0.9

## Build instructions

### Environment requriements

We require these tools in your system to build the project.

* GNU
  * Coreutils
  * Findutils
  * SED
  * Make
* NodeJS & NPM
  * PhantomJS
  * LESS
  * YUIDoc
  * Uglify

### For Debian/Ubuntu
Install the required software:
* npm install

Build the project:
* make clean
* make

### For Mac OS X with Brew
Install the required software:

If you do not have [Homebrew](http://brew.sh), use this command to install it:

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
* brew install gnu-sed
* brew install node
* npm install

Define the path to NodeJS modules:
* export NODE_PATH=/usr/local/lib/node_modules/

Build the project:
* make clean
* make

## Key Features

* Build interactive topology on top of web browser
* Speak to the backend via REST API
* Customize topology for your needs
* Use powerful solution by the leader in industry
* Acquaint NeXt with AngularJS: they'll get along with each other

## Who's Using NeXt

* Cisco
* Verizon
* AT&T (DIRECTV)

Are you NeXt?

## Bugs

[Open Bugs](https://bugs.opendaylight.org/buglist.cgi?bug_status=__open__&product=next)

## Team

* Kang Li (lkang2@cisco.com)
* Aikepaer Abuduweili (aaikepae@cisco.com)
* Alexei Zverev (alzverev@cisco.com)

Reach out these guys to report bugs, share ideas and understand the framework.