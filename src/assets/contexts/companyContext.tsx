import { createContext, Dispatch, SetStateAction } from "react";

export type CompanyContextType = {
    companyId: string;
    name: string;
    description: string;
    email: string;
    siretNumber: string;
} | null;

export const CompanyContext = createContext<
    [CompanyContextType, Dispatch<SetStateAction<CompanyContextType>>] | null
>(null);
