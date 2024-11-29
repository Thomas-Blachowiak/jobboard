import { useParams } from "react-router-dom";
import { CompanyContext } from "../assets/contexts/companyContext";
import { AuthChecker } from "../components/helpers/AuthChecker";
import { ContextChecker } from "../components/helpers/ContextChecker";
import { useEffect, useState } from "react";
import { domain, port } from "../../env.json"
import NavBar from "../components/Navbar";
import { Footer } from "../components/Footer";

type OfferType = {
    offerId: number;
    title: string;
    description: string;
    city: string;
    salary: number;
    hours: number;
    companyId: number;   
    company: { name: string; description: string };
};

type ApplicaitonType = {
    applicationId: string
    user: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    }
    message: string;
}

function formatPhoneNumber(num: string) {
    const arr = num.match(/.{1,2}/g);
    if (!arr) throw new Error('Invalid Number'); 
    return arr.join(' ');
}

export function Applicants() {

    const { offerId } = useParams<{ offerId: string }>(); // Récupérer l'offerId depuis l'URL
    const [offer, setOffer] = useState<OfferType>();
    const [applications, setApplications] = useState<ApplicaitonType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (loading) fetch(`http://${domain}:${port}/api/offer?offerId=${offerId}`)
        .then(response => {
            if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
            return response.json();
        })
        .then(setOffer)
        .catch(console.error);

        fetch(`http://${domain}:${port}/api/application/list?offerId=${offerId}&rejected=false`)
        .then(response => {
            if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
            return response.json();
        })
        .then((data) => {
            setApplications(data);
            setLoading(false);
        })
        .catch(console.error);
    }, [loading]);
    
    console.log(applications);
    return <AuthChecker>
        <ContextChecker context={CompanyContext}>
            <NavBar/>
                <h1 className="border-bottom border-top text-center p-3">{applications.length} Users Applied</h1>

                <div className="row container mx-auto w-90">
                    <div className="col-3 border border-top-0 border-left-0 border-bottom-0 h-100">
                        <h3 className="text-center">{offer?.title}</h3>
                        <p className="text-center">{offer?.city}</p>
                        <p className="text-center">{offer?.hours} Hours</p>
                        <p className="text-center">{offer?.salary} €</p>
                        <p className="text-center">{offer?.description}</p>
                    </div>
                    <div className="col-9">
                        <div className="row">
                            {
                                applications.map(application => { return <div key={application.applicationId} className="col-xl-4 col-lg-6 col-sm-12 bg-body-tertiary border rounded-3 mx-auto">
                                    <h4 className="text-center p-2 border-bottom">{application.user.firstName} {application.user.lastName}</h4>
                                    <div className="d-flex flex-column border-bottom">
                                        <div className="row my-1 g-1">
                                            <p className="col-3 my-auto">Email :</p>
                                            <a className="col-9 btn btn-secondary" href={`mailto:${application.user.email}`} target="_blank">{application.user.email}</a>
                                        </div>
                                        <div className="row my-1 g-1">
                                            <p className="col-3 my-auto">Phone :</p>
                                            <a className="col-9 btn btn-secondary w-75" href={`tel:${application.user.phone}`} target="_blank">{formatPhoneNumber(application.user.phone)}</a>
                                        </div>
                                    </div>
                                    <p className="p-2 border-bottom m-0">{application.message}</p>
                                    <div className="d-flex justify-content-center p-2">
                                        <button className="btn btn-danger justfy w-50"
                                        onClick={ev => {
                                            ev.preventDefault();

                                            fetch(`http://${domain}:${port}/api/application/reject`, {
                                                method: "PATCH",
                                                credentials: "include",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({applicationId: application.applicationId})
                                            })
                                            .then(response => {
                                                if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
                                                return response.json();
                                            })
                                            .then(() => {
                                                setLoading(true);
                                            })
                                            .catch(console.error);
                                        }}
                                        >Dismiss</button>
                                    </div>
                                </div>})
                            }
                        </div>
                    </div>
                </div>
            <Footer/>
        </ContextChecker>
    </AuthChecker>
}