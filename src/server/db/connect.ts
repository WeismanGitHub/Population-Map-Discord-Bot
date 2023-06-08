import { InternalServerError } from "../errors";
import { Sequelize } from "sequelize";

export default async function() {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './db.db'
    });

    try {
        await sequelize.authenticate()
        
        console.log('connected to database...')
    } catch (error) {
        throw new InternalServerError('Could not connect to database.')
    }
}
