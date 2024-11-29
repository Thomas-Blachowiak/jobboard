import { DataTypes, Sequelize } from "sequelize";
import { database } from "../secrets.json";
import { Offer } from "./Offer";
import { Company } from "./Company";
import { User } from "./User";
import { Application } from "./Application";

/**
 * Here we initialize the database connection instance
 */

const sequelize = new Sequelize(
    database.basename,
    database.username,
    database.password,
    {
        dialect: "mysql",
        host: database.url,
        port: database.port,
    }
);

await sequelize.authenticate();

/**
 * Model initialisation
 */
Application.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        message: DataTypes.STRING,
        rejected: DataTypes.BOOLEAN
    },
    { sequelize: sequelize }
);

Company.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        email: DataTypes.STRING,
        siretNumber: DataTypes.STRING,
    },
    { sequelize: sequelize }
);

Offer.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        city: DataTypes.STRING,
        salary: DataTypes.INTEGER,
        hours: DataTypes.INTEGER,
    },
    { sequelize: sequelize }
);

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        photo: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        password: DataTypes.STRING,
        admin: DataTypes.BOOLEAN,
        message: {
            type: DataTypes.STRING,
            defaultValue: '',
          },
    },
    { sequelize: sequelize }
);

/**
 * Table relations
 */
// Offer - Applications
Offer.hasMany(Application, { foreignKey: "offerId" });
Application.belongsTo(Offer, { foreignKey: "offerId" });
// Company - Offers
Company.hasMany(Offer, { foreignKey: "companyId" });
Offer.belongsTo(Company, { foreignKey: "companyId" });
// User - Applications
User.hasMany(Application, { foreignKey: "userId" });
Application.belongsTo(User, { foreignKey: "userId" });
// Company - Users
Company.hasMany(User, { foreignKey: "companyId" });
User.belongsTo(Company, {
    foreignKey: {
        name: "companyId",
        allowNull: true,
    },
});

export { sequelize, Application, Company, Offer, User };
