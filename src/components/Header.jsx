import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getHeaderHeight } from "../features/nodeHandlerSlice";
import { logout } from "../features/authServices.js";

const headerHeightInNotMobile = 0.1 * window.innerHeight;
const Header = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const dispatch = useDispatch();
  const ref = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);

  // detect if there is authenticated user
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    if (user && user?.token && user?.email) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [user]);

  useEffect(() => {
    const setHeaderHight = () => {
      if (ref.current) {
        dispatch(getHeaderHeight(ref.current.clientHeight));
      }
    };

    setHeaderHight();

    window.addEventListener("resize", setHeaderHight);

    return () => {
      window.removeEventListener("resize", setHeaderHight);
    };
  }, [ref, dispatch]);
  return (
    <Container ref={ref}>
      <Wrapper>
        <CompanyInfo
          $inMapping={
            location.pathname === "/mapping" || location.pathname === "/profile"
          }
        >
          <ImageForMobileView
            src="/images/logo.png"
            alt="Logo"
            onClick={() => navigate("/")}
          />
          <Circle onClick={() => navigate("/")}>
            <Image src="/images/logo.png" alt="Logo" />
          </Circle>
          <Texts $location={location.pathname}>
            <CompanyName>Holy Angels Memorial Park</CompanyName>
            <Address>Morong, Rizal</Address>
          </Texts>
        </CompanyInfo>

        {/* edit the content when implementing user access control */}
        <Navigation
          $inMapping={
            location.pathname === "/mapping" || location.pathname === "/profile"
          }
          $location={location.pathname}
        >
          {/* nav for no user authenticad */}{" "}
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "activeNav" : "inactiveNav"
            }
            end
          >
            HOME
          </NavLink>
          {auth && (
            <>
              <NavLink
                to="/mapping"
                className={({ isActive }) =>
                  isActive ? "activeNav" : "inactiveNav"
                }
              >
                MAPPING
              </NavLink>
            </>
          )}
          {/* public nav */}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "activeNav" : "inactiveNav"
            }
          >
            ABOUT
          </NavLink>
          {role == "admin" ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "activeNav" : "inactiveNav"
              }
            >
              DASHBOARD
            </NavLink>
          ) : (
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "activeNav" : "inactiveNav"
              }
            >
              CONTACT
            </NavLink>
          )}
          {auth && (
            <div className="profileIcon">
              <img
                src="/images/dp.png"
                alt="Profile"
                onClick={() => setShowProfileModal(!showProfileModal)}
              />

              {showProfileModal && (
                <div className="profileModal">
                  <p className="email">{user.username}</p>
                  <div
                    className="logout"
                    onClick={() => dispatch(logout(user.email))}
                  >
                    <img src="/images/logout.png" alt="Logout" />
                    <p>Logout</p>
                  </div>
                  <div className="profile" onClick={() => navigate("/profile")}>
                    <img src="/images/accntsetting.png" alt="Profile" />
                    <p>Account Setting</p>
                  </div>
                </div>
              )}
            </div>
          )}
          {!auth && (
            <AuthButtons>
              <Hamburger src="/images/hamburger.png" alt="Hamburger" />
              <NavLink to="/auth">LOGIN</NavLink>
              <NavLink to="/auth/register">REGISTER</NavLink>
            </AuthButtons>
          )}
        </Navigation>
      </Wrapper>
      <Blue $inMapping={location.pathname} />
    </Container>
  );
};

export default Header;

const Container = styled.header`
  z-index: 3;
  // overflow: hidden;
`;
const Wrapper = styled.div`
  min-height: ${headerHeightInNotMobile}px;
  height: 100%;
  display: flex;
  align-items: center;

  background-color: #f8f9f9;
  @media (max-width: 930px) {
    flex-direction: column;
  }

  @media (max-width: 520px) {
    background-color: transparent;
  }
`;
const ImageForMobileView = styled.img`
  display: none;
  cursor: pointer;

  @media (max-width: 930px) {
    display: block;
    width: 20%;
    margin-bottom: 1em;
  }
  @media (max-width: 720px) {
    width: 25%;
  }
  @media (max-width: 600px) {
    width: 35%;
  }
`;
const CompanyInfo = styled.div`
  display: flex;
  margin-left: 1em;
  flex: 1;

  @media (max-width: 930px) {
    width: 100%;
    display: grid;
    place-items: center;
    background-color: var(--blue);
    padding: 2em;
    margin-left: 0;
  }

  @media (max-width: 520px) {
    border-bottom-left-radius: ${(props) => (props.$inMapping ? "0" : "5em")};
    border-bottom-right-radius: ${(props) => (props.$inMapping ? "0" : "5em")};
    padding-bottom: ${(props) => (props.$inMapping ? "2em" : "4em")};
  }
`;
const Circle = styled.div`
  display: grid;
  place-items: center;
  width: ${Math.round((82 / headerHeightInNotMobile) * 100)}px;
  height: ${Math.round((82 / headerHeightInNotMobile) * 100)}px;
  border-radius: 50%;

  background-color: var(--blue);
  cursor: pointer;
  transition: scale 120ms;
  margin-right: 1em;

  &:hover {
    scale: 1.1;
  }

  @media (max-height: 800px) {
    width: ${Math.round((25 / headerHeightInNotMobile) * 100)}px;
    height: ${Math.round((25 / headerHeightInNotMobile) * 100)}px;
  }

  @media (max-width: 930px) {
    display: none;
  }
`;

