import { useEffect, useState } from "react";
import { ApplicaitonType, ApplicationEditor } from "../components/forms/ApplicationEditor";
import { domain, port } from "../../env.json";
import { SuperAuthChecker } from "./SuperAuthChecker";

export function ApplicationsList() {

    const [loading, setLoading] = useState<boolean>(true);
    const [applications, setApplications] = useState<ApplicaitonType[]>([]);
    const [hidden, setHidden] = useState<boolean>(false);

    useEffect(() => {
        if (!loading) return;
        fetch(`http://${domain}:${port}/api/application/list`, {
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) return response.json();
            throw new Error(`${response.status}`);
        })
        .then(setApplications)
        setLoading(false);
    }, [loading]);

    function onHide() {
        setHidden(prev => !prev);
    }


    return <SuperAuthChecker>
        <div className="d-flex align-items-center mb-3 border-bottom">
            <h1 className="m-3">All Applications</h1>
            <button className="m3 btn btn-secondary" onClick={onHide}>
                {hidden ? "Reveal v" : "Hide ^"}
            </button>
            <button className="m3 btn btn-warning" onClick={() => {
                setLoading(true);
            }}>Reload</button>
        </div>
        {hidden
            ? undefined
            : <div className="row">
                {applications.map(application => <ApplicationEditor displayUser={true} key={application.applicationId} application={application} setLoading={setLoading}/>)}
            </div>
        }
    </SuperAuthChecker>;
}