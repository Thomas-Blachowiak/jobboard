import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react"
import { domain, port } from "../../../env.json";

interface CompanyType {
    companyId: number;
    name: string;
    description: string;
    email: string;
    siretNumber: string;    
};

export function CompanySecletor({inputRef, setState}: {inputRef: RefObject<HTMLInputElement>, setState: Dispatch<SetStateAction<string>>}) {
    const [companies, setCompanies] = useState<CompanyType[]>([]);
    const [value, setValue] = useState("");
    const datalistRef = useRef<HTMLDataListElement>(null);

    useEffect(() => {
        fetch(`http://${domain}:${port}/api/company/list`)
        .then(response => {
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            return response.json();
        })
        .then(setCompanies)
        .catch(console.error);
    }, []);


    return <div className="form-floating col-12">
        <input
            onFocus={() => {
                if (datalistRef.current) {
                    datalistRef.current.id = 'currentList';
                }
            }}
            onBlur={() => {
                if (datalistRef.current) {
                    datalistRef.current.id = '';
                }
            }}
            onChange={(e) => {
                const newValue = e.target.value;
                if (/^\d*$/.test(newValue)) {
                  setValue(newValue);
                  setState(newValue);
                }
            }}
            ref={inputRef}
            type="text" 
            className="form-control" 
            list="currentList"
            value={value}
            placeholder="Type to search..."/>
        <label htmlFor="datalist" className="form-label">Select a Company</label>
        <datalist ref={datalistRef}>
            {
                companies.map(company => {
                    return <option value={company.companyId} key={company.companyId}>{company.name}</option>
                })
            }
        </datalist>
    </div>
}