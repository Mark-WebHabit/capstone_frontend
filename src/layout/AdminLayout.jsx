import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AdminSideBar from "../components/AdminSideBar";

const AdminLayout = () => {
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= 1200 && window.innerHeight >= 900
  );
  const [screenError, setScreenError] = useState(null);
  const navigate = useNavigate();

  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    if (role) {
      if (role !== "admin") {
        navigate("/");
      }
    }
  }, [role]);

  // make sure the system admin runs on a desktop screen
  useEffect(() => {
    const h = () => {
      setIsDesktop(window.innerWidth >= 1300 && window.innerHeight >= 900);
    };
    h();
    window.addEventListener("resize", h);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setScreenError(
        "Screen size small, make sure you are using a DESKTOP or LAPTOP before operating"
      );
    }
  }, [isDesktop]);

  return (
    <Container>
      {!isDesktop && screenError ? (
        <>
          <div className="error">
            <p>{screenError}</p>
            <button onClick={() => navigate("/")}>OK</button>
          </div>
        </>
      ) : (
        <Wrapper>
          <AdminSideBar />
          <Outlet />
        </Wrapper>
      )}
    </Container>
  );
};

export default AdminLayout;

const Container = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;

  & .error {
    height: auto;
    width: 90%;
    max-width: 500px;
    padding: 3em 1.5em;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #f1f1f1;
    font-family: "Roboto", sans-serif;

    & p {
      font-size: 1.2rem;
      text-align: initial;
      font-weight: 600;
      margin-bottom: 1em;
    }

    & button {
      float: right;
      font-size: 1.2rem;
      padding: 0.4em 1.4em;
      border: none;
      outline: none;
      cursor: pointer;
      background-color: var(--blue);
      color: #ffffff;
      border-radius: 0.3em;
    }
  }
`;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 250px 1fr;
`;
