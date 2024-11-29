import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { OfferDetails } from "./OfferDetails";
import { domain, port } from "../../env.json";
import { application } from "express";

interface OfferCardProps {
    offerId: number;
    title: string;
    company: { name: string };
}

const OfferCard: React.FC<OfferCardProps> = ({ offerId, title}) => {
    const [showDetails, setShowDetails] = useState<OfferDetails>()



    return (
        <div className="col-md-3 p-2">
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title text-center">{title}</h4>
                    <div className="row text-center">
                        <div className="p-1">
                            <NavLink
                                to={`/offer-details/${offerId}`} // Redirection vers la page avec offerId
                                className="col-6 btn btn-primary">
                                Apply
                            </NavLink>
                            <button 
                                className="col-6 btn btn-secondary"
                                onClick={ev => {
                                    ev.preventDefault();

                                    if (!showDetails) fetch(`http://${domain}:${port}/api/offer?offerId=${offerId}`)
                                    .then(response => {
                                        if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
                                        return response.json();
                                    })
                                    .then(setShowDetails)
                                    .catch(console.error);
                                    else setShowDetails(undefined);
                                }}>{!showDetails ? "Show Details" : "Hide Details"}</button>
                        </div>
                        {showDetails ?
                            <>
                            <h5 className="fst-italic">@{showDetails.company.name}</h5>
                            <h6>{showDetails.hours} h/w</h6>
                            <h6>{showDetails.salary} €</h6>
                            <p className="border-top">{showDetails.description}</p>
                            </>    
                        : undefined}                   
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfferCard;
