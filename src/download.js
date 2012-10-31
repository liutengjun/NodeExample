var http = require('http');
var url = require('url');
var fs = require('fs');

const NETWORK_TIMEOUT = 30 * 1000; //30S

exports.download = function(urlStr, callback)
{
	var urlObject = url.parse(urlStr);
	//	var options = {};
	//	options.host = urlObject.host;
	urlObject.method = "GET";

	var writeStream = fs.createWriteStream(tempFile);
    writeStream.on('error', function(err)
    {
        log.e('Download resource err on write stream: ' + err);
    });

	var requestCbo = new Object();

	requestCbo.onReceivedResponse = function(statusCode)
	{
		var ret = true;

		switch (statusCode)
		{
		case 200:
			break;

		default:
			log.e("Return status code " + statusCode + " when to download resource: " + remotePath);
			ret = false;
		}

		return ret;
	}

	requestCbo.onReceivedData = function(chunk)
	{
		writeStream.write(chunk);

		return true;
	};

	requestCbo.onCompleted = function(err)
	{
		writeStream.end();

		if (err)
		{
			log.e('Download resource err on http response ' + err);
		}
		else
		{
		}    
	};

	httpDownload(urlObject, requestCbo);
}

function httpDownload(options, cbo)
{
	try
	{
		var req = http.request(options, function(res)
		{
			var result = cbo.onReceivedResponse(res.statusCode);
			if (result)
			{
				res.on('data', function (chunk)
				{
					result = cbo.onReceivedData(chunk);
					if (!result)
					{
						closeResponse();
					}
				});

				res.on('end', function ()
				{
					cbo.onCompleted(false);
				});
			}
			else
			{
				closeResponse();
				cbo.onCompleted(true);
			}

			function closeResponse()
			{
				res.emit("close", "Abort!");
			}
		});    

		req.on('error', function (err)
		{
			log.e("Http request error: " + err); 
			cbo.onCompleted(true);
		});

		req.setTimeout(NETWORK_TIMEOUT, function ()
		{
			log.e("Http timeout for res: " + options.path); 
			cbo.onCompleted(true);
		});

		req.end();
	}
	catch (err)
	{
		if (req)
		{
			req.abort();
		}

		cbo.onCompleted(true);
	}
}


