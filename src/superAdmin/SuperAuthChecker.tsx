import {useContext, useEffect, useState, type ReactNode} from "react";
import { UserContext } from "../assets/contexts/userContext";
import { Navigate } from "react-router-dom";
import { domain, port } from "../../env.json";

export function SuperAuthChecker({children}: {children: ReactNode}) {
    const userContext = useContext(UserContext);
    if (!userContext) return <Navigate to="/"/>;
    const [admin, setAdmin] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);
    const [ fallback, setFallback ] = useState<ReactNode>(<></>)
    useEffect(() => {
        fetch(`http://${domain}:${port}/api/amiadmin`, {credentials: 'include'})
            .then((response) => {
                if (!response.ok) throw new Error(`${response.status}`);
                return response.json();
            })
            .then(setAdmin)
            .catch(console.error)
            .finally(() => {
                setFallback(<Navigate to="/log-in"/>);
                setChecked(true);
            });
    }, [])
    
    if (!checked) return <>Loading...</>;
    else if (admin) return children;
    else return fallback
}