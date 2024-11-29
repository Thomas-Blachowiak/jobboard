import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams, useResolvedPath } from "react-router-dom";
import { Footer } from "./Footer";
import NavBar from "./Navbar";
import { port, domain } from "../../env.json";
import { ApplyForm } from "./forms/ApplyForm";
import { CompanyContext } from "../assets/contexts/companyContext";
import { UpdateOfferForm } from "./forms/UpdateOfferForm";
import { UserContext } from "../assets/contexts/userContext";
import { LoginForm } from "./forms/LoginForm";
import { ApplicaitonType, ApplicationEditor } from "./forms/ApplicationEditor";

export type OfferDetails = {
    offerId: number;
    title: string;
    description: string;
    city: string;
    salary: number;
    hours: number;
    companyId: number;
    company: { name: string; description: string };
    applications: ApplicaitonType[]
} | null;

export function OfferDetails() {
    const { offerId } = useParams<{ offerId: string }>(); // Récupérer l'offerId depuis l'URL
    const [offer, setOffer] = useState<OfferDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const path = useResolvedPath('.');

    const companyContext = useContext(CompanyContext);
    const userContext = useContext(UserContext);
    if (!companyContext || !userContext || !offerId) return;
    const company = companyContext[0];
    const user = userContext[0];
    const application = offer?.applications.find(appli => appli.userId === user?.userId);
    console.log(application);
    useEffect(() => {
        const fetchOfferDetails = async () => {
            try {
                const offerResponse = await fetch(
                    `http://${domain}:${port}/api/offer?offerId=${offerId}`
                );
                if (!offerResponse.ok)
                    throw new Error("Failed to fetch offer details");
                const offerData = await offerResponse.json();
                setOffer(offerData);
            } catch (err) {
                console.error(err);
                setError("Error fetching offer details");
            } finally {
                setLoading(false);
            }
        };

        if (loading) fetchOfferDetails();
    }, [loading]);

    return (
        <>
            <NavBar />
            <div className="container">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : offer ? (
                    <div className="row">
                        <h1 className="mt-3 text-center">Details</h1>
                        <div className="col-md-8 col-12 mt-5 text-center">
                            <h2>{offer.title}</h2>
                            <p>
                                <strong>City :</strong> {offer.city}
                            </p>
                            <p>
                                <strong>Salary: </strong>
                                {offer.salary} $
                            </p>
                            <p>
                                <strong>Hours:</strong> {offer.hours}
                            </p>
                            <p className="fw-bold">Description:</p>
                            <p>{offer.description}</p>
                            <h4 className="border-top">@{offer.company.name}</h4>
                            <p>{offer.company.description}</p>
                        </div>
                        <div className="col-md-4 col-12 mt-5 text-end">
                            {user 
                                ?   company &&
                                    offer.companyId === +company.companyId 
                                        ?   <UpdateOfferForm
                                                name="Update Job Offer"
                                                offer={offer}
                                                setOffer={setOffer}
                                                setLoading={setLoading}></UpdateOfferForm> 
                                        :   application 
                                            ?   <ApplicationEditor application={application} setLoading={setLoading} noSizing={true}/>
                                            :   <ApplyForm userId={user.userId} offerId={offerId} setLoading={setLoading} message={user.message}/>
                                :   <LoginForm goTo={path.pathname}/>
                            }
                        </div>
                    </div>
                ) : (
                    <p>Offer not found</p>
                )}

                <div className="text-start">
                    <NavLink to="/job-offers" className="btn btn-warning">
                        Back
                    </NavLink>
                </div>
            </div>
            <Footer />
        </>
    );
}
