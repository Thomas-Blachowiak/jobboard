import { CreateOfferForm } from "../components/forms/CreateOfferForm";
import { Footer } from "../components/Footer";
import Navbar from "../components/Navbar";
import { AuthChecker } from "../components/helpers/AuthChecker";
import { ContextChecker } from "../components/helpers/ContextChecker";
import { CompanyContext } from "../assets/contexts/companyContext";
import { useContext, useEffect, useState } from "react";
import { CompanyEditor } from "../components/forms/CompanyEditor";
import { domain, port } from "../../env.json";

type OfferDetails = {
    offerId: number;
    title: string;
    description: string;
    city: string;
    salary: number;
    hours: number;
    companyId: number;
    company: { name: string; description: string };
};

export function Company() {
    // Get the context from react
    const companyContext = useContext(CompanyContext);
    // May be null if the provider wasn't called before in the "html" tree
    if (!companyContext) return;
    // extract the state and state setter from the context
    // they can now be used !
    const [company, setCompany] = companyContext;
    const [offers, setOffers] = useState<OfferDetails[]>([]);

    if (!company) return;

    useEffect(() => {
        fetch(
            `http://${domain}:${port}/api/offer/list?companyId=${company.companyId}`
        )
            .then((response) => {
                if (!response.ok)
                    throw new Error(
                        `${response.status}: ${response.statusText}`
                    );
                return response.json();
            })
            .then(setOffers)
            .catch(console.error);
    }, []);

    return (
        <>
            <AuthChecker>
                <ContextChecker context={CompanyContext}>
                    <Navbar />
                    <h1 className="mt-3 text-center">My Company</h1>
                    <div className="row justify-content-center">
                        {company ? (
                            <CompanyEditor
                                company={company}
                                setCompany={setCompany}
                                title="Edit Company Details"
                            />
                        ) : undefined}
                        <div className="col-md-7">
                            <CreateOfferForm
                                title="Create a new Job Offer"
                                companyId={company.companyId}
                            />
                        </div>
                    </div>
                    <div className="row container mx-auto">
                        <h2 className="border-top border-bottom text-center py-3">
                            Available Job Offers
                        </h2>
                        {offers.map((offer) => (
                            <div
                                key={offer?.offerId}
                                className="m-2 col col-md-3 p-4 mb-3 bg-body-tertiary rounded-5 border border-secondary">
                                <h3 className="text-center border-bottom">
                                    {offer.title}
                                </h3>
                                <div className="row g-2">
                                    <div className="g-2 col-6">
                                        <a
                                            href={`/offer-details/${offer.offerId}`}
                                            className="btn btn-primary w-100">
                                            Details
                                        </a>
                                    </div>
                                    <div className="g-2 col-6">
                                        <a
                                            href={`/applicants/${offer.offerId}`}
                                            className="btn btn-success w-100">
                                            Applicants
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Footer />
                </ContextChecker>
            </AuthChecker>
        </>
    );
}
