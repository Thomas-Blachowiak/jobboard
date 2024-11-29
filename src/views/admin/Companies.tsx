import { NewCompanyForm } from "../../components/forms/NewCompanyForm";
import { CompanyList } from "../../superAdmin/CompanyList";
import { SuperNavBar } from "../../superAdmin/SuperNavBar";

export function Companies() {
    return <>
        <SuperNavBar/>
        <CompanyList/>
        <div className="row border-bottom overflow-hidden">
            <h1 className="m-3">Create Company</h1>
        </div>
        <NewCompanyForm dontAddMe={true}/>
    </>
}