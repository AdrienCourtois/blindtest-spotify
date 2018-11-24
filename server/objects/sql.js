const mysql = require('mysql');
const DSNParser = require('dsn-parser');
var pool;

module.exports = {
    getPool: function () {
		if (pool)
			return pool;
		
		if (process.env.ENV == "DEV"){
			pool = mysql.createPool({
				connectionLimit: 4,
				host: '127.0.0.1',
				user: 'root',
				password: '',
				database: 'blindtest'
			});
			
			console.log('Logged into the local database');
		} else {
			var dsn = new DSNParser(process.env.DATABASE_URL);

			pool = mysql.createPool({
				connectionLimit : 4,
				// Not sure how many concurrent connections the free package of ClearDB offers
				// We'll keep it low for now and may be increased later
				host: dsn.get('host'),
				user: dsn.get('user'),
				password: dsn.get('password'),
				database: dsn.get('database'),
				port: dsn.get('port')
			});
		}
		
		return pool;
    }
};