import { SignupForm } from "../../components/forms/SignupForm";
import { SuperNavBar } from "../../superAdmin/SuperNavBar";
import { UserList } from "../../superAdmin/UserList";

export function Users() {
    return <>
        <SuperNavBar/>
        <UserList/>
        <div className="row border-bottom overflow-hidden">
            <h1 className="m-3">Create User</h1>
        </div>
        <SignupForm skipRedirection={true}/>
    </>
}