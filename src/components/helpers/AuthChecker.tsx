import {useContext, type ReactNode} from "react";
import { UserContext } from "../../assets/contexts/userContext";
import { Navigate } from "react-router-dom";

export function AuthChecker({children}: {children?: ReactNode}) {
    const userContext = useContext(UserContext);
    /** @TODO Missing context error handling */
    if (!userContext) return;
    const [user] = userContext;
    // if there is no user state, redirect to login page
    if (!user) return <Navigate to="/log-in"/>;

    // if user is logged in, render the component
    return children;
}