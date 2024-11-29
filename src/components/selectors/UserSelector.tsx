import { Dispatch, RefObject, SetStateAction, useEffect, useState } from "react"
import { domain, port } from "../../../env.json";

interface UserType {
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    admin: string;    
    companyId: string;    
};

export function UserSecletor({inputRef, setState}: {setState?: Dispatch<SetStateAction<string>>,inputRef: RefObject<HTMLInputElement>}) {
    const [users, setUsers] = useState<UserType[]>([]);
    const [value, setValue] = useState("");

    useEffect(() => {
        fetch(`http://${domain}:${port}/api/user/list`)
        .then(response => {
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            return response.json();
        })
        .then(setUsers)
        .catch(console.error);
    }, []);


    return <div className="form-floating">
        <input 
            onChange={(e) => {
                const newValue = e.target.value;
                if (/^\d*$/.test(newValue)) {
                    setValue(newValue);
                    if (setState) setState(newValue);
                }
            }}
            ref={inputRef}
            type="text" 
            className="form-control" 
            list="datalistOptions"
            value={value}
            placeholder="Type to search..."/>
        <label htmlFor="datalistOptions" className="form-label">Select an User</label>
        <datalist id="datalistOptions">
            {
                users.map(user => {
                    return <option value={user.userId} key={user.userId}>{user.firstName} {user.lastName}</option>
                })
            }
        </datalist>
    </div>
}