import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CompanyContextType } from "../../assets/contexts/companyContext";
import { validator } from "sequelize/lib/utils/validator-extras";
import { domain, port } from "../../../env.json";
import { ExpandingArea } from "../helpers/ExpandingArea";

interface FormState {
    updateName: string;
    updateDescription: string;
    updateEmail: string;
    currentPassword: string;
}

export function CompanyEditor({company, setCompany, title, skipPassword, setLoading}: {company: CompanyContextType, setCompany?: Dispatch<SetStateAction<CompanyContextType>>, title?: string, skipPassword?: boolean, setLoading?: Dispatch<SetStateAction<boolean>>}) {
    if (!company) return;
    const passRef = useRef<HTMLInputElement>(null);
    const [companyState, setCompanyState] = useState(company);
    const [formState, setFormState] = useState<FormState>({
        updateName: '',
        updateDescription: company.description,
        updateEmail: '',
        currentPassword: ''
    });

    const areaRef = useRef<HTMLTextAreaElement | null>(null);

    function handleFormUpdate(ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const newValue = ev.target.value;
        if (ev.target.type === 'email') {
            if (validator.isEmail(newValue)) {
                ev.target.classList.remove('is-invalid');
                ev.target.classList.add('is-valid');
            } else if (newValue === '') {
                ev.target.classList.remove('is-invalid');
                ev.target.classList.remove('is-valid');
            } else {
                ev.target.classList.add('is-invalid');
                ev.target.classList.remove('is-valid');
            }
        }
        if (ev.target.id === "currentPassword") {
            ev.target.classList.remove('is-invalid');
        }
        setFormState(prevState => {
            return {
                ...prevState,
                [ev.target.id]: newValue
            };
        });
    }

    return <div className="col-md-4">
        <div className="position-sticky">
            <div className="p-4 mb-3 bg-body-tertiary rounded">
                {title? <h4 className="fst-italic">{title}</h4>: undefined}
                <form onSubmit={ev => {
                    ev.preventDefault();
                    if (!skipPassword && !formState.currentPassword) 
                        return;
                    if (formState.updateDescription === company.description &&
                        !formState.updateEmail &&
                        !formState.updateName)
                            return;
                    if (formState.updateEmail && !validator.isEmail(formState.updateEmail)) 
                        return;
                    
                    fetch(`http://${domain}:${port}/api/company`, {
                        method: 'PATCH',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            companyId: company.companyId,
                            password: skipPassword ? undefined : formState.currentPassword,
                            email: formState.updateEmail ? formState.updateEmail : undefined,
                            name: formState.updateName ? formState.updateName : undefined,
                            description: formState.updateDescription ? formState.updateDescription : undefined 
                        })
                    })
                    .then(response => {
                        if (response.status === 403) passRef.current?.classList.add('is-invalid');
                        if (response.ok) return response.json();
                        throw new Error(`${response.status}`);
                    })
                    .then(data => {
                        setCompanyState(data);
                        if (setCompany) setCompany(data);
                    })
                    .catch(console.error)
                }}>
                    <div className="gx-4">
                        <div className="row">
                            <fieldset className="form-floating gx-2 gy-2" disabled>
                                <input type="text" className="form-control" id="siret" placeholder=""/>
                                <label htmlFor="siret" className="form-label">Siret - {company.siretNumber}</label>
                            </fieldset>
                        </div>
                        <div className="row">
                            <div className="form-floating gx-2 gy-2">
                                <input type="text" onChange={handleFormUpdate} className="form-control" id="updateName" placeholder=""/>
                                <label htmlFor="updateName" className="form-label">Name - {company.name}</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-floating gx-2 gy-2">
                                <input type="email" onChange={handleFormUpdate} className="form-control" id="updateEmail" placeholder=""/>
                                <label htmlFor="updateEmail" className="form-label">Email - {company.email}</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-floating gx-2 gy-2">
                                
                                <ExpandingArea areaId="updateDescription" areaRef={areaRef} onChange={handleFormUpdate} defaultValue={company.description}/>
                                <label htmlFor="updateDescription">Description</label>
                            </div>
                        </div>
                        {!skipPassword
                            ? <div className="row">
                                <div className="form-floating gx-2 gy-2">
                                    <input ref={passRef} type="password" onChange={handleFormUpdate} id="currentPassword" className="form-control" placeholder="Current Password" />
                                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                                </div>
                            </div>
                            : undefined
                        }
                        <div className="row">
                            <div className="gx-2 gy-2">
                                <input type="submit" value="Update Information" className="btn btn-primary w-100" />
                                <button className="btn btn-danger w-100"
                                onClick={ev => {
                                    ev.preventDefault();
                                                if (!confirm("Are you sure ? Doing so is definitive.")) return;
                                                if (!confirm("Are you realy, realy sure ?")) return;
                                                fetch(`http://${domain}:${port}/api/company`, {
                                                    method: 'DELETE',
                                                    credentials: "include",
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify({
                                                        companyId: companyState.companyId,
                                                        password: skipPassword ? undefined : formState.currentPassword
                                                    })
                                                })
                                                .then(response => {
                                                    if (response.ok) return response.json();
                                                    if (!skipPassword) passRef.current?.classList.add('is-invalid');
                                                    throw new Error(`${response.status}`);
                                                })
                                                .then(() => {
                                                    if (setLoading) setLoading(true);
                                                    if (setCompany) setCompany(null);
                                                })
                                                .catch(console.error)
                                }}>
                                    Delete Company
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
}