import { AuthChecker } from "../components/helpers/AuthChecker";
import { Footer } from "../components/Footer";
import { InformationProfil } from "../components/InformationProfil";
import Navbar from "../components/Navbar";

export function Profil() {
    return (
        <AuthChecker>
            <Navbar />
            <InformationProfil />
            <Footer />
        </AuthChecker>
    );
}