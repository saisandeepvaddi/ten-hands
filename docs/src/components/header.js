import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import logo from "../images/logo.png";

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `#394B59`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1rem`,
      }}
      className="d-flex align-center"
    >
      <div style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          <div className="d-flex align-center">
            <img src={logo} width="50" height="auto" alt="Ten Hands Logo" />
            <span
              className="px-1"
              style={{ fontSize: "1.2rem", fontWeight: 600 }}
            >
              {siteTitle}
            </span>
          </div>
        </Link>
      </div>
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
