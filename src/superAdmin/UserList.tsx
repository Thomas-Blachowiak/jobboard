import { useEffect, useState } from "react";
import { UserContextType } from "../assets/contexts/userContext";
import { domain, port } from "../../env.json";
import { SuperAuthChecker } from "./SuperAuthChecker";
import { UserEditor } from "../components/forms/UserEditor";

export function UserList() {
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<UserContextType[]>([]);
    const [hidden, setHidden] = useState<boolean>(false);

    useEffect(() => {
        if (!loading) return;
        fetch(`http://${domain}:${port}/api/user/list`, {
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) return response.json();
            throw new Error(`${response.status}`);
        })
        .then(setUsers)
        setLoading(false);
    }, [loading]);

    function onHide() {
        setHidden(prev => !prev);
    }

    return <SuperAuthChecker>
        <div className="d-flex align-items-center mb-3 border-bottom">
            <h1 className="m-3">All Users</h1>
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
                {users.map(user => <UserEditor key={user?.userId} user={user} skipPassword={true} setLoading={setLoading}/>)}
            </div>
        }
        
    </SuperAuthChecker>
}