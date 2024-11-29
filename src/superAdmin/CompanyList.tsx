import { useEffect, useState } from "react";
import { domain, port } from "../../env.json";
import { SuperAuthChecker } from "./SuperAuthChecker";
import { CompanyContextType } from "../assets/contexts/companyContext";
import { CompanyEditor } from "../components/forms/CompanyEditor";

export function CompanyList() {
    const [loading, setLoading] = useState<boolean>(true);
    const [companies, setCompanies] = useState<CompanyContextType[]>([]);
    const [hidden, setHidden] = useState<boolean>(false);

    useEffect(() => {
        if (!loading) return;
        fetch(`http://${domain}:${port}/api/company/list`, {
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) return response.json();
            throw new Error(`${response.status}`);
        })
        .then(setCompanies)
        setLoading(false);
    }, [loading]);

    function onHide() {
        setHidden(prev => !prev);
    }

    return <SuperAuthChecker>
        <div className="d-flex align-items-center mb-3 border-bottom">
            <h1 className="m-3">All Companies</h1>
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
                {companies.map(company => <CompanyEditor key={company?.companyId} company={company} skipPassword={true} setLoading={setLoading}/>)}
            </div>
        }
        
    </SuperAuthChecker>
}