import React, { useEffect, useState } from "react";
import { port, domain } from "../../env.json";
import OfferCard from "./OfferCard";

interface Offer {
    offerId: number;
    companyId: number;
    title: string;
}

const OfferList: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOffers = async () => {
        try {
            const response = await fetch(
                `http://${domain}:${port}/api/offer/list`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data: Offer[] = await response.json();
            setOffers(data);
        } catch (err) {
            setError("Error fetching offers");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOffers();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }
    return (
        <div>
            <div className="row justify-content-center m-3">
                {offers.map((offer) => (
                    <OfferCard
                        key={offer.offerId}
                        offerId={offer.offerId}
                        title={offer.title}
                    />
                ))}
            </div>
        </div>
    );
};

export default OfferList;
