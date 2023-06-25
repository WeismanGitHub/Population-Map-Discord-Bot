import { DataTypes } from 'sequelize'

class Log {
    level
    description
    timestamp

    constructor() {
        this.level = {
            type: DataTypes.ENUM('error', 'info'),
            allowNull: false
        }

        this.description = {
            type: DataTypes.STRING,
            allowNull: true
        }

        this.timestamp = {
            type: DataTypes.NOW,
            allowNull: false,
        }
    }
}
g
export default Log
