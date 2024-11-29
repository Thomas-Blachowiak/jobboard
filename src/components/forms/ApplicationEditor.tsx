import { Dispatch, SetStateAction, useContext, useRef, useState } from "react";
import { ExpandingArea } from "../helpers/ExpandingArea";
import { domain, port } from "../../../env.json";
import { UserContext } from "../../assets/contexts/userContext";

export type ApplicaitonType = {
    applicationId: string
    offerId:string;
    userId: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    },
    offer: {
        title: string;
        company: {
            name: string;
        };
    };
    message: string;
    rejected: boolean;
}

export function ApplicationEditor({application, setLoading, noSizing, displayUser}: {displayUser?: boolean, noSizing?: boolean, application: ApplicaitonType, setLoading: Dispatch<SetStateAction<boolean>>}) {
    const [message, setMessage] = useState<string>(application.message);
    const areaRef = useRef<HTMLTextAreaElement>(null);
    

    const userContext = useContext(UserContext)
    if (!userContext) return;

    return <div className={`${noSizing ? 'col-12' : 'col-xl-4 col-lg-6 col-sm-12'} border rounded-3 mx-auto ${application.rejected ? 'border-danger' : 'bg-body-tertiary'}`} style={application.rejected ? {'backgroundColor': '#ffe1e1'}: {}}>
        <div className="row">
            {displayUser ? <h4 className={`col-6 my-3 text-center`}>{application.user.firstName} {application.user.lastName}</h4> : undefined}
            <a className={`col-${displayUser ? '6' : '12'} my-3 text-center`} href={`/offer-details/${application.offerId}`}>
                <h4>{application.offer.title}</h4>
            </a>
        </div>
        <h5 className="border-top fst-italic text-center m-2 p-0">@{application.offer.company.name}</h5>
        <p className={`fst-italic text-center m-2 p-2 border-bottom ${application.rejected ? 'border-danger' : ''}`}>{application.rejected ? "Rejected" : "Pending" }</p>
        <form onSubmit={ev => {
            ev.preventDefault();

            fetch(`http://${domain}:${port}/api/application`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    applicationId: application.applicationId,
                    message: message
                })
            })
            .then(response => {
                if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
                return response.json();
            })
            .then(() => {
                userContext[1](user => {
                    if (user) user.message = message; 
                    return user;
                });
            })
            .catch(console.error);
        }}>
            <ExpandingArea onChange={ev => {
                setMessage(ev.target.value);
            }} areaRef={areaRef} defaultValue={application.message}></ExpandingArea>
            <input className="btn btn-primary w-100" type="submit" value="Update"/>
            <button onClick={ev => {
                ev.preventDefault();
                if (!confirm('Are you sure ?')) return;
                fetch(`http://${domain}:${port}/api/application`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({applicationId: application.applicationId})
                })
                .then(() => setLoading(true))
                .catch(console.error);
            }} className="btn btn-danger w-100">Delete</button>
        </form>
    </div>
}