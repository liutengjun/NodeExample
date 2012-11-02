var
    xml = require('./xmlParser.js'),
    filename = __dirname + '/manifest.xml';

function logXML(data) {
 //   console.log(JSON.stringify(data, '   ', '\t'));
//console.log(data);
//console.log(data.childs);
	
	var packageInfo = {};
	packageInfo.usesPermissions = [];
	packageInfo.permissions = [];
	packageInfo.services = [];

	for(var index in data.childs) {
		if(data.childs[index].name === "app") {
			packageInfo.appName = data.childs[index].attrib.appName;
			packageInfo.versionCode = data.childs[index].attrib.versionCode;
			packageInfo.versionName = data.childs[index].attrib.versionName;
		} else if (data.childs[index].name === "uses-runtimeserver") {
			packageInfo.minVersion = data.childs[index].attrib.minVersion;
			packageInfo.preferredVersion = data.childs[index].attrib.preferredVersion;
		} else if (data.childs[index].name === "uses-permission") {
			packageInfo.usesPermissions.push(data.childs[index].attrib.name);
		} else if (data.childs[index].name === "permission") {
			var permission = {};
			permission.description = data.childs[index].attrib.description;
			permission.label = data.childs[index].attrib.label;
			permission.name = data.childs[index].attrib.name;
			permission.permissionGroup = data.childs[index].attrib.permissionGroup;
			permission.protectionLevel = data.childs[index].attrib.protectionLevel;
			packageInfo.permissions.push(permission);
		} else if (data.childs[index].name === "permission-group") {
		} else if (data.childs[index].name === "service") {	
			packageInfo.services.push(data.childs[index].attrib.name);
		}
	}

	console.log(packageInfo);
}





//console.log("sync mode");
//logXML(xml.parseFileSync(filename));

//logXML(xml.parseString("<xml>from string â‚?/xml>"));


//console.log("async mode");
xml.parseFile(filename, function(err, root){
    logXML(root)
});

