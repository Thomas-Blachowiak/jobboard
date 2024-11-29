import { Navigate } from "react-router-dom";
import { CompanyContext } from "../assets/contexts/companyContext";
import { Footer } from "../components/Footer";
import Navbar from "../components/Navbar";
import { NewCompanyForm } from "../components/forms/NewCompanyForm";
import { AuthChecker } from "../components/helpers/AuthChecker";
import { ContextCondition } from "../components/helpers/ContextCondition";

export function CreateCompany() {
    return (
        <>
            <AuthChecker>
                <ContextCondition context={CompanyContext}
                    true={<Navigate to="/"/>}
                    false={<>
                        <Navbar />
                        <h1 className="mt-3 text-center">Create new company</h1>
                        <NewCompanyForm />
                        <Footer />
                    </>}
                />
            </AuthChecker>
        </>
    );
}
