import Navbar from "../components/Navbar";
import { port, domain } from "../../env.json";
import { useContext, useState } from "react";
import { UserContext } from "../assets/contexts/userContext";
import { Navigate } from "react-router-dom";
import { validator } from "sequelize/lib/utils/validator-extras";
import { CompanyContext } from "../assets/contexts/companyContext";
import { Footer } from "../components/Footer";
import { LoginForm } from "../components/forms/LoginForm";

interface FormState {
    userCredentials: string;
    password: string;
}

export function LogIn() {
    

    return (
        <div className="container">
            <Navbar />
            <LoginForm width={6}/>
            <Footer/>
        </div>
            
    );
}
