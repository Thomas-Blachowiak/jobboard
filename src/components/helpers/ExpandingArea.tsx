import { useEffect } from "react";

interface props {
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    areaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
    areaId?: string
    defaultValue: string
}

export function ExpandingArea({onChange, areaRef, defaultValue, areaId}: props) {
    
    useEffect(() => {
        if (!areaRef) return;
        if (areaRef.current) {
            areaRef.current.style.height = 'auto';
            areaRef.current.style.height = `${areaRef.current.scrollHeight + 10}px`;
        }
    }, [areaRef]);
    return <textarea className="form-control" placeholder=""
        onChange={onChange}
        ref={areaRef}
        id={areaId}
        defaultValue={defaultValue}
        onInput={(ev) => {
            const area = ev.target as HTMLTextAreaElement;
            area.style.height = 'auto';
            area.style.height = `${area.scrollHeight + 10}px`;
        }}
    />
}