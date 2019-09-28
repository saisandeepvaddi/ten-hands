import React from "react";

import Layout from "../components/layout";
import Image from "../components/image";
import SEO from "../components/seo";
import demo_img from "../images/demo_dark.jpg";
import { AnchorButton } from "@blueprintjs/core";
import DownloadButton from "../components/download-button";

const IndexPage = () => (
  <Layout>
    <SEO title="Ten Hands" />
    <div className="py-2"></div>
    <h1 className="text-center">One place to run your command-line tasks</h1>
    <div className="py-2"></div>
    <div className="text-center">
      <DownloadButton />
    </div>
    <div className="py-2"></div>
    <div className="d-flex justify-center">
      <img
        src={demo_img}
        style={{ maxWidth: "100%" }}
        alt="Ten Hands demo image"
      />
    </div>
    {/* <Image /> */}
    <div className="py-2"></div>
  </Layout>
);

export default IndexPage;
