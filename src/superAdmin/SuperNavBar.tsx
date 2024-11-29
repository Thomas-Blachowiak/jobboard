import { NavLink } from "react-router-dom";

export function SuperNavBar() {
    return (
        <header className="d-flex flex-wrap justify-content-center px-3 py-3 border-bottom">
            <a
                href="/"
                className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                <span className="fs-4 px-2">Admin Tools</span>
            </a>

            <ul className="nav nav-pills">
                <li className="nav-item" aria-current="page">
                    <NavLink to="/admin/user" className="nav-link">
                        Users
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/company" className="nav-link">
                        Companies
                    </NavLink>
                </li>
                <li className="nav-item" aria-current="page">
                    <NavLink to="/admin/offer" className="nav-link">
                        Offers
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/application" className="nav-link">
                        Applications
                    </NavLink>
                </li>
            </ul>
        </header>
    );
}

