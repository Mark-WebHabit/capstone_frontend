import React, { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import Header from "../components/Header";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllLawns,
  getAllPlots,
  clearSystemError,
} from "../features/restApiSlice";
import { clearError, getUserRole } from "../features/authServices";
import { clearLoginHistory } from "../features/restApiSlice";

const MainLayout = () => {
  const headerHeight = useSelector((state) => state.nodeHandler.headerRef);
  const userError = useSelector((state) => state.auth.userError);
  const systemError = useSelector((state) => state.restApi.error);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(clearLoginHistory());
  }, []);

  useEffect(() => {
    if (user.email) {
      dispatch(getUserRole(user.email));
    }
  }, [user]);

  useEffect(() => {
    userError && setError(userError || null);
    systemError && setError(systemError || null);
  }, [userError, systemError]);

  const fetchApi = useCallback(
    debounce(async () => {
      if (user.email) {
        try {
          await dispatch(getAllLawns());
          await dispatch(getAllPlots());
        } catch (error) {
          setError(error);
        }
      }
    }, 300), // Adjust the debounce time as needed
    [dispatch, user]
  );

  useEffect(() => {
    fetchApi();
  }, [fetchApi]);

  return (
    <>
      <DarkOpacity $error={error}>
        <div className="darkWrapper">
          <div className="modal">
            <p>{error || ""}</p>
            <span
              className="button"
              onClick={() => {
                dispatch(clearError());
                dispatch(clearSystemError());
                setError(null);
              }}
            >
              OK
            </span>
          </div>
        </div>
      </DarkOpacity>
      <Header />
      <Body $marginTop={headerHeight}>
        <Outlet />
      </Body>
    </>
  );
};

export default MainLayout;

const DarkOpacity = styled.div`
  height: 100vh;
  width: 100vw;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 3;
  display: ${(props) => (props.$error ? "unset" : "none")};

  & .darkWrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);

    & .modal {
      width: 80%;
      max-width: 500px;
      height: auto;
      background-color: #f2f2f8;
      padding: 2em;
      border-radius: 0.6em;
      transition: all 200ms;
      position: relative;
      top: ${(props) => (props.$error ? "0%" : "100%")};

      & p {
        text-align: center;
        font-family: "Roboto", sans-serif;
        font-size: 1.3rem;
      }

      & .button {
        padding: 0.5em 1em;
        margin-top: 0.5em;
        margin-right: 2.5em;
        display: inline-block;
        border-radius: 0.4em;
        float: right;
        cursor: pointer;
        background-color: var(--blue);
        color: white;

        &:hover {
          color: var(--yellow);
        }
      }
    }
  }
`;

const Body = styled.div`
  height: calc(100vh - ${(props) => props.$marginTop}px);
  position: relative;

  overflow: scroll;
  z-index: 1;
`;
