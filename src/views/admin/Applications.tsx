import { useEffect, useRef, useState } from "react";
import { CompanySecletor } from "../../components/selectors/CompanySelector";
import { UserSecletor } from "../../components/selectors/UserSelector";
import { ApplicationsList } from "../../superAdmin/ApplicationsList";
import { SuperNavBar } from "../../superAdmin/SuperNavBar";
import { OfferSecletor } from "../../components/selectors/OfferSelector";
import { ApplyForm } from "../../components/forms/ApplyForm";
import { domain, port } from "../../../env.json";
export function Applications() {
    const userRef = useRef<HTMLInputElement>(null);
    const companyRef = useRef<HTMLInputElement>(null);
    const offerRef = useRef<HTMLInputElement>(null);

    const [userId, setUserId] = useState<string>('');
    const [userMessage, setUserMessage] = useState<string>('');
    const [companyId, setCompanyId] = useState<string>('');
    const [offerId, setOfferId] = useState<string>('');
    
    useEffect(() => {
        setOfferId('');
    }, [companyId]);

    useEffect(() => {
        async function fetchUser() {
            setUserMessage('');
            if (userId) fetch(`http://${domain}:${port}/api/user?userId=${userId}`)
                .then(response => {
                    if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
                    return response.json();
                })
                .then(data => {
                    setUserMessage(data.message);
                })
                .catch(console.error);
        }

        fetchUser();

    }, [userId]);

    useEffect(() => {console.log([userId, offerId])}, [userId, offerId])

    return <>
        <SuperNavBar/>
        <ApplicationsList/>
        <div className="row border-bottom overflow-hidden">
            <h1 className="m-3">Create Company</h1>
        </div>
        <div className="row">
            <div className="col-6">
                <UserSecletor 
                    setState={setUserId}
                    inputRef={userRef}/>
            </div>
            <div className="col-6 row">
                <div className="col-6">
                    <CompanySecletor
                        setState={setCompanyId}
                        inputRef={companyRef}/>
                </div>
                <div className="col-6">
                    { companyId ?
                        <OfferSecletor
                            inputRef={offerRef}
                            companyId={+companyId}
                            setState={setOfferId}
                        /> : undefined
                    }
                </div>

            </div>
        </div>
        {
            userId && offerId ?
                <ApplyForm message={userMessage} userId={userId} offerId={offerId}/> :
                undefined
        }
    </>
}