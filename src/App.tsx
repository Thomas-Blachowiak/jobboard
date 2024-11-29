import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Profil } from "./views/Profil";
import { Company } from "./views/Company";
import { CreateCompany } from "./views/CreateCompany";
import { Home } from "./views/Home";
import { SignUp } from "./views/SignUp";
import { LogIn } from "./views/LogIn";
import { JobOffers } from "./views/JobOffers";
import { UserContext, UserContextType } from "./assets/contexts/userContext";
import { useState } from "react";
import { LogOut } from "./components/LogOut";
import { LoginStateChecker } from "./components/helpers/LoginStateChecker";
import { Users } from "./views/admin/Users";
import { Companies } from "./views/admin/Companies";
import { Offers } from "./views/admin/Offers";
import { Applications } from "./views/admin/Applications";
import { CompanyContext, CompanyContextType } from "./assets/contexts/companyContext";
import { OfferDetails } from "./components/OfferDetails";
import { Applicants } from "./views/Applicants";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "profil",
        element: <Profil />,
    },
    {
        path: "job-offers",
        element: <JobOffers />,
    },
    {
        path: "offer-details/:offerId", // Route avec paramètre dynamique offerId
        element: <OfferDetails />,
    },
    {
        path: "applicants/:offerId", // Route avec paramètre dynamique offerId
        element: <Applicants />,
    },
    {
        path: "company",
        element: <Company />,
    },
    {
        path: "create-company",
        element: <CreateCompany />,
    },
    {
        path: "sign-up",
        element: <SignUp />,
    },
    {
        path: "log-in",
        element: <LogIn />,
    },
    {
        path: "log-out",
        element: <LogOut />,
    },
    {
        path: "admin",
        children: [
            {
                path: "user",
                element: <Users />,
            },
            {
                path: "company",
                element: <Companies />,
            },
            {
                path: "offer",
                element: <Offers />,
            },
            {
                path: "application",
                element: <Applications />,
            },
        ],
    },
]);

function App() {
    const userState = useState<UserContextType | null>(null);
    const companyState = useState<CompanyContextType | null>(null);
    const [userChecked, setUserChecked] = useState<boolean>(false);
    return (
        <UserContext.Provider value={userState}>
            <CompanyContext.Provider value={companyState}>
                {userChecked ? (
                    <RouterProvider router={router} />
                ) : (
                    <LoginStateChecker setChecked={setUserChecked} />
                )}
            </CompanyContext.Provider>
        </UserContext.Provider>
    );
}

export default App;
