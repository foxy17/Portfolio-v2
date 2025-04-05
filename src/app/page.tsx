import React from 'react';

import NavContainer from '~/components/Layout/NavContainer';
import Banner from '~/components/Banner';
import FeaturedPosts from '~/components/FeaturedPosts';
import SocialsLine from "~/components/SocialLine/SocialLine";
import {Metadata} from "next";
import siteMetaDeta from "~/data/seo";

export const metadata: Metadata = siteMetaDeta;

function Home() {
    return (
        <NavContainer>
            <Banner />
            <FeaturedPosts />
            <SocialsLine />
        </NavContainer>
    );
}

export default Home;
