import { Footer } from "../components/Footer";
import { HomeCompany } from "../components/HomeCompany";
import Navbar from "../components/Navbar";
import { ValuesCompany } from "../components/ValuesCompany";

export function Home() {
    return (
        <>
            <Navbar />
            <HomeCompany />
            <ValuesCompany />
            <Footer />
        </>
    );
}
