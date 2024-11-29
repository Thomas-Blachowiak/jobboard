import React, { Dispatch, SetStateAction, useContext, useRef, useState } from "react";
import { AuthChecker } from "../helpers/AuthChecker";
import { UserContext, UserContextType } from "../../assets/contexts/userContext";
import validator from "validator";
import { domain, port } from "../../../env.json";
import { ExpandingArea } from "../helpers/ExpandingArea";

interface FormState {
    updateEmail: string;
    updatePhone: string;
    updatePassword: string;
    confirmUpdatePassword: string;
    defaultMessage: string,
    currentPassword: string;
}
export function UserEditor({user, setUser, name, skipPassword, setLoading}: {user: UserContextType, setUser?: Dispatch<SetStateAction<UserContextType>>, name?: string, skipPassword?: boolean, setLoading?: Dispatch<SetStateAction<boolean>>}) {
    if (!user) return;
    const areaRef = useRef<HTMLTextAreaElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    const updateRef = useRef<HTMLInputElement>(null);
    const confirmRef = useRef<HTMLInputElement>(null);
    const [userState, setUserState] = useState(user);
    const [formState, setFormState] = useState<FormState>({
        updateEmail: '',
        updatePhone: '',
        updatePassword: '',
        defaultMessage: '',
        confirmUpdatePassword: '',
        currentPassword: ''
    });
    function handleFormUpdate(ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const newValue = ev.target.value;
        console.log(formState)
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
        if (ev.target.type === 'tel') {
            if (validator.isMobilePhone(newValue, 'fr-FR')) {
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
        if (ev.target.id === 'updatePassword') {
            if (validator.isStrongPassword(newValue, {minSymbols: 0})) {
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
        if (ev.target.id === 'confirmUpdatePassword' || ev.target.id === 'updatePassword') {
            const updateInput = updateRef.current as HTMLInputElement;
            const confirmInput = confirmRef.current as HTMLInputElement;
            if (updateInput.value && updateInput.value === confirmInput.value) {
                confirmInput.classList.remove('is-invalid');
                confirmInput.classList.add('is-valid');
            }
            else if (updateInput.value) {
                confirmInput.classList.add('is-invalid');
                confirmInput.classList.remove('is-valid');
            }
            else {
                confirmInput.classList.remove('is-invalid');
                confirmInput.classList.remove('is-valid');
            }
        }
        if (ev.target.id === "currentPassword") {
            ev.target.classList.remove('is-invalid');
        }
        setFormState(prevState => {
            
            return {
                ...prevState,
                [ev.target.id]: newValue
            }
        });
    };
    
    return <AuthChecker>
        <div className="col-md-4">
            <div className="position-sticky">
                <div className="p-4 mb-3 bg-body-tertiary rounded">
                    {name? <h4 className="fst-italic">{name}</h4>: undefined}
                    <form 
                        onSubmit={(ev) => {
                            ev.preventDefault();
                            /** @TODO Give the user some feedback on errors */
                            if (!skipPassword && !formState.currentPassword) 
                                return;
                            // if (!formState.updateEmail &&
                            //     !formState.updatePhone &&
                            //     !formState.updatePassword)
                            //         return;
                            
                            if (formState.updatePassword && 
                                (
                                    !formState.confirmUpdatePassword || 
                                    (formState.confirmUpdatePassword !== formState.updatePassword)
                                ))
                                    return;
                            if (formState.updatePassword && !validator.isStrongPassword(formState.updatePassword, { minSymbols: 0 }))
                                return;

                            if (formState.updatePhone && !validator.isMobilePhone(formState.updatePhone, 'fr-FR')) return;
                            
                            if (formState.updateEmail && !validator.isEmail(formState.updateEmail)) return;
                            
                            fetch(`http://${domain}:${port}/api/user`, {
                                method: 'PATCH',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    userId: userState.userId,
                                    password: skipPassword ? undefined : formState.currentPassword,
                                    email: formState.updateEmail ? formState.updateEmail : undefined,
                                    phone: formState.updatePhone ? formState.updatePhone : undefined,
                                    newPassword: formState.updatePassword ? formState.updatePassword : undefined,
                                    message: formState.defaultMessage 
                                })
                            })
                            .then(response => {
                                if (response.status === 403) passRef.current?.classList.add('is-invalid');
                                if (response.ok) return response.json();
                                throw new Error(`${response.status}`);
                            })
                            .then(data => {
                                setUserState(data);
                                if (setUser) setUser(data);
                            })
                            .catch(console.error)
                        }}>
                        <div className="row">
                            <div className="gx-4">
                                <div className="row">
                                    <fieldset className="form-floating gx-2 gy-2" disabled>
                                        <input type="text" id="nameDisplay" className="form-control" placeholder={`${userState.firstName} ${userState.lastName}`}/>
                                        <label htmlFor="nameDisplay" className="form-label">Name - {`${userState.firstName} ${userState.lastName}`}</label>
                                    </fieldset>
                                </div>
                                <div className="row">
                                    <div className="form-floating gx-2 gy-2">
                                        <input type="email" onChange={handleFormUpdate} id="updateEmail" className="form-control" placeholder={userState.email} />
                                        <label htmlFor="updateEmail" className="form-label">Email - {userState.email}</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-floating gx-2 gy-2">
                                        <input type="tel" onChange={handleFormUpdate} id="updatePhone" className="form-control" placeholder={`${userState.phone}`}/>
                                        <label htmlFor="updatePhone" className="form-label">Phone Number - {`${userState.phone}`}</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <ExpandingArea defaultValue={user.message} areaId="defaultMessage" areaRef={areaRef} onChange={handleFormUpdate}/>
                                </div>
                            </div>
                            
                        </div>
                        <div className="row">
                            <div className="gx-4 gy-4">
                                <div className="row">
                                    <div className="form-floating gx-2 gy-2">
                                        <input ref={updateRef} type="password" onChange={handleFormUpdate} id="updatePassword" className="form-control" placeholder="Change password"/>
                                        <label htmlFor="updatePassword" className="form-label">Change password</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-floating gx-2 gy-2">
                                        <input ref={confirmRef} type="password" onChange={handleFormUpdate} id="confirmUpdatePassword" className="form-control" placeholder="Confirm Password"/>
                                        <label htmlFor="confirmUpdatePassword" className="form-label">Confirm Password</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="gx-4 gy-4">
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
                                        <input type="submit" value={"Update Information"} className="btn btn-primary w-100" />
                                        <button 
                                            className="btn btn-danger w-100"
                                            onClick={ev => {
                                                ev.preventDefault();
                                                if (!confirm("Are you sure ? Doing so is definitive.")) return;
                                                if (!confirm("Are you realy, realy sure ?")) return;
                                                fetch(`http://${domain}:${port}/api/user`, {
                                                    method: 'DELETE',
                                                    credentials: "include",
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify({
                                                        userId: userState.userId,
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
                                                    if (setUser) setUser(null);
                                                })
                                                .catch(console.error)
                                            }}>
                                                Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </AuthChecker>
}