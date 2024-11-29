import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react"
import { domain, port } from "../../../env.json";

interface OfferType {
    offerId: number;
    title: string;
    description: string;
    city: string;
    salary: number;
    hours: number;
    companyId: number;
    
};

export function OfferSecletor({companyId, inputRef, setState}: {companyId: number, setState: Dispatch<SetStateAction<string>>, inputRef: RefObject<HTMLInputElement>}) {
    const [offers, setOffers] = useState<OfferType[]>([]);
    const [value, setValue] = useState("");

    const datalistRef = useRef<HTMLDataListElement>(null);

    useEffect(() => {
        fetch(`http://${domain}:${port}/api/offer/list?companyId=${companyId}`)
        .then(response => {
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            return response.json();
        })
        .then(setOffers)
        .catch(console.error);
    }, [companyId]);


    return <div className="form-floating">
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
        <label htmlFor="exampleDataList" className="form-label">Select a Job Offer</label>
        <datalist ref={datalistRef}>
            {
                offers.map(offer => {
                    return <option value={offer.offerId} key={offer.offerId}>{offer.title}</option>
                })
            }
        </datalist>
    </div>
}