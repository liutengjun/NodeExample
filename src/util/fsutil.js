
var fs = require('fs');
var pathutil = require('path');

exports.PATH_SEPARATOR = '/';
exports.EXT_SEPARATOR = '.';


/**
 * callback = function(result)
 */
exports.fileExists = function(file, callback)
{
    try
    {
        fs.stat(file, function(err, stats)
        {
            callback(!err && stats.isFile())
        });
    }
    catch (err)
    {
        callback(false);
    }
}


/**
 * callback = function(result)
 */
exports.dirExists = function(dir, callback)
{
    try
    {
        fs.stat(dir, function(err, stats)
        {
            callback(!err && stats.isDirectory())
        });
    }
    catch (err)
    {
        callback(false);
    }
}


/**
 * callback = function(result)
 */
exports.pathExists = function(path, callback)
{
    try
    {
        pathutil.exists(path, function (ret)
        {
            callback(ret);
        });
    }
    catch (err)
    {
        callback(false);
    }
}


/**
 * callback = function(err)
 */
exports.removePath = function(path, callback)
{
    var stat;
    var curPath;
    var array = [path];

    doRemovePath();

    function doRemovePath()
    {
        try
        {
            if (array.length > 0)
            {
                curPath = array[array.length - 1];

                fs.stat(curPath, function(err, stats)
                {
                    if (err) //path doesn't exist or other error
                    {
                        array.pop();
                        doRemovePath();
                    }
                    else if (stats.isDirectory())
                    {
                        fs.readdir(curPath, function(err, files)
                        {
                            if (err)
                            {
                                callback(true);
                            }
                            else if (files && files.length > 0)
                            {
                                for (var i in files)
                                {
                                    array.push(curPath + exports.PATH_SEPARATOR + files[i]);
                                }
                                        
                                doRemovePath();
                            }
                            else //empty folder
                            {
                                fs.rmdir(curPath, function(err)
                                {
                                    if (err)
                                    {
                                        callback(true);
                                    }
                                    else
                                    {
                                        array.pop();
                                        doRemovePath();
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        fs.unlink(curPath, function(err)
                        {
                            if (err)
                            {
                                callback(true);
                            }
                            else
                            {
                                array.pop();
                                doRemovePath();
                            }
                        });
                    }
                });
            }
            else
            {
                exports.pathExists(path, function(ret)
                {
                    callback(ret);
                });
            }
        }
        catch (err)
        {
            callback(true);
        }
    }
}


/**
 * callback = function(err)
 */
exports.mkdirs = function(path, callback)
{
    var dirs = path.split(exports.PATH_SEPARATOR);
    var curPath = '';
    var i = -1;

    doMakeDirs();

    function doMakeDirs()
    {
        i++;
        if(i < dirs.length)
        {
            curPath += exports.PATH_SEPARATOR + dirs[i];

            exports.dirExists(curPath, function(ret) //Statement (a).
            {
                if (ret)
                {
                    doMakeDirs();
                }
                else
                {
                    try
                    {
                        fs.mkdir(curPath, 0755, function(err)
                        {
                            if (err)
                            {
                                //Don't conflict with Statement (a), since this is async operation, and if mkidrs is invoked by multiple modules.
                                //the path may not exist at Statement (a), but it is created before Statement (b) is invoked.
                                exports.dirExists(curPath, function (ret)  //Statement (b)
                                {
                                    if (ret)
                                    {
                                        doMakeDirs();
                                    }
                                    else
                                    {
                                        callback(true);
                                    }
                                });
                            }
                            else
                            {
                                doMakeDirs();
                            }
                        });            
                    }
                    catch (err)
                    {
                        callback(err);
                    }
                }
            });
        }
        else
        {
            callback(false);
        }
    }
}
