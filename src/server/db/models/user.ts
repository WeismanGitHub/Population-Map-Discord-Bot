import sequelize from '../sequelize';
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare userID: string;
    declare role?: 'regular' | 'admin';
}

User.init(
    {
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        role: {
            type: DataTypes.ENUM('regular', 'admin'),
            defaultValue: 'regular',
        },
    },
    {
        sequelize: sequelize,
        modelName: 'User',
        timestamps: false,
    }
);

User.sync();

export default User;
