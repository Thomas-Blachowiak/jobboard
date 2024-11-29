import { useContext, useRef, useState } from "react";
import { UserContext } from "../../assets/contexts/userContext";
import { Navigate } from "react-router-dom";
import validator from "validator";
import { domain, port } from "../../../env.json";

interface FormState {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export function SignupForm({ skipRedirection }: { skipRedirection?: boolean }) {
    // get the user context
    const userContext = useContext(UserContext);
    /** @TODO Error handling when context isnt setup */
    if (!userContext) return;
    const [user, setUser] = userContext;
    if (!skipRedirection && user) return <Navigate to="/" />;

    const passRef = useRef<HTMLInputElement>(null);
    const confirmRef = useRef<HTMLInputElement>(null);
    const mailRef = useRef<HTMLInputElement>(null);
    const fnameRef = useRef<HTMLInputElement>(null);
    const lnameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);

    const [formState, setFormState] = useState<FormState>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    function handleFormUpdate(ev: React.ChangeEvent<HTMLInputElement>) {
        const newValue = ev.target.value;
        /** @TODO Capitalize name properly */
        if (ev.target.type === "text" && ev.target.value.length > 0)
            ev.target.classList.remove("is-invalid");
        if (ev.target.type === "email") {
            if (validator.isEmail(newValue)) {
                ev.target.classList.remove("is-invalid");
                ev.target.classList.add("is-valid");
            } else if (newValue === "") {
                ev.target.classList.remove("is-invalid");
                ev.target.classList.remove("is-valid");
            } else {
                ev.target.classList.add("is-invalid");
                ev.target.classList.remove("is-valid");
            }
        }
        if (ev.target.type === "tel") {
            if (validator.isMobilePhone(newValue, "fr-FR")) {
                ev.target.classList.remove("is-invalid");
                ev.target.classList.add("is-valid");
            } else if (newValue === "") {
                ev.target.classList.remove("is-invalid");
                ev.target.classList.remove("is-valid");
            } else {
                ev.target.classList.add("is-invalid");
                ev.target.classList.remove("is-valid");
            }
        }
        if (ev.target.id === "password") {
            if (validator.isStrongPassword(newValue, { minSymbols: 0 })) {
                ev.target.classList.remove("is-invalid");
                ev.target.classList.add("is-valid");
            } else if (newValue === "") {
                ev.target.classList.remove("is-invalid");
                ev.target.classList.remove("is-valid");
            } else {
                ev.target.classList.add("is-invalid");
                ev.target.classList.remove("is-valid");
            }
        }
        if (ev.target.id === "confirmPassword" || ev.target.id === "password") {
            const updateInput = passRef.current as HTMLInputElement;
            const confirmInput = confirmRef.current as HTMLInputElement;
            if (updateInput.value && updateInput.value === confirmInput.value) {
                confirmInput.classList.remove("is-invalid");
                confirmInput.classList.add("is-valid");
            } else if (updateInput.value) {
                confirmInput.classList.add("is-invalid");
                confirmInput.classList.remove("is-valid");
            } else {
                confirmInput.classList.remove("is-invalid");
                confirmInput.classList.remove("is-valid");
            }
        }
        setFormState((prevState) => {
            return {
                ...prevState,
                [ev.target.id]: newValue,
            };
        });
    }

    return (
        <form
            className="p-5 d-flex flex-column align-items-center"
            method="POST"
            onSubmit={(ev) => {
                ev.preventDefault();

                if (!formState.email)
                    mailRef.current?.classList.add("is-invalid");
                if (!formState.firstName)
                    fnameRef.current?.classList.add("is-invalid");
                if (!formState.lastName)
                    lnameRef.current?.classList.add("is-invalid");
                if (!formState.phone)
                    phoneRef.current?.classList.add("is-invalid");
                if (!formState.password)
                    passRef.current?.classList.add("is-invalid");
                if (
                    !formState.email ||
                    !formState.firstName ||
                    !formState.lastName ||
                    !formState.phone ||
                    !formState.password ||
                    !formState.confirmPassword
                )
                    return;
                if (!validator.isEmail(formState.email)) return;
                if (!validator.isMobilePhone(formState.phone, "fr-FR")) return;
                if (
                    !validator.isStrongPassword(formState.password, {
                        minSymbols: 0,
                    })
                )
                    return;

                if (formState.password !== formState.confirmPassword) return;
                fetch(`http://${domain}:${port}/api/user`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formState),
                })
                    .then((response) => {
                        if (!response.ok) throw new Error();
                        return;
                    })
                    .then(() => {
                        if (!skipRedirection)
                            fetch(`http://${domain}:${port}/api/login`, {
                                method: "POST",
                                credentials: "include",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    userCredentials: formState.email,
                                    password: formState.password,
                                }),
                            })
                                .then((response) => {
                                    if (!response.ok) throw new Error();
                                    return response.json();
                                })
                                .then((userData) => {
                                    setUser(userData);
                                })
                                .catch(() => {
                                    throw new Error("Login error");
                                });
                    })
                    .catch((err) => {
                        /** @todo handle Sign-up errors */
                        console.error(err);
                    });
            }}>
            <div className="mb-1 col-md-5 col-12 form-floating">
                <input
                    ref={fnameRef}
                    type="text"
                    className="form-control"
                    id="firstName"
                    onChange={handleFormUpdate}
                    placeholder=""></input>
                <label htmlFor="firstName" className="form-label">
                    First Name
                </label>
            </div>
            <div className="mb-1 col-md-5 col-12 form-floating">
                <input
                    ref={lnameRef}
                    type="text"
                    className="form-control"
                    id="lastName"
                    onChange={handleFormUpdate}
                    placeholder=""></input>
                <label htmlFor="lastName" className="form-label">
                    Last Name
                </label>
            </div>
            <div className="mb-1 col-md-5 col-12 form-floating">
                <input
                    ref={phoneRef}
                    type="tel"
                    className="form-control"
                    id="phone"
                    onChange={handleFormUpdate}
                    placeholder=""></input>
                <label htmlFor="phone" className="form-label">
                    Phone number
                </label>
            </div>
            <div className="mb-1 col-md-5 col-12 form-floating">
                <input
                    ref={mailRef}
                    type="email"
                    className="form-control"
                    id="email"
                    aria-describedby="emailHelp"
                    onChange={handleFormUpdate}
                    placeholder=""></input>
                <label htmlFor="email" className="form-label">
                    Email
                </label>
            </div>
            <div className="mb-1 col-md-5 col-12 form-floating">
                <input
                    ref={passRef}
                    type="password"
                    className="form-control"
                    id="password"
                    onChange={handleFormUpdate}
                    placeholder=""></input>
                <label htmlFor="password" className="form-label">
                    Password
                </label>
            </div>
            <div className="mb-1 col-md-5 col-12 form-floating">
                <input
                    ref={confirmRef}
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    onChange={handleFormUpdate}
                    placeholder=""></input>
                <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                </label>
            </div>

            <div className="mb-3 col-md-5 col-12">
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </div>
        </form>
    );
}
