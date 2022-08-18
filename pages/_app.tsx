import '../styles/globals.css';
import type {AppProps} from 'next/app';
import React, {useEffect} from 'react';
import {ThemeProvider} from 'next-themes';
import splitbee from "@splitbee/web";

function MyApp({Component, pageProps}: AppProps) {
    useEffect((): void => {
        splitbee.init({
            apiUrl: '/sb-api',
            scriptUrl: '/sb.js'
        });
    }, []);

    return (
        <ThemeProvider attribute="class">
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;
