import {Context, Dispatch, SetStateAction, useContext, type ReactNode} from "react";
import { Navigate } from "react-router-dom";

export function ContextChecker({children, context}: {children: ReactNode, context: Context<any>}) {
    const contextBundle = useContext(context);
    /** @TODO Missing context error handling */
    if (!contextBundle) return;
    const [contextData] = contextBundle;
    // if there is no user state, redirect to login page
    if (!contextData) return <Navigate to="/log-in"/>;

    // if user is logged in, render the component
    return children;
}