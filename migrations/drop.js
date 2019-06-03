import sequelize from '../config/database'
import fs from 'fs'
import path from 'path'
import logger from '../utils/errors/errorlogger';

const dir = path.join(__dirname, './drop.sql')

const sql = fs.readFileSync(dir).toString()

sequelize.query(sql, { raw: true }).then(() => {
  logger.info('Table Dropped successfully')
}).catch(error => {
  logger.error('Error', error)
})