const Image = styled.img`
  width: 90%;
`;

const Texts = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 530px) {
    display: ${(props) =>
      props.$location === "/contact" || "/about" ? "none" : "flex"};
  }
`;

const CompanyName = styled.p`
  font-size: 1.3rem;
  color: var(--blue);
  font-family: "Montagu Slab", serif;

  @media (max-width: 930px) {
    text-align: center;
    color: var(--yellow);
    font-size: 2rem;
  }
  @media (max-width: 720px) {
    font-size: 1.6rem;
  }
`;

const Address = styled(CompanyName)`
  font-size: 1.25rem;
  @media (max-width: 720px) {
    font-size: 1rem;
  }
`;
const Navigation = styled.nav`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  position: relative;

  & a {
    color: var(--blue);
    transition: all 200ms;
    padding: 0.5em 1em;
    margin: 0 0.5em;
  }
  & .profileIcon {
    padding: 0 1em;
    position: relative;

    & > img {
      cursor: pointer;
    }

    & .profileModal {
      position: absolute;
      bottom: -310%;
      right: 1em;
      border-radius: 0.3em;
      background-color: #f2f2f2;
      padding: 0.5em 1em;
      z-index: 2;
      box-shadow: -2px 2px 5px 1px rgba(0, 0, 0, 0.75);
      -webkit-box-shadow: -2px 2px 5px 1px rgba(0, 0, 0, 0.75);
      -moz-box-shadow: -2px 2px 5px 1px rgba(0, 0, 0, 0.75);

      & .email {
        color: var(--blue);
        font-size: 1.2rem;
      }
      .logout,
      .profile {
        display: flex;
        margin: 0.3em 0;
        align-items: center;
        cursor: pointer;
        transition: all 150ms;

        &:hover {
          background-color: #ffff99;
        }

        & img {
          margin-right: 0.3em;
        }
      }
    }
  }
  & a.activeNav,
  & a.inactiveNav:hover {
    color: #fff;
    background-color: var(--blue);
    border-radius: 1em;
    height: 100%;
  }

  & img {
    height: ${Math.round((30 / headerHeightInNotMobile) * 100)}px;
  }

  @media (min-width: 930px) {
    & a {
      color: var(--blue);
      padding: 3em 1.8em;
      margin: 0;
    }
    & a.activeNav,
    & a.inactiveNav:hover {
      border-radius: 0;
    }
  }

  @media (max-width: 930px) {
    display: ${(props) => (props.$location === "/mapping" ? "none" : "flex")};
    width: 100%;
    padding: 1em 3em;
    justify-content: center;
    & a {
      padding: 0.5 1em;
    }
    & img {
      height: ${Math.round((30 / headerHeightInNotMobile) * 100)}px;
    }
  }

  @media (max-width: 520px) {
    background-color: #f8f9f9;
    width: 98%;
    border-radius: 1em;
    position: relative;
    top: -3em;

    display: ${(props) => (props.$inMapping ? "none" : "flex")};

    & a {
      text-align: center;
    }
  }
  @media (max-width: 420px) {
    width: 90%;
    font-size: 10px;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin: 0 1em;
  transtion all 150ms;
  
  & a {
    display: block;
    width: 6em;
    padding: 0.5em 0;
    text-align: center;
    border-radius: 0.5em;
    border: 1px solid var(--blue);
    
    @media (max-width: 930px) {
      transform: translateX(300px);
      opacity: 0;
    }

  }
  

  &:hover a{
    transform: translateX(0);
    opacity: 1;
    scale: 0.9;
  }
  &:hover img{
    display: none;
  }
  &:hover {
    width: auto;
  }

  & a:hover {
    scale: 1.1;
  }

  & a:last-child {
    color: #ffffff;
    background-color: var(--blue);
  }
  @media (max-width: 930px) {
    cursor: pointer;
    width: 0;
  }
  
  @media(max-width: 520px){
    display: none;
  }

`;
const Hamburger = styled.img`
  display: none;

  @media (max-width: 930px) {
    display: block;
  }
`;

const Blue = styled.div`
  height: 2em;
  background-color: var(--blue);
  display: ${(props) =>
    props.$inMapping === "/mapping" || props.$inMapping === "/profile"
      ? "none"
      : "initial"};
  @media (max-width: 930px) {
    display: none;
  }
`;
