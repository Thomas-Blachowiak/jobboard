import { useContext, useState } from "react";
import {domain, port} from "../../../env.json";
import { CompanyContext } from "../../assets/contexts/companyContext";
import { validator } from "sequelize/lib/utils/validator-extras";

interface FormState {
    name: string;
    description: string;
    siretNumber: string;
    email: string;
}


export function NewCompanyForm({dontAddMe}: {dontAddMe?: true}) {

    const companyContext = useContext(CompanyContext);
    if (!companyContext) return;
    const setCompany = companyContext[1];

    const [formState, setFormState] = useState<FormState>({
        name: "",
        description: "",
        siretNumber: "",
        email: "",
    });

    function handleFormUpdate(
        ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { id, value } = ev.target;

        if (id === 'siretNumber') {
            if (validator.isNumeric(value) && value.length === 14) {
                ev.target.classList.remove('is-invalid');
                ev.target.classList.add('is-valid');   
            } else if (!value) {
                ev.target.classList.remove('is-invalid');
                ev.target.classList.remove('is-valid'); 
            } else {
                ev.target.classList.add('is-invalid');
                ev.target.classList.remove('is-valid'); 
            }
        }
        if (id === 'email') {
            console.log(!value)
            if (validator.isEmail(value)) {
                ev.target.classList.remove('is-invalid');
                ev.target.classList.add('is-valid');   
            } else if (!value) {
                console.log('removig')
                ev.target.classList.remove('is-invalid');
                ev.target.classList.remove('is-valid'); 
            } else {
                ev.target.classList.add('is-invalid');
                ev.target.classList.remove('is-valid'); 
            }
        }
        setFormState((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        /*console.log(formState);*/
        if (
            !formState.name ||
            !formState.description ||
            !formState.siretNumber
        ) {
            console.error("Tous les champs doivent être remplis !");
            return;
        }

        try {
            const response = await fetch(
                `http://${domain}:${port}/api/company`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({...formState, addMe: !dontAddMe}),
                }
            );

            if (!response.ok) {
                throw new Error("Échec de la soumission");
            }

            const result = await response.json();
            setCompany(result);
            console.log("Données soumises avec succès :", result);
        } catch (err) {
            console.error("Erreur lors de l'envoi des données :", err);
        }
    }

    return <> 
        <form className="p-5 d-flex flex-column align-items-center"
            onSubmit={handleSubmit}>
            <div className="mb-1 col-8 form-floating">
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={formState.name}
                    onChange={handleFormUpdate}
                    placeholder=""
                />
                <label htmlFor="name">Company Name:</label>
            </div>

            <div className="mb-1 col-8 form-floating">
                <input
                    type="text"
                    className="form-control"
                    id="siretNumber"
                    value={formState.siretNumber}
                    onChange={handleFormUpdate}
                    placeholder=""
                />
                <label htmlFor="siretNumber">Your Siret Number:</label>
            </div>
            <div className="mb-1 col-8 form-floating">
                <input
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
            <div className="mb-1 col-8 form-floating">
                <textarea
                    className="form-control"
                    id="description"
                    value={formState.description}
                    onInput={(ev) => {
                        const area = ev.target as HTMLTextAreaElement;
                        area.style.height = 'auto';
                        area.style.height = `${area.scrollHeight + 10}px`;
                    }}
                    onChange={handleFormUpdate}
                />
                <label htmlFor="description">Description:</label>
            </div>

            <div className="mt-2 col-3">
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </div>
        </form>;
    </>
}