import React from "react";
import styled from "styled-components";

const Footer = () => {
  const date = new Date();
  let year = date.getFullYear();
  return (
    <Container className="footer">
      <p>© {year} All rights reserved.</p>
      <p>Holy Angels Memorial Park</p>
    </Container>
  );
};

export default Footer;

const Container = styled.footer`
  background-color: var(--darkblue);
  padding: 2em 0;
  display: flex;
  justify-content: center;
  align-items: center;

  & p:first-child {
    color: #ffffff;
  }

  & p:last-child {
    color: var(--yellow);
    margin-left: 0.5em;
  }

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;
