import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SessionProvider( {children, storageKey, redirectPath}) {
    const router = useRouter();
    useEffect(() => {
        const sessionKey = localStorage.getItem(storageKey);
        if (!sessionKey) {
            router.push(redirectPath);
        }
    }, [router, storageKey, redirectPath]);

    return <>{children}</>
}