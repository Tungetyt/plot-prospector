'use client'

import {signIn} from "next-auth/react";

export const GoogleAuth = () => {
    return (
        <>
            <button onClick={() => signIn("google")}>signIn</button>
        </>
    );
};
