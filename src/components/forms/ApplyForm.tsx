import { useState, useRef, Dispatch, SetStateAction, useContext } from "react";
import { port, domain } from "../../../env.json";
import { ExpandingArea } from "../helpers/ExpandingArea";
import { UserContext } from "../../assets/contexts/userContext";

interface FormState {
    message: string;
}

export function ApplyForm({
    message,
    userId,
    offerId,
    setLoading
}: {
    message: string;
    userId: string;
    offerId: string;
    setLoading?: Dispatch<SetStateAction<boolean>>;
}) {
    const [formState, setFormState] = useState<FormState>({
        message: message || "",
    });
    const messageRef = useRef<HTMLTextAreaElement>(null);

    function handleFormUpdate(ev: React.ChangeEvent<HTMLTextAreaElement>) {
        const { id, value } = ev.target;
        if (value.length > 0) {
            ev.target.classList.remove("is-invalid");
        }

        setFormState((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

    const userContext = useContext(UserContext);
    if (!userContext) return;

    return (
        <div>
            <h3 className="text-center">Apply Here !</h3>
            <form
                className="p-5 d-flex flex-column align-items-center"
                method="POST"
                onSubmit={(ev) => {
                    ev.preventDefault();

                    let valid = true;
                    // Validation pour le message
                    if (!formState.message) {
                        messageRef.current?.classList.add("is-invalid");
                        valid = false;
                    } else if (formState.message.length < 10) {
                        alert("Message must be at least 10 characters long");
                        valid = false;
                    }

                    if (!valid) return;
                    fetch(`http://${domain}:${port}/api/application`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            message: formState.message,
                            offerId,
                            userId
                        }),
                    })
                        .then((response) => {
                            if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
                            return response.json();
                        })
                        .then(() => {
                            userContext[1](user => {
                                if (user) user.message = formState.message; 
                                return user;
                            });
                            if (setLoading) setLoading(true);
                        })
                        .catch((err) => {
                            console.error("Submission error:", err);
                            alert(`Failed to submit the form: ${err.message}`);
                        });
                }}>
                <div className="mb-1 col-12 form-floating">
                    <ExpandingArea
                        areaId="message"
                        areaRef={messageRef}
                        onChange={handleFormUpdate}
                        defaultValue={message}/>
                    <label htmlFor="message">Message :</label>
                </div>
                <div className="mt-2 col-12">
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
