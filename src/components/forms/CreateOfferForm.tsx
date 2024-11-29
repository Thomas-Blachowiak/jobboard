import { useState, useRef } from "react";
import { domain, port } from "../../../env.json";
import { Navigate } from "react-router-dom";

interface FormState {
    title: string;
    description: string;
    city: string;
    salary: number;
    hours: number;
}

export function CreateOfferForm({title, companyId, skipRedirection}: {title?: string, companyId: string, skipRedirection?: boolean}) {
    const [formState, setFormState] = useState<FormState>({
        title: "",
        description: "",
        city: "",
        salary: 0,
        hours: 0,
    });
    const titleRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);
    const cityRef = useRef<HTMLInputElement>(null);
    const salaryRef = useRef<HTMLInputElement>(null);
    const hoursRef = useRef<HTMLInputElement>(null);

    const [redirectionState, setRedirect] = useState<string>();

    function handleFormUpdate(ev: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) {
        const { id, value } = ev.target;

        if (value.length > 0) {
            ev.target.classList.remove("is-invalid");
        }

        setFormState((prevState) => ({
            ...prevState,
            [id]: id === "salary" || id === "hours" ? parseFloat(value) : value,
        }));
    }

    if (redirectionState) return <Navigate to={`/offer-details/${redirectionState}`}/>;
    return (
        <div>
            {title ? <h3 className="mt-3 text-center">{title}</h3> : undefined}
            <form
                className="p-1 d-flex flex-column align-items-center"
                method="POST"
                onSubmit={(ev) => {
                    ev.preventDefault();

                    let valid = true;

                    if (!formState.title) {
                        titleRef.current
                            ?.classList.add("is-invalid");
                        valid = false;
                    }
                    if (!formState.description) {
                        descRef.current
                            ?.classList.add("is-invalid");
                        valid = false;
                    }
                    if (!formState.city) {
                        cityRef.current
                            ?.classList.add("is-invalid");
                        valid = false;
                    }
                    if (!formState.salary) {
                        salaryRef.current
                            ?.classList.add("is-invalid");
                        valid = false;
                    }
                    if (!formState.hours) {
                        hoursRef.current
                            ?.classList.add("is-invalid");
                        valid = false;
                    }
                    if (!valid) return;

                    fetch(`http://${domain}:${port}/api/offer`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({...formState, companyId}),
                    })
                        .then((response) => {
                            if (!response.ok) throw new Error();
                            return response.json();
                        })
                        .then(offer => {
                            if (!skipRedirection) setRedirect(offer.offerId);
                            else alert(`Success`);
                        })
                        .catch((err) => {
                            console.error(err);
                            alert(
                                "Failed to submit the form. Please try again."
                            );
                        });
                }}>
                <div className="mb-1 col-8 form-floating">
                    
                    <input
                        ref={titleRef}
                        type="text"
                        placeholder=""
                        className="form-control"
                        id="title"
                        onChange={handleFormUpdate}></input>
                    <label htmlFor="title" className="form-label">
                        Job Title
                    </label>
                </div>
                <div className="mb-1 col-8 form-floating">
                    <input
                        ref={cityRef}
                        type="text"
                        placeholder=""
                        className="form-control"
                        id="city"
                        onChange={handleFormUpdate}></input>
                    <label htmlFor="city" className="form-label">
                        City
                    </label>
                </div>
                <div className="input-group mb-1 col-8" style={{width: `${200/3}%`}}>
                    <div className="form-floating">
                        <input
                            ref={salaryRef}
                            type="number"
                            min={0}
                            placeholder=""
                            className="form-control"
                            id="salary"
                            onChange={handleFormUpdate}></input>
                        <label htmlFor="salary" className="form-label">
                            Monthly Salary
                        </label>
                    </div>
                    <span className="input-group-text" style={{width: '20%', justifyContent: 'center'}}>€</span>
                </div>
                <div className="mb-1 col-8 form-floating">
                    <input
                        ref={hoursRef}
                        type="number"
                        min={0}
                        placeholder=""
                        className="form-control"
                        id="hours"
                        onChange={handleFormUpdate}></input>
                    <label htmlFor="hours" className="form-label">
                        Weekly Hours
                    </label>
                </div>
                <div className="mb-1 col-8 form-floating">
                    <textarea
                        ref={descRef}
                        className="form-control"
                        placeholder=""
                        id="description"
                        onChange={handleFormUpdate}></textarea>
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                </div>
                <div className="mt-2 col-3 form-floating">
                    <input type="submit" className="btn btn-primary w-100" value={"Submit"}/>
                </div>
            </form>
        </div>
    );
}
