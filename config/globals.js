/*
* Server Config
*/
module.exports.PORT = process.env.PORT || 3000;

/*
* Db Config
*/
module.exports.SERVER = 'localhost';
module.exports.DB = 'myBlog';
module.exports.HOSTPORT = 27017;
module.exports.DBUSERNAME = 'sheapy';
module.exports.DBPASSWORD = 'goldroad500';
module.exports.DBCONNECTIONSTRING = `mongodb://${this.DBUSERNAME}:${this.DBPASSWORD}@${this.SERVER}:${this.HOSTPORT}/${this.DB}`;

/*
*   KEYS
*/
module.exports.HS256KEY = 'qzl8S6OUPPAOqRpHmi1h94Mcp8Ex9CYQ';
module.exports.AESKEY = 'qzl8S6OUPPAO';