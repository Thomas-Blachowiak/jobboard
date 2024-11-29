import { MutableRefObject, useEffect, useState } from "react"
import { domain, port } from "../../../env.json";

interface ApplicationType {
    applicationId: string;
    userId: string;
    offerId: string;
    message: string;
    email: string;
    admin: string;    
    companyId: string;   
    user: {
        userId: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        admin: string;    
        companyId: string;    
    }; 
    offer: {
        offerId: number;
        title: string;
        description: string;
        city: string;
        salary: number;
        hours: number;
        companyId: number;
    };
};

export function ApplicationSecletor({offerId, userId, inputRef}: {offerId?: string, userId?: string, inputRef: MutableRefObject<HTMLInputElement | null>}) {
    const [applications, setApplications] = useState<ApplicationType[]>([]);
    const [value, setValue] = useState("");

    useEffect(() => {
        fetch(`http://${domain}:${port}/api/user/list?${offerId ? `offerId=${offerId}` : ''}${offerId && userId ? '&': ''}${userId ? `userId=${userId}`: ''}`)
        .then(response => {
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            return response.json();
        })
        .then(setApplications)
        .catch(console.error);
    }, []);


    return <div className="form-floating">
        <input 
            onChange={(e) => {
                const newValue = e.target.value;
                if (/^\d*$/.test(newValue)) {
                  setValue(newValue);
                }
            }}
            ref={inputRef}
            type="text" 
            className="form-control" 
            list="datalistOptions"
            value={value}
            placeholder="Type to search..."/>
        <label htmlFor="exampleDataList" className="form-label">Select an User</label>
        <datalist id="datalistOptions">
            {
                applications.map(application => {
                    let text = '';
                    if (offerId) text = `${application.user.firstName} ${application.user.lastName}`;
                    else if (userId) text = application.offer.title;
                    return <option value={application.applicationId} key={application.applicationId}>{text}</option>
                })
            }
        </datalist>
    </div>
}