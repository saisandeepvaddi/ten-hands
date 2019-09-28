import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import logo from "../images/logo.png";
import { AnchorButton } from "@blueprintjs/core";
import { DiGithubBadge } from "react-icons/di";

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
      className="d-flex align-center justify-between"
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
      <AnchorButton
        large
        minimal
        target="_blank"
        icon={<DiGithubBadge size="1.5em" />}
        href="https://github.com/saisandeepvaddi/ten-hands"
      >
        Github
      </AnchorButton>
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
