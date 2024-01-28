import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Wrapper onClick={() => navigate("/")}>
        <img src="/images/logo.png" alt="Logo" />
        <p>Page not found...</p>
      </Wrapper>
    </Container>
  );
};

export default Page404;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  height: 400px;
  width: 400px;
  background-color: var(--blue);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: scale 150ms;

  &:hover {
    scale: 1.2;
  }

  & img {
    width: 70%;
  }

  & p {
    color: white;
    margin-top: 1em;
    font-size: 2rem;
    font-family: "Roboto", sans-serif;
  }
`;
