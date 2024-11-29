import { sequelize, User, Company, Offer, Application } from "./models";
import { hashSync } from "bcrypt";

async function seedDatabase() {
    try {
        await sequelize.sync({ force: true });

        // Créer des entreprises
        const company1 = await Company.create({
            name: "TechCorp",
            description: "A leading tech company",
            email: "contact@techcorp.com",
            siretNumber: "12345678900010",
        });

        const company2 = await Company.create({
            name: "InnovateX",
            description: "Innovating the future",
            email: "info@innovatex.com",
            siretNumber: "98765432100020",
        });

        // Créer des utilisateurs
        const user1 = await User.create({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "555-1234",
            password: hashSync("password123", 10), // Hashage du mot de passe ???
            admin: true,
            companyId: company1.id,
        });

        const user2 = await User.create({
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            phone: "555-5678",
            password: hashSync("password456", 10), // Hashage du mot de passe
            admin: false,
            companyId: company2.id,
        });

        // Créer des offres
        const offer1 = await Offer.create({
            title: "Software Engineer",
            description: "Develop and maintain web applications.",
            city: "San Francisco",
            salary: 120000,
            hours: 40,
            companyId: company1.id,
        });

        const offer2 = await Offer.create({
            title: "Product Manager",
            description: "Lead the product development lifecycle.",
            city: "New York",
            salary: 110000,
            hours: 40,
            companyId: company2.id,
        });

        // Créer des candidatures
        await Application.create({
            message: "Looking forward to this opportunity!",
            rejected: false,
            userId: user1.id,
            offerId: offer1.id,
        });

        await Application.create({
            message: "Excited to bring my experience!",
            rejected: false,
            userId: user2.id,
            offerId: offer2.id,
        });

        console.log("Database has been seeded successfully.");
    } catch (error) {
        console.error("Error seeding the database:", error);
    } finally {
        // Ferme la connexion à la base de données
        await sequelize.close();
    }
}

// Exécuter la fonction seed
seedDatabase();
