import { useContext, useEffect, useState} from "react";
import { AuthChecker } from "./helpers/AuthChecker";
import { UserEditor } from "./forms/UserEditor";
import { UserContext } from "../assets/contexts/userContext";
import { domain, port } from "../../env.json"; 
import { ApplicationEditor } from "./forms/ApplicationEditor";

type ApplicaitonType = {
    applicationId: string;
    userId: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    },
    offerId: string;
    offer: {
        title: string;
        company: {
            name: string;
        };
    };
    message: string;
    rejected: boolean;
}

export function InformationProfil() {

    const userContext = useContext(UserContext);
    if (!userContext || !userContext[0]) return;
    const [user, setUser] = userContext;

    const [loading, setLoading] = useState<boolean>(true);
    const [applications, setApplications] = useState<ApplicaitonType[]>([]);

    useEffect(() => {
        if (loading) fetch(`http://${domain}:${port}/api/application/list?userId=${user.userId}`)
            .then(response => {
                if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
                return response.json();
            })
            .then((data) => {
                setApplications(data);
                setLoading(false);
            })
            .catch(console.error);
    }, [loading])
    console.log(applications)
    return (
        <AuthChecker>
            <div className="container mt-5">
                <div className="row g-5">
                    <div className="col-md-8">
                        <div>
                            <h3 className="pb-4 mb-4 fst-italic border-bottom">
                                Hi, {user.firstName} {user.lastName}
                            </h3>
                        </div>
                        <div className="row">
                            {applications.map(application => <ApplicationEditor application={application} key={application.applicationId} setLoading={setLoading}/>)}
                        </div> 
                    </div>
                    <UserEditor user={user} setUser={setUser} name="Edit Profile"/>
                </div>
            </div>
        </AuthChecker>
    );
}
