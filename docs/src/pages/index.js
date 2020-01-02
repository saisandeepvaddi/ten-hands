import React from "react";

import Layout from "../components/layout";
// import Image from "../components/image";
import SEO from "../components/seo";
import DownloadButton from "../components/download-button";
import Video from "../components/video";
import demoVideo from "../assets/Ten Hands Demo.mp4";
import demoImage from "../images/demo_dark.jpg";

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
    {/* <Image /> */}
    <div className="d-flex justify-center align-center">
      <Video video={demoVideo} poster={demoImage} />
    </div>
    <div className="py-2"></div>
  </Layout>
);

export default IndexPage;
