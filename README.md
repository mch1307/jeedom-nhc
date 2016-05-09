# jeedom-nhc
Jeedom - NHC interface developped in nodejs

Allows Jeedom and Niko Home Control to interact for lighting and power switches

# Install 
follow instruction to install app in /opt/jeedom-nhc and run it as www-data user

download zip from github
    
    sudo wget https://github.com/mch1307/jeedom-nhc/archive/master.zip
    
uncompress downloaded zip (unzip) 

cd uncompressed folder

    sudo mkdir -p /opt/jeedom-nhc
    sudo cp -R * /opt/jeedom-nhc
    sudo chown -R www-data:www-data /opt/jeedom-nhc
    cd /opt/jeedom-nhc
    sudo npm install

# Configuration
The configuration is handled in conf.js and should work fine as is. 

The custom config, reflecting the local needs (ip, hostnames, keys, ...) needs to be done using NODE ENV.

The following variables are needed before launching the app:

    JEEHOST: hostname running Jeedom
    JEEAPI: Jeedom JSONRPC Api key
    JEEURL: Jeedom root url
    NHCHOST: Ip address/hostname of Niko Home Control

supervisor can be used in order to run the app, more info can be found on the Wiki

# Features
