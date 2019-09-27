import React from "react";

import Layout from "../components/layout";
import Image from "../components/image";
import SEO from "../components/seo";
import demo_img from "../images/demo_dark.jpg";

const IndexPage = () => (
  <Layout>
    <SEO title="Ten Hands" />
    <p className="text-center py-2">One place to run your command-line tasks</p>
    <div className="links text-center">
      <a
        className="download"
        href="https://github.com/saisandeepvaddi/ten-hands/releases"
      >
        Download
      </a>
      <span className="px-2"></span>
      <a className="github" href="https://github.com/saisandeepvaddi/ten-hands">
        Github
      </a>
    </div>
    <div className="py-2"></div>
    <div className="d-flex justify-center">
      <img
        src={demo_img}
        width="100%"
        height="auto"
        alt="Ten Hands demo image"
      />
    </div>
    {/* <Image /> */}
    <div className="py-2"></div>
  </Layout>
);

export default IndexPage;
