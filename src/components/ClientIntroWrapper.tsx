"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

const IntroAnimation = dynamic(() => import("@/components/IntroAnimation"), { ssr: false });

export default function ClientIntroWrapper() {
    // Only show intro once per session
    const [show, setShow] = useState(() => {
        if (typeof window === "undefined") return true;
        return !sessionStorage.getItem("pnt_intro_seen");
    });

    const handleComplete = useCallback(() => {
        sessionStorage.setItem("pnt_intro_seen", "1");
        setShow(false);
    }, []);

    if (!show) return null;
    return <IntroAnimation onComplete={handleComplete} />;
}
