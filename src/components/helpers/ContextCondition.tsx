

import { Context, ContextType, Dispatch, ReactNode, SetStateAction, useContext } from "react";

type AuthConditionProps = {
    true: ReactNode,
    false: ReactNode,
    context: Context<any>,
    children?: never
}

export function ContextCondition(props: AuthConditionProps) {
        const contextBundle = useContext(props.context);
        /** @TODO Error handling when context isnt setup */ 
        if (!contextBundle) return;
    
        const [contextData] = contextBundle;
        
        if (contextData) return props.true;
        return props.false;
}