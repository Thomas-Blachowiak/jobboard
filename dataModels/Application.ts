import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { User } from "./User";
import { Offer } from "./Offer";


class Application extends Model<InferAttributes<Application>, InferCreationAttributes<Application>> {
    // declare table field typescript typings
    declare id : CreationOptional<number>;
    declare userId: ForeignKey<User['id']>;
    declare offerId: ForeignKey<Offer['id']>;
    declare message: string;
    declare rejected: boolean;
    // declare associations
    declare User?: NonAttribute<User>;
    declare Offer?: NonAttribute<Offer>;
    // Filter for publicly exposable content
    public() {
        return {
            applicationId: this.id,
            userId: this.userId,
            offerId: this.offerId,
            message: this.message,
            rejected: this.rejected,
            user: this.User ? this.User.public() : undefined,
            offer: this.Offer ? this.Offer.public() : undefined
        }
    }
}
export {Application};

