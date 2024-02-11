import sequelize from '../sequelize';
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare userID: string;
}

User.init(
    {
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        sequelize: sequelize,
        modelName: 'User',
        timestamps: false,
    }
);

User.sync({ alter: true });

export default User;
