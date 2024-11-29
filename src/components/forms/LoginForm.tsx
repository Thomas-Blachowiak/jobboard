import { port, domain } from "../../../env.json";
import { useContext, useState } from "react";
import { UserContext } from "../../assets/contexts/userContext";
import { Navigate } from "react-router-dom";
import { validator } from "sequelize/lib/utils/validator-extras";
import { CompanyContext } from "../../assets/contexts/companyContext";

interface FormState {
    userCredentials: string;
    password: string;
}

export function LoginForm({width, goTo}: {width?: number, goTo?: string}) {
    // get the user context
    const userContext = useContext(UserContext);
    const companyContext = useContext(CompanyContext);
    /** @TODO Error handling when context isnt setup */
    if (!userContext || !companyContext) return;
    const [user, setUser] = userContext;
    const setCompany = companyContext[1];
    if (user) return <Navigate to={`${goTo ? goTo : "/"}`}/>;

    // it is needed to keep a state of the form
    // for react to interact with the content
    const [formState, setFormState] = useState<FormState>({
        userCredentials: "",
        password: "",
    });

    function handleFormUpdate(ev: React.ChangeEvent<HTMLInputElement>) {
        const newValue = ev.target.value;
        if (ev.target.type === "text") {
            if (
                validator.isMobilePhone(newValue, "fr-FR") ||
                validator.isEmail(newValue)
            ) {
                ev.target.classList.add("is-valid");
                ev.target.classList.remove("is-invalid");
            } else if (!newValue) {
                ev.target.classList.remove("is-valid");
                ev.target.classList.remove("is-invalid");
            } else {
                ev.target.classList.remove("is-valid");
                ev.target.classList.add("is-invalid");
            }
        }
        if (ev.target.type === "password") {
            ev.target.classList.remove("is-invalid");
        }
        setFormState((prevState) => {
            return {
                ...prevState,
                [ev.target.id]: newValue,
            };
        });
    }

    return (
        <div className="row gy-5">
            <h1 className="text-center">Please log in</h1>
            <form
                className={`col-md-${width ? width : 12} col-12  mx-auto d-flex flex-column align-items-center`}
                onSubmit={(ev) => {
                    ev.preventDefault();
                    if (
                        !validator.isEmail(formState.userCredentials) &&
                        !validator.isMobilePhone(
                            formState.userCredentials,
                            "fr-FR"
                        )
                    )
                        return;
                    fetch(`http://${domain}:${port}/api/login`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formState),
                    })
                        .then((response) => {
                            if (response.ok) return response.json();
                            if (response.status === 403)
                                document
                                    .getElementById("password")
                                    ?.classList.add("is-invalid");
                        })
                        .then((loginData) => {
                            console.log(loginData);
                            if (loginData.company)
                                setCompany(loginData.company);
                            setUser(loginData);
                        })
                        .catch((err) => console.error(err));
                }}>
                <div className="mb-1 col-12 form-floating">
                    <input
                        type="text"
                        className="form-control w-100"
                        id="userCredentials"
                        aria-describedby="emailHelp"
                        onChange={handleFormUpdate}></input>
                    <label htmlFor="userCredentials" className="form-label">
                        Email / Phone
                    </label>
                </div>
                <div className="mb-1 col-12 form-floating">
                    <input
                        type="password"
                        className="form-control w-100"
                        id="password"
                        onChange={handleFormUpdate}></input>
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                </div>
                <div className="mb-3 col-9">
                    <button type="submit" className="btn btn-primary w-100">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
