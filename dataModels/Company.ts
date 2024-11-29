import {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "sequelize";
import { User } from "./User";
import { Offer } from "./Offer";

class Company extends Model<
    InferAttributes<Company>,
    InferCreationAttributes<Company>
> {
    // declare table field typescript typings
    declare id: CreationOptional<number>;
    declare name: string;
    declare description: string;
    declare email: string;
    declare siretNumber: string;
    // declare associations
    declare Users?: NonAttribute<User[]>;
    declare Offers?: NonAttribute<Offer[]>;
    // filter for exposable attributes
    public() {
        return {
            companyId: this.id,
            name: this.name,
            description: this.description,
            email: this.email,
            siretNumber: this.siretNumber,
            users: this.Users
                ? this.Users.map((user) => user.public())
                : undefined,
            offers: this.Offers
                ? this.Offers.map((offer) => offer.public())
                : undefined,
        };
    }
}

export { Company };
