import React from "react";

export type UserContextType = {
    userId: string;
    photo: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    admin: boolean;
    message: string;
} | null;
export const UserContext = React.createContext<
    | [UserContextType, React.Dispatch<React.SetStateAction<UserContextType>>]
    | null
>(null);
