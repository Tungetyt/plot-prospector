'use client'

import {signIn, signOut} from "next-auth/react";

export const GoogleAuth = () => {
    return (
        <>
            <button onClick={() => signIn("google")}>signIn</button>
            <div></div>
            <button onClick={() => signOut()}>signOut</button>
        </>
    );
};
