import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { ExpandingArea } from "../helpers/ExpandingArea";
import { CompanySecletor } from "../selectors/CompanySelector";
import { domain, port } from "../../../env.json";
import { type OfferDetails } from "../OfferDetails"


interface FormState {
    title: string;
    city: string;
    salary: number;
    hours: number;
    description: string;
}

export function UpdateOfferForm({
    offer,
    setOffer,
    name,
    allowCompanyChange,
    setLoading,
}: {
    allowCompanyChange?: boolean;
    offer: OfferDetails;
    setOffer?: Dispatch<SetStateAction<OfferDetails>>;
    name?: string;
    setLoading?: Dispatch<SetStateAction<boolean>>;
}) {
    if (!offer) return;
    const companyRef = useRef<HTMLInputElement>(null);
    const areaRef = useRef<HTMLTextAreaElement>(null);
    const [companyState, setCompany] = useState<string>("");
    const [formState, setFormState] = useState<FormState>({
        title: offer.title,
        city: offer.city,
        salary: offer.salary,
        hours: offer.hours,
        description: offer.description,
    });

    function handleFormUpdate(
        ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const newValue = ev.target.value;

        setFormState((prevState) => {
            return {
                ...prevState,
                [ev.target.id]: newValue,
            };
        });
    }
    console.log(offer);
    return (
        <div className="">
            <div className="position-sticky">
                <div className="p-4 mb-3 bg-body-tertiary rounded">
                    {name ? (
                        <h3 className="mt-3 text-center">{name}</h3>
                    ) : undefined}
                    <form
                        className="p-1 d-flex flex-column align-items-center"
                        method="POST"
                        onSubmit={(ev) => {
                            ev.preventDefault();

                            fetch(`http://${domain}:${port}/api/offer`, {
                                method: "PATCH",
                                credentials: "include",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    offerId: offer.offerId,
                                    companyId: companyState
                                        ? companyState
                                        : undefined,
                                    title: formState.title
                                        ? formState.title
                                        : undefined,
                                    city: formState.city
                                        ? formState.city
                                        : undefined,
                                    hours: formState.hours
                                        ? formState.hours
                                        : undefined,
                                    salary: formState.salary
                                        ? formState.salary
                                        : undefined,
                                    description: formState.description
                                        ? formState.description
                                        : undefined,
                                }),
                            })
                                .then((response) => {
                                    if (!response.ok)
                                        throw new Error(
                                            `${response.status}: ${response.statusText}`
                                        );
                                    return response.json();
                                })
                                .then((data) => {
                                    if (setOffer) setOffer(data);
                                })
                                .catch(console.error);
                        }}>
                        {allowCompanyChange ? (
                            <CompanySecletor
                                inputRef={companyRef}
                                setState={setCompany}
                            />
                        ) : undefined}

                        <div className="mb-1 col-12 form-floating">
                            <input
                                onChange={handleFormUpdate}
                                type="text"
                                className="form-control"
                                id="title"
                                defaultValue={offer.title}
                            />
                            <label htmlFor="title" className="form-label">
                                Job Title
                            </label>
                        </div>
                        <div className="mb-1 col-12 form-floating">
                            <input
                                onChange={handleFormUpdate}
                                type="text"
                                className="form-control"
                                id="city"
                                defaultValue={offer.city}
                            />
                            <label htmlFor="city" className="form-label">
                                City
                            </label>
                        </div>
                        <div className="mb-1 col-12 input-group">
                            <div className="form-floating">
                                <input
                                    onChange={handleFormUpdate}
                                    type="number"
                                    className="form-control"
                                    id="salary"
                                    defaultValue={offer.salary}
                                />
                                <label htmlFor="salary" className="form-label">
                                    Salary:
                                </label>
                            </div>
                            <span
                                className="input-group-text"
                                style={{
                                    width: "20%",
                                    justifyContent: "center",
                                }}>
                                €
                            </span>
                        </div>
                        <div className="mb-1 col-12 form-floating">
                            <input
                                type="number"
                                onChange={handleFormUpdate}
                                className="form-control"
                                id="hours"
                                defaultValue={offer.hours}
                            />
                            <label htmlFor="hours" className="form-label">
                                Weekly Hours
                            </label>
                        </div>
                        <div className="mb-1 col-12 form-floating">
                            <ExpandingArea
                                areaId="description"
                                onChange={handleFormUpdate}
                                areaRef={areaRef}
                                defaultValue={offer.description}
                            />
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                        </div>
                        <div className="mt-2 col-12">
                            <button
                                type="submit"
                                className="btn btn-primary w-100">
                                Submit
                            </button>
                            <button
                                className="btn btn-danger w-100"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    fetch(
                                        `http://${domain}:${port}/api/offer`,
                                        {
                                            method: "DELETE",
                                            credentials: "include",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify({
                                                offerId: offer.offerId,
                                            }),
                                        }
                                    )
                                        .then((response) => {
                                            if (!response.ok)
                                                throw new Error(
                                                    `${response.status}: ${response.statusText}`
                                                );
                                            return response.json();
                                        })
                                        .then(() => {
                                            if (setLoading) setLoading(true);
                                            if (setOffer) setOffer(null);
                                        })
                                        .catch(console.error);
                                }}>
                                Delete
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
