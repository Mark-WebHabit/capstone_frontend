import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Welcome = () => {
  const location = useLocation();

  let desc;
  if (location.pathname == "/auth") {
    desc = "Log in your account";
  } else if (location.pathname == "/auth/register") {
    desc = "Create an account";
  } else if (location.pathname.startsWith("/auth/renew_pass")) {
    desc = "Change Password";
  }
  return (
    <Container>
      <p>Welcome!</p>
      <span>{desc}</span>
    </Container>
  );
};

const Container = styled.div`
  height: 28%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0 4em;

  & p {
    font-size: 3.125rem;
    font-family: "Roboto", serif;
    font-weight: 700;
    color: var(--blue);
  }

  & span {
    font-size: 1.625rem;
    font-family: "Roboto", serif;
    color: var(--grayfont);
    font-weight: 500;
  }

  @media (max-width: 900px) {
    & p {
      font-size: 2.5rem;
    }

    & span {
      1.2rem
    }
  }

  @media (max-width: 500px) {
    height: 20%;
  }
`;

export default Welcome;
