import { Footer } from "../components/Footer";
import Navbar from "../components/Navbar";
import OfferList from "../components/OfferList";

export function JobOffers() {
    return (
        <>
            <Navbar />
            <div className="container-fluid" id="bg-offer">
                <div className="text-center">
                    <div className="container py-5">
                        <h1 className="display-5 fw-bold">Job offer</h1>
                        <p className="col-lg-8 mx-auto lead">
                            Our company is hiring across all sectors! We offer
                            great job opportunities with competitive conditions.
                            Whether you’re looking to kickstart your career or
                            seeking new challenges, we have the perfect role for
                            you. Join us and take the next step in your
                            professional journey!
                        </p>
                    </div>
                </div>
            </div>
            <OfferList />
            <Footer />
        </>
    );
}
