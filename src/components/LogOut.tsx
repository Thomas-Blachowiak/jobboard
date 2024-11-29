import { domain, port} from "../../env.json";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../assets/contexts/userContext";
import { AuthChecker } from "./helpers/AuthChecker";
import { CompanyContext } from "../assets/contexts/companyContext";

export function LogOut() {
    const userContext = useContext(UserContext);
    const companyContext = useContext(CompanyContext);
    if (!userContext || !companyContext) return;
    const setUser = userContext[1];
    const setCompany = companyContext[1];
    const [loadState, setLoadState] = useState<string>("Logging out ...");
    useEffect(() => {
        fetch(`http://${domain}:${port}/api/logout`, {
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) throw new Error(`${response.status}`);
        })
        .then(() => {
            setCompany(null);
            setUser(null);
        })
        .catch(err => {
            console.error(err);
            setLoadState('Internal error while logging out');
        });
    }, []);
    

    return <AuthChecker>
        {loadState}
    </AuthChecker>
}