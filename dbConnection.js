const {Sequelize} = require('sequelize')

//LOCAL CONNECTION
/* const sequelize = new Sequelize('conduit','root','password',{
    dialect: 'mysql',
    host:'localhost',
    logging: false
}); */


//AMAZON RDS CONNECTION
/* const sequelize = new Sequelize('conduit1',process.env.USER_NAME,process.env.PASSWORD,{
    dialect: 'mysql',
    host:process.env.DB_HOST,
    logging: false,
    port: 3306
});
 */

//SQLITE
/*
const sequelize = new Sequelize('d6rk5ijgmvcf6q',process.env.USER_NAME,process.env.PASSWORD,{
    dialect: 'postgres',
    host: process.env.DB_HOST,
    logging: false,
    port: 5432,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // <<<<<<< YOU NEED THIS
        }
    }
});
*/

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db.sqlite3',
});
module.exports = sequelize
