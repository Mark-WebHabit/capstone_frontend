import React, { useEffect } from "react";
import styled from "styled-components";

const NoSelectedMap = () => {
  return (
    <Container>
      <img src="/images/wholemap.png" alt="Whole Map View" />
    </Container>
  );
};

export default NoSelectedMap;

const Container = styled.div`
  height: 100%;
  background-color: #ffffff;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  overflow: hidden;

  & img {
    width: 100%;
    height: 100%;
  }
`;
