import { useEffect, useState } from "react";
import { port, domain } from "../../env.json";

interface Offer {
    offerId: number;
    title: string;
    description: string;
}

export function JobAd() {
    const [offer, setOffer] = useState<Offer | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const response = await fetch(
                    `http://${domain}:${port}/api/offer?offerId=4`
                );
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data: Offer = await response.json();
                setOffer(data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchOffer();
    }, []);

    return (
        <>
            <div className="container">
                <h1 className="text-center">All Jobs offers</h1>
                <div className="row">
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                {error && (
                                    <p style={{ color: "red" }}>
                                        Error: {error}
                                    </p>
                                )}
                                {offer ? (
                                    <div>
                                        <h5 className="card-title">
                                            {offer.title}
                                        </h5>
                                        <p className="card-text">
                                            {offer.description}
                                        </p>
                                    </div>
                                ) : (
                                    <p>Loading user information...</p>
                                )}

                                <a href="#" className="card-link">
                                    To apply
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
