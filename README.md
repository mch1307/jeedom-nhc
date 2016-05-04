# jeedom-nhc
Jeedom - NHC interface developped in nodejs

Allows Jeedom and Niko Home Control to interact for lighting and power switches

# Install
download zip from github

uncompress downloaded zip 

cd jeedom-nhc

npm install

# Configuration
The configuration is done in conf.js. The custom config needs to be done using NODE ENV.

The following variables are needed before launching the app:

    JEEHOST: hostname running Jeedom
    JEEAPI: Jeedom JSONRPC Api key
    JEEURL: Jeedom root url
    NHCHOST: Ip address/hostname of Niko Home Control

supervisor can be used in order to run the app, more info can be found on the Wiki

# Features
