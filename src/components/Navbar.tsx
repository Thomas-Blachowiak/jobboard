import { NavLink } from "react-router-dom";
import { AuthCondition } from "./helpers/AuthCondition";
import { ContextCondition } from "./helpers/ContextCondition";
import { CompanyContext } from "../assets/contexts/companyContext";
import { AdminCondition } from "./helpers/AdminCondition";

function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg justify-content-between align-items-center">
            <div className="align-items-center">
                <a
                    href="/"
                    className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                    <span className="fs-4 px-2">Piermas Job</span>
                    <img
                        src="/assets/images/carots.png"
                        className="bi me-2"
                        width="40"
                        height="32"></img>
                </a>
            </div>

            <button
                className="navbar-toggler align-items-center"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div
                className="collapse navbar-collapse justify-content-end"
                id="navbarNavDropdown">
                <ul className="nav nav-pills">
                    <AdminCondition
                        true={
                            <li>
                                <NavLink to="/admin/user" className="nav-link">
                                    Admin Pannel
                                </NavLink>
                            </li>
                        }
                        false={undefined}
                    />
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

                    <AuthCondition
                        true={
                            <>
                                <li className="nav-item">
                                    <NavLink to="/profil" className="nav-link">
                                        My space
                                    </NavLink>
                                </li>
                                <ContextCondition
                                    context={CompanyContext}
                                    true={
                                        <li className="nav-item">
                                            <NavLink
                                                to="/company"
                                                className="nav-link">
                                                My Company
                                            </NavLink>
                                        </li>
                                    }
                                    false={
                                        <li className="nav-item">
                                            <NavLink
                                                to="/create-company"
                                                className="nav-link">
                                                Create a company
                                            </NavLink>
                                        </li>
                                    }
                                />
                                <li>
                                    <NavLink
                                        to="/log-out"
                                        className={"nav-link"}>
                                        Log Out
                                    </NavLink>
                                </li>
                            </>
                        }
                        false={
                            <>
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
                            </>
                        }
                    />
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
