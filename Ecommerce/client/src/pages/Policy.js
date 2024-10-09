import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img src="/images/2a.jpg" alt="contactus" style={{ width: "100%" }} />
        </div>
        <div className="col-md-4">
          <p>
            We are committed to safeguarding your privacy. This privacy policy
            outlines the types of information we collect when you visit our
            website {"Ecommerce "} and how we use, protect, and disclose that
            information. The data we may collect includes personally
            identifiable information such as name, email address, and phone
            number, as well as non-personal information about your internet
            connection and device. We collect this information directly from you
            and automatically as you navigate our website. Our purposes for
            collecting this data include improving user experience, providing
            requested information and services, fulfilling contractual
            obligations, and notifying you of changes to our website or
            services. We may share your information with subsidiaries,
            affiliates, service providers, and other third parties as necessary.
            You have choices regarding the information you provide, and we have
            implemented security measures to protect your data. This policy may
            be updated periodically.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
