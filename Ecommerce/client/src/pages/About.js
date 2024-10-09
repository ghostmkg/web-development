import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img src="/images/a.jpg" alt="contactus" style={{ width: "85%" }} />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
            Mind Zombies is guided by four principles : customer obsession
            rather than competitor focus,passion for invnetion,commitment to
            operational excellence,and long term thinking.Mind Zomnies strives
            to be Earth's most customer-centric website.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
