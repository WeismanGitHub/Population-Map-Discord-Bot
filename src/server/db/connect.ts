import { InternalServerError } from "../errors";
import { Sequelize } from "sequelize";
import SQLite from "sqlite3";

export default async function() {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './db.sqlite',
        dialectOptions: { mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE }
    });

    try {
        await sequelize.authenticate()
        
        console.log('connected to database...')
    } catch (error) {
        throw new InternalServerError('Could not connect to database.')
    }

    return sequelize
}
