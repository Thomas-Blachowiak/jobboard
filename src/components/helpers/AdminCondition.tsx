import { ReactNode, useContext } from "react";
import { UserContext } from "../../assets/contexts/userContext";

type AuthConditionProps = {
    true: ReactNode,
    false: ReactNode
}

export function AdminCondition(props: AuthConditionProps) {
        // get the user context
        const userContext = useContext(UserContext);
        /** @TODO Error handling when context isnt setup */ 
        if (!userContext) return;
    
        const [user] = userContext;
        
        if (user?.admin) return props.true;
        return props.false;
}