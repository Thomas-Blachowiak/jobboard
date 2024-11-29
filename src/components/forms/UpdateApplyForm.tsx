export function UpdateApplyForm() {
    return (
        <>
            <div>
                <h3 className="mt-3 text-center">Apply to job</h3>
                <form className="p-5 d-flex flex-column align-items-center">
                    <div className="mb-1 col-12 form-floating">
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                        />
                        <label htmlFor="firstName">First name :</label>
                    </div>
                    <div className="mb-1 col-12 form-floating">
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                        />
                        <label htmlFor="lastName">Last name :</label>
                    </div>
                    <div className="mb-1 col-12 form-floating">
                        <textarea className="form-control" id="message" />
                        <label htmlFor="message">Message :</label>
                    </div>
                    <div className="mt-2 col-12">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
