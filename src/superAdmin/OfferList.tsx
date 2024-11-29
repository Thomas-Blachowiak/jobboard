import { useEffect, useState } from "react";
import { domain, port } from "../../env.json";
import { SuperAuthChecker } from "./SuperAuthChecker";
import { UpdateOfferForm } from "../components/forms/UpdateOfferForm";

type OfferType = {
    offerId: number;
    title: string;
    description: string;
    city: string;
    salary: number;
    hours: number;
    companyId: number;   
    company: { name: string; description: string };
} | null;

export function OfferList() {
    const [loading, setLoading] = useState<boolean>(true);
    const [offers, setOffers] = useState<OfferType[]>([]);
    const [hidden, setHidden] = useState<boolean>(false);

    useEffect(() => {
        if (!loading) return;
        fetch(`http://${domain}:${port}/api/offer/list`, {
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) return response.json();
            throw new Error(`${response.status}`);
        })
        .then(setOffers)
        setLoading(false);
    }, [loading]);

    function onHide() {
        setHidden(prev => !prev);
    }

    return <SuperAuthChecker>
        <div className="d-flex align-items-center mb-3 border-bottom">
            <h1 className="m-3">All Job Offers</h1>
            <button className="m3 btn btn-secondary" onClick={onHide}>
                {hidden ? "Reveal v" : "Hide ^"}
            </button>
            <button className="m3 btn btn-warning" onClick={() => {
                setLoading(true);
            }}>Reload</button>
        </div>
        {hidden
            ? undefined
            : <div className="row">
                {offers.map(offer => <div className="col-md-4">
                    <UpdateOfferForm allowCompanyChange={true} key={offer?.offerId} offer={offer} setLoading={setLoading}/>
                </div>)}
            </div>
        }
        
    </SuperAuthChecker>
}