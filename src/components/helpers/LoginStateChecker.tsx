import { Dispatch, SetStateAction, useContext, useEffect } from "react"
import { UserContext } from "../../assets/contexts/userContext";
import { domain, port } from "../../../env.json";
import { CompanyContext } from "../../assets/contexts/companyContext";

export function LoginStateChecker({setChecked}: {setChecked: Dispatch<SetStateAction<boolean>>}) {
    const userContext = useContext(UserContext);
    const companyContext = useContext(CompanyContext);
    if (!userContext || !companyContext) return <></>;
    const [user, setUser] = userContext;
    const [company, setCompany] = companyContext;
    useEffect(() => {
        if (!user) fetch(`http://${domain}:${port}/api/whoami`, {credentials: 'include'})
            .then((response) => {
                if (!response.ok) throw new Error(`${response.status}`);
                return response.json();
            })
            .then(usr => {
                if (usr && usr.company) setCompany(usr.company);
                setUser(usr);
            })
            .catch(console.error)
            .finally(() => {
                setChecked(true);
            });
    }, [])
    
    return <>Loading</>;
}