import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";

import { Toaster } from "react-hot-toast";

const Layout = ({ children, title, description, Keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta Charset="utf-8" />
        <meta name="description" content={description} />
        <meta name="Keywords" content={Keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "82vh" }}>
        <Toaster />
        {children}
      </main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Kit Kart - Shop now",
  description: "Mind Zombies Project",
  keywords: "mern,react,node,mongodb",
  author: "Mind Zombies",
};

export default Layout;
