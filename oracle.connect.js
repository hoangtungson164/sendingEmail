const oracledb = require('oracledb');
const dbconfig = require('./config');


async function queryOracel(sql, param, option) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbconfig);
        let result = await connection.execute(
            sql, param, option);
            if (result.rows !== undefined) {
                return result.rows;
            } else {
                return result;
            }
    } catch (err) {
        console.log(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.log(error);
            }
        }
    }
}

module.exports = queryOracel;