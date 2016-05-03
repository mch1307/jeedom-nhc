# jeedom-nhc
Jeedom - NHC interface developped in nodejs

# Install
download zip from github
uncompress downloaded zip 
/opt
cd jeedom-nhc
npm install

# Configuration
Edit config file in conf folder, ini format, 3 sections:

NHC section:

    host= [niko ip address]
    port=8000 [should not change]
    keepAlive=60000 
    bufferSize=1048576 [not used]
    registerMsg="{\"cmd\":\"startevents\"}" [Niko socket listening registration message]
    equMsg="{\"cmd\":\"listactions\"}" [Niko message for getting actions list]
    locMsg="{\"cmd\":\"listlocations\"}" [Niko message for getting locations list]

JEEDOM section:

    host=jeedom.cs.local [Jeedom hostname]
    urlRoot=http://jeedom.cs.local [Jeedom root URL]
    apiPath=/core/api/jeeApi.php? [Jeedom api path]
    apiKey=hxxxxxxxxxxxxxxxxxn [Jeedom AOI key]

DAEMON:

    listen=8081 [Http listen port]
    logLevel=DEBUG [log level]
    logFile="./log/jeedom-nhc.log" [Log file full path]
