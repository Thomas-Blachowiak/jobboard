import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "sequelize";
import { Company } from "./Company";
import { Application } from "./Application";

class Offer extends Model<
    InferAttributes<Offer>,
    InferCreationAttributes<Offer>
> {
    // declare table field typescript typings
    declare id: CreationOptional<number>;
    declare title: string;
    declare description: string;
    declare companyId: ForeignKey<number>;
    declare city: string;
    declare salary: number;
    declare hours: number;
    // declare associations
    declare Company?: NonAttribute<Company>;
    declare Applications?: NonAttribute<Application[]>;
    // Filter for publicly exposable content
    public() {
        return {
            offerId: this.id,
            title: this.title,
            description: this.description,
            city: this.city,
            salary: this.salary,
            hours: this.hours,
            companyId: this.companyId,
            company: this.Company ? this.Company.public() : undefined,
            applications: this.Applications
                ? this.Applications.map((application) => application.public())
                : undefined,
        };
    }
}
export { Offer };
