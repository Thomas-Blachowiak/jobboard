import { useContext, useEffect, useState } from "react";
import { UserContext } from "../assets/contexts/userContext";
import CompanyOffers from "./CompanyOffers";
import { domain, port } from "../../env.json";
import { CompanyContext } from "../assets/contexts/companyContext";

// interface Company {
//     companyId: number;
//     name: string;
//     description: string;
// }

export function CompanyDetails({company}: {company: {
    companyId: string;
    name: string;
    description: string;
    email: string;
    siretNumber: string;
}}) {
    
    // const userContext = useContext(UserContext); // Récupération du contexte utilisateur
    // const [company, setCompany] = useState<Company | null>(null);
    // const [error, setError] = useState<string | null>(null);

    // // Vérifiez que le contexte utilisateur est bien disponible
    // if (!userContext) {
    //     return (
    //         <p>
    //             Le contexte utilisateur n'est pas disponible. Vérifiez si le
    //             Provider est bien configuré.
    //         </p>
    //     );
    // }

    // const [user] = userContext; // On récupère l'utilisateur depuis le contexte

    // // Si aucun utilisateur n'est connecté
    // if (!user) {
    //     return <p>Pas d'utilisateur connecté.</p>;
    // }

    // useEffect(() => {
    //     // Si l'utilisateur est défini, récupérer les informations de l'entreprise associée à userId
    //     const fetchCompany = async () => {
    //         try {
    //             const response = await fetch(
    //                 `http://${domain}:${port}/api/company?userId=${user.userId}` // Utilisez userId pour récupérer l'entreprise de l'utilisateur
    //             );
    //             if (!response.ok) {
    //                 throw new Error(`Error: ${response.statusText}`);
    //             }
    //             const data: Company = await response.json();
    //             setCompany(data); // Mettre à jour l'état avec les données de l'entreprise
    //         } catch (err: any) {
    //             setError(err.message);
    //         }
    //     };

    //     fetchCompany();
    // }, [user]);

    return (
        <div className="container">
            <h1 className="text-center">Company Details</h1>
            <div className="row">
                {company ? (
                    <div className="col-12">
                        <div className="">
                            <div className="c">
                                <h5 className="">{company.name}</h5>
                                <p className="">{company.description}</p>
                                {/* Passer le companyId à CompanyOffers ici */}
                                <CompanyOffers companyId={+company.companyId} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading company information...</p>
                )}
            </div>
        </div>
    );
}
