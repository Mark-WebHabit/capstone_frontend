import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { clearLoadingErrorState } from "../features/authServices";
const AuthFormFooter = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  let link;
  let text;
  let buttonText;
  if (location.pathname == "/auth") {
    link = "/auth/register";
    text = "Don't have an account?";
    buttonText = "SIGN UP";
  } else if (location.pathname == "/auth/register") {
    link = "/auth";
    text = "Already have an account?";
    buttonText = "SIGN IN";
  } else if (location.pathname.startsWith("/auth/renew_pass")) {
    link = "/auth";
    text = "I remember my password";
    buttonText = "Cancel";
  }

  return (
    <Container>
      <p>{text}</p>
      <Link to={link} onClick={() => dispatch(clearLoadingErrorState())}>
        <span>{buttonText}</span>
      </Link>
    </Container>
  );
};

const Container = styled.div`
  height: 22%;
  display: flex;
  flex-direction: column;
  align-items: center;

  & p {
    color: var(--grayfont);
    font-family: "Roboto";
    font-weight: 500;
    font-size: 1.3rem;
  }

  & span {
    display: block;
    margin: 1em 0;
    font-family: "Roboto";
    font-size: 1.3rem;
    font-weight: 500;
    color: var(--blue);
    border: 1px solid black;
    padding: 0.7em 3em;
    border-radius: 3em;
    transition: all 150ms;

    &:hover {
      color: #ffffff;
      background: var(--blue);
    }
  }

  @media (max-width: 500px) {
    height: 30%;
  }
`;

export default AuthFormFooter;
