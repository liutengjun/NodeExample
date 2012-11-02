
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');
var LOG = require('./log.pc.js');

var cwd = process.cwd();
var PATH_BASE = cwd;
var HOST_PORT = 9000;

server = http.createServer(function(request, response) {
	
	var curUrl = url.parse(request.url);  
	loadServer(curUrl.query, response);
	
});

server.listen(HOST_PORT, function() 
{
	process.on('message', function(msg)
	{
		if (msg == 'areyouready') process.send('ready');
	});
    LOG.d("HTTP server start, localhost:%d", HOST_PORT);
});


function loadServer(querys, response) 
{
    LOG.d("Route to load server. load querys: " + querys);
    
    var queryo = querystring.parse(querys);
    if (!queryo.res)
    {
        console.log('None res query!');
        return;
    }

    var resName = queryo.res;
	var resPath = PATH_BASE + "/../"
    var filepath = path.join(resPath, resName);
    console.log('filepath:%s', filepath);

    // old node version use path.exists
    path.exists(filepath, function(exists) 
    //new node version use fs.exists
//	fs.exists(filepath, function(exists) 
    {
   	    if (!exists) 
        {
            response.writeHead(404, 
                {
                    'Content-Type': 'text/plain'
                });
            response.write("This request page " + filepath + " is not found.");
            response.end();
        } 
        else 
        {    
		    var rs = fs.createReadStream(filepath);
		    rs.on("error", function()
		    {
		        response.writeHead(403, 
		            {
		                'Content-Type': 'text/plain'
		            });
		        response.write("Read file " + filepath + " error.");
		        response.end();
		    });

		    response.writeHead(200, 
		    {
		        'Content-Type': 'application/octet-stream',
		    });

		    rs.on('end', function() 
		    {
		        response.end();
		    });
		    
		    rs.pipe(response);
		}
	});
}

