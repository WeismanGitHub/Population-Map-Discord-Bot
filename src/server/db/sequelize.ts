import { Sequelize } from "sequelize";
import SQLite from "sqlite3";

export default new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
    dialectOptions: { mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE }
});