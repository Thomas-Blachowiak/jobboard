import React, { useEffect, useState } from "react";
import { port, domain } from "../../env.json";

interface Company {
    companyId: number;
    name: string;
    description: string;
    email: string;
    siretNumber: string;
}

const CompanyList: React.FC = () => {
    const [companies, setOffers] = useState<Company[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCompanyId, setExpandedCompanyId] = useState<number | null>(
        null
    );

    const fetchCompanies = async (): Promise<void> => {
        try {
            const response = await fetch(
                `http://${domain}:${port}/api/company/list`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data: Company[] = await response.json();
            setOffers(data);
        } catch (err) {
            setError("Error fetching companies");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }

    const handleDetailsClick = (companyId: number): void => {
        setExpandedCompanyId((prevId) =>
            prevId === companyId ? null : companyId
        );
    };

    return (
        <div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="row">
                            {companies.map((company) => (
                                <div
                                    className="row p-2"
                                    key={company.companyId}>
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                {company.name}
                                            </h5>
                                            {expandedCompanyId ===
                                                company.companyId && (
                                                <div className="mt-2">
                                                    <p>{company.description}</p>
                                                    <p>{company.email}</p>
                                                </div>
                                            )}
                                            <a
                                                href="#"
                                                className="btn btn-dark"
                                                onClick={() =>
                                                    handleDetailsClick(
                                                        company.companyId
                                                    )
                                                }>
                                                {expandedCompanyId ===
                                                company.companyId
                                                    ? "Hide Details"
                                                    : "Details"}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyList;
