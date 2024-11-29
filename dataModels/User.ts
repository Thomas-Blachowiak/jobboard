import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { Application } from "./Application";
import { Company } from "./Company";


class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    // declare table field typescript typings
    declare id: CreationOptional<number>;
    declare firstName: string;
    declare lastName: string;
    declare email: string;
    declare phone: string;
    declare password: string;
    declare photo?: string;
    declare message: string;
    declare admin: boolean;
    // declare associations 
    declare Applications?: NonAttribute<Application[]>;
    declare companyId?: ForeignKey<number>;
    declare Company?: NonAttribute<Company>;
    // filter for exposable attributes
    public() {
        return {
            userId: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            photo: this.photo ? this.photo : undefined,
            phone: this.phone,
            admin: this.admin,
            message: this.message,
            companyId: this.companyId ? this.companyId : undefined,
            company: this.Company ? this.Company.public() : undefined,
            applications: this.Applications ? this.Applications.map(application => application.public()) : undefined
        };
    }
}

export {User};

