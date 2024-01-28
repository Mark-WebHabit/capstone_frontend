import React from "react";
import styled, { keyframes } from "styled-components";

const LoadingScreen = () => {
  return (
    <Container>
      <div>
        <img src="/images/logo.png" alt="Logo" />
      </div>
      <h2>Loading...</h2>
    </Container>
  );
};

export default LoadingScreen;
const scaleAnimation = keyframes`
  0%{
    scale: 1;
  }
  50%{
    scale: 1.1
  }
  100%{
    scale: 1;
  }
`;
const Container = styled.div`
  height: 100%;
  wdith: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & > div {
    background: #000470;
    width: 200px;
    aspect-ratio: 4/4;
    border-radius: 50%;
    display: grid;
    place-items: center;
    animation: ${scaleAnimation} 5s linear infinite;
    & > img {
      width: 90%;
    }
  }
  & > h2 {
    font-family: "Montagu Slab", sans-serif;
    font-size: 2rem;
    margin-top: 0.3em;
  }
`;
