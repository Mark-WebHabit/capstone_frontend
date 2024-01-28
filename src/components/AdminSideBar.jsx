import React from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
const AdminSideBar = () => {
  const location = useLocation().pathname;
  const navigate = useNavigate();
  return (
    <SideBar>
      <div className="logo" onClick={() => navigate("/")}>
        <img src="/images/logo.png" alt="Logo" />
        <p className="company">Holy Angels</p>
        <p className="company">Memorial Park</p>
      </div>
      <Navigation>
        <div className={location == "/admin" ? "nav active" : "nav inactive"}>
          <Link to="/admin">
            <img src="/images/manage.png" alt="Manage" />
            <h5>MANAGE</h5>
          </Link>
        </div>
        {/* <div
          className={
            location == "/admin/mapping" ? "nav active" : "nav inactive"
          }
        >
          <Link to="/admin/mapping">
            <img src="/images/adminmapping.png" alt="Manage" />
            <h5>MAPPING</h5>
          </Link>
        </div> */}
        <div
          className={
            location == "/admin/personnel" ? "nav active" : "nav inactive"
          }
        >
          <Link to="/admin/personnel">
            <img src="/images/adminuser.png" alt="Manage" />
            <h5>PERSONNEL</h5>
          </Link>
        </div>
        <div className={location == "/profile" ? "nav active" : "nav inactive"}>
          <Link to="/profile">
            <img src="/images/adminprofile.png" alt="Manage" />
            <h5>PROFILE</h5>
          </Link>
        </div>
      </Navigation>
    </SideBar>
  );
};

export default AdminSideBar;

const SideBar = styled.div`
  background-color: var(--blue);
  display: flex;
  flex-direction: column;

  & .logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2em 0;

    & > img {
      width: 50%;
      margin-bottom: 0.5em;
    }

    & P {
      color: var(--yellow);
      font-size: 1.7rem;
      text-align: center;
      font-family: "Montagu Slab", sans-serif;
    }
  }
`;

const Navigation = styled.div`
  flex: 1;
  margin-top: 20%;

  & .nav {
    width: 100%;
    height: auto;

    & a {
      display: flex;
      align-items: center;
      gap: 1em;
      padding: 2em 0;
      padding-left: 1.5em;

      & img {
        width: 23%;
      }
      & h5 {
        font-family: "Roboto", sans-serif;
        color: white;
        font-size: 1.3rem;
      }
    }

    &:hover {
      background-color: var(--darkblue);
    }
  }

  & .active.nav {
    background-color: var(--darkblue);
  }
`;
