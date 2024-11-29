import { useEffect, useRef, useState } from "react";
import { CreateOfferForm } from "../../components/forms/CreateOfferForm";
import { CompanySecletor } from "../../components/selectors/CompanySelector";
import { OfferList } from "../../superAdmin/OfferList";
import { SuperNavBar } from "../../superAdmin/SuperNavBar";

export function Offers() {
    const companyRef = useRef<HTMLInputElement>(null);
    const [companySelect, setCompany] = useState<string>('');

    return <>
        <SuperNavBar/>
        <OfferList/>
        <div className="row border-bottom overflow-hidden">
            <h1 className="m-3">Create a Job Offer</h1>
        </div>
        <div className="d-flex flex-column align-items-center row">
            <div className="col-8">
                <CompanySecletor inputRef={companyRef} setState={setCompany}/>
            </div>
        </div>
        <CreateOfferForm companyId={companySelect} skipRedirection={true}/>
    </>
}