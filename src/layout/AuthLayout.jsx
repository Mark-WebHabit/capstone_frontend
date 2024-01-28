import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { clearLoadingErrorState } from "../features/authServices";

const AuthLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user && user.token && user.email) {
      navigate("/");
    }
  }, [user]);

  const handleNavigateHome = () => {
    navigate("/");
    dispatch(clearLoadingErrorState());
  };

  return (
    <Container>
      <Wrapper>
        <Logo onClick={handleNavigateHome}>
          <ImageLogo src="/images/angel.svg" alt="Logo" />
          <Text>Holy Angels</Text>
          <Text>Memorial Park</Text>
        </Logo>
        <Outlet />
      </Wrapper>
    </Container>
  );
};

const Container = styled.main`
  height: 100vh;
  width: 100vw;
  display: grid;
  place-items: center;
`;

const Wrapper = styled.div`
  height: 80%;
  width: 65%;
  border-radius: 3.75em;
  background-color: var(--blue);
  display: grid;
  grid-template-columns: 45% 1fr;
  overflow: hidden;

  @media (max-width: 1150px) {
    width: 90%;
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: 30% 1fr;
    width: 80%;
  }
  @media (max-width: 500px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
    grid-template-rows: 25% 1fr;
  }
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ImageLogo = styled.img`
  width: 50%;
  margin-bottom: 1em;
  @media (max-width: 900px) {
    width: 30%;
  }
`;

const Text = styled.p`
  font-size: 3.165rem;
  font-family: "Montagu Slab", serif;
  color: var(--yellow);
  @media (max-width: 1205px) {
    font-size: 3rem;
  }
  @media (max-width: 900px) {
    font-size: 2rem;
  }
`;

export default AuthLayout;
