import Navbar from "../components/Navbar";

import { SignupForm } from "../components/forms/SignupForm";


export function SignUp() {
    
    return (
        <>
            <Navbar />
            <h1 className="text-center m-3">Sign Up for free !</h1>
            <SignupForm/>
        </>
    );
}
