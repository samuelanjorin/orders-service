import config from "./envconfig"
import Sequelize from "sequelize"


// Option 1: Passing parameters separately
const sequelize = new Sequelize(
    config.database.name,
    config.database.username,
    config.database.password, 
    {
        host: config.database.host,
        dialect: config.database.dialect
})
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  })
  export default sequelize