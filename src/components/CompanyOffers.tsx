// // CompanyOffers.tsx
// import React, { useEffect, useState } from "react";
// import { port, domain } from "../../env.json"; // Utilisation de domain et port pour API
// import { UpdateOfferForm } from "./forms/UpdateOfferForm";

// interface Offer {
//     offerId: number;
//     title: string;
//     description: string;
//     salary: number;
//     hours: number;
// }

// interface Company {
//     companyId: number;
//     name: string;
//     offers: Offer[]; // Les offres proposées par la compagnie
// }

// interface CompanyOffersProps {
//     companyId: string; // L'identifiant de la compagnie
//     skipPassword?: boolean
// }

// const CompanyOffers: React.FC<CompanyOffersProps> = ({ companyId , skipPassword}) => {
//     const [company, setCompany] = useState<Company | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     // Fonction pour récupérer les informations de l'entreprise et ses offres
//     const fetchCompanyOffers = async () => {
//         try {
//             const response = await fetch(
//                 `http://${domain}:${port}/api/company?companyId=${companyId}`
//             );
//             if (!response.ok) {
//                 throw new Error("Failed to fetch company details");
//             }
//             const data: Company = await response.json();
//             setCompany(data);
//         } catch (err) {
//             setError("Error fetching company details");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchCompanyOffers();
//     }, [companyId]);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>{error}</div>;
//     }

//     return (
//         <div>
//             {company ? (
//                 <div className="container">
//                     <h3>Offers:</h3>
//                     {company.offers.length > 0 ? (
//                         company.offers.map((offer) => (
//                             <div className="row m-3" key={offer.offerId}>
//                                 <div className="card">
//                                     <div className="card-body">
//                                         <h5 className="card-title">
//                                             {offer.title}
//                                         </h5>
//                                         <p className="card-text">
//                                             Salary: {offer.salary} $
//                                         </p>
//                                         <p className="card-text">
//                                             Hours: {offer.hours}
//                                         </p>
//                                         <p className="card-text">
//                                             Description: {offer.description}
//                                         </p>
//                                     </div>
//                                     <div className="gx-2 gy-2">
//                                         <input
//                                             type="submit"
//                                             value="Update Information"
//                                             className="btn btn-primary w-100"
//                                         />
//                                         <button
//                                             className="btn btn-danger w-100"
//                                             onClick={(ev) => {
//                                                 ev.preventDefault();
//                                                 if (
//                                                     !confirm(
//                                                         "Are you sure ? Doing so is definitive."
//                                                     )
//                                                 )
//                                                     return;
//                                                 if (
//                                                     !confirm(
//                                                         "Are you realy, realy sure ?"
//                                                     )
//                                                 )
//                                                     return;
//                                                 fetch(
//                                                     `http://${domain}:${port}/api/offer`,
//                                                     {
//                                                         method: "DELETE",
//                                                         credentials: "include",
//                                                         headers: {
//                                                             "Content-Type":
//                                                                 "application/json",
//                                                         },
//                                                         body: JSON.stringify({
//                                                             companyId:
//                                                                 offerState.offerId,
//                                                             password:
//                                                                 skipPassword
//                                                                     ? undefined
//                                                                     : formState.currentPassword,
//                                                         }),
//                                                     }
//                                                 )
//                                                     .then((response) => {
//                                                         if (response.ok)
//                                                             return response.json();
//                                                         if (!skipPassword)
//                                                             passRef.current?.classList.add(
//                                                                 "is-invalid"
//                                                             );
//                                                         throw new Error(
//                                                             `${response.status}`
//                                                         );
//                                                     })
//                                                     .then(() => {
//                                                         if (setLoading)
//                                                             setLoading(true);
//                                                         if (setCompany)
//                                                             setCompany(null);
//                                                     })
//                                                     .catch(console.error);
//                                             }}>
//                                             Delete Offer
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <p>No offers available for this company.</p>
//                     )}
//                 </div>
//             ) : (
//                 <p>Company not found</p>
//             )}
//         </div>
//     );
// };

// export default CompanyOffers;
