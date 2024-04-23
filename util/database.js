const Sequelize = require('sequelize');
const dotenv= require('dotenv')
dotenv.config()


const pass=process.env.pass;
const dbname= process.env.db_name;
const dbusername= process.env.db_username

 const sequelize = new Sequelize(dbname, dbusername, pass, {
    host:process.env.db_localhost,
    dialect: "mysql",
     logging: false
}); 

module.exports=sequelize
