import { NavLink } from "react-router-dom";

export function Footer() {
    return (
        <>
            <footer className="py-3 my-4 border-top">
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                    <li className="nav-item" aria-current="page">
                        <NavLink to="/" className="nav-link">
                            Home
                        </NavLink>
                    </li>
                    <li className="nav-item" aria-current="page">
                        <NavLink to="/job-offers" className="nav-link">
                            Job offers
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/log-in" className="nav-link">
                            Log In
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/sign-up" className="nav-link">
                            Sign Up
                        </NavLink>
                    </li>
                </ul>
                <p className="text-center text-body-secondary">
                    © 2024 Company, Inc
                </p>
            </footer>
        </>
    );
}
