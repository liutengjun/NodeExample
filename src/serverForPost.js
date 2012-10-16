
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');
var LOG = require('./log.pc.js');

var cwd = process.cwd();
var PATH_BASE = cwd;
var HOST_PORT = 9000;
var SUMERU_APP_PATH = "/data/data/com.baidu.sumeru/apps/";
var MANIFEST_FILE = "SumeruManifest.xml";
var ICON_FILE = "icon.png";

server = http.createServer(function(request, response) {
	
	loadServer(request, response);
	
});

server.listen(HOST_PORT, function() 
{
	process.on('message', function(msg)
	{
		if (msg == 'areyouready') process.send('ready');
	});
    LOG.d("HTTP server start, localhost:%d", HOST_PORT);
});


function loadServer(request, response) 
{
	if(request.method != 'POST') {
		return;
	}

	var postData = '';

	request.setEncoding('utf8');

	request.addListener('data', function(chunk) {
		postData += chunk;
	});
		   
	request.addListener('end', function(){
		saveDataToFile(postData);		
	});

	response.writeHead(200, {'Content-Type': 'application/octet-stream'});

	response.end();

}

function saveDataToFile(postData) {
}
