
var prioValue = 0;
const LOG_LEVEL_VERBOS = {prio: ++prioValue};
const LOG_LEVEL_DEBUG = {prio: ++prioValue};
const LOG_LEVEL_INFO = {prio: ++prioValue};
const LOG_LEVEL_WARNING = {prio: ++prioValue, tag: "Warning: "};
const LOG_LEVEL_ERROR = {prio: ++prioValue, tag: "Error: "};


const USE_LOG_LEVEL = LOG_LEVEL_DEBUG;


var log = function(logLevel, outterArgs)
{
	if (logLevel.prio >= USE_LOG_LEVEL.prio && arguments.length == 2 
        && arguments["1"] != null && arguments["1"].length > 0)
	{
        var isFirst = true;
        var args = new Array(); 

        if (logLevel.tag)
        {
            arguments["1"][0] = logLevel.tag + arguments["1"][0];
        }
      
        console.log.apply(console, arguments["1"]);
	}	
}


exports.v = function(format, /*...*/ args)
{
	log(LOG_LEVEL_VERBOS, arguments);
}


exports.d = function(format, /*...*/ args)
{
	log(LOG_LEVEL_DEBUG, arguments);
}


exports.i = function(format, /*...*/ args)
{
	log(LOG_LEVEL_INFO, arguments);
}


exports.w = function(format, /*...*/ args)
{
	log(LOG_LEVEL_WARNING, arguments);
}


exports.e = function(format, /*...*/ args)
{
	log(LOG_LEVEL_ERROR, arguments);
}
