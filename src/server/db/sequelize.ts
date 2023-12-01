import { Sequelize } from "sequelize";
import config from "../config";

export default new Sequelize({
    dialect: 'postgres',
    host: config.pgHost,
    port: config.pgPort,
    username: config.pgUsername,
    password: config.pgPassword,
    database: config.pgDatabase,
    logging: () => {}
});
