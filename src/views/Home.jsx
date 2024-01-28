import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const [screenWidth, setScreenWidth] = useState(0);
  const [auth, setAuth] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  // detect if there is a user
  useEffect(() => {
    if (user && user?.token && user?.email) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [user, location.pathname]);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
  }, [window.innerWidth, screenWidth]);

  const PrivateCards = () => {
    return (
      <CardContainer>
        {/* make the mapping private, the user should be able to access it without auth */}
        <Card $width={screenWidth} onClick={() => navigate("/mapping")}>
          <Icon src="/images/map.png" alt="Map" />
          <Text>Mapping</Text>
        </Card>
        <Card $width={screenWidth} onClick={() => navigate("/contact")}>
          <Icon src="/images/contact.png" alt="Map" />
          <Text>Contact</Text>
        </Card>
        <Card $width={screenWidth} onClick={() => navigate("/about")}>
          <Icon src="/images/about.png" alt="Map" />
          <Text>About</Text>
        </Card>
      </CardContainer>
    );
  };

  const AuthButtons = ({ user }) => {
    return (
      <AuthCOntainer>
        {!user && (
          <AuthWrapper>
            <Link to={"/auth"}>
              <Button>LOGIN</Button>
            </Link>
            <Link to={"/auth/register"}>
              <Button>REGISTER</Button>
            </Link>
          </AuthWrapper>
        )}
      </AuthCOntainer>
    );
  };

  return (
    <Conatiner>
      <Wrapper $auth={auth}>
        <FistText>WELCOME TO</FistText>
        <SecondText>HOLY ANGELS MEMORIAL PARK</SecondText>
      </Wrapper>

      {auth && <PrivateCards />}
      {/* pass the empty authenticated user state to nullify the content */}
      {<AuthButtons user={auth} />}
    </Conatiner>
  );
};

export default Home;

const Conatiner = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  color: #ffffff;
  font-family: "Montagu Slab", sans-serif;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  @media (max-width: 600px) {
    justify-content: center;
    & p:first-child {
      font-size: 1.5rem;
    }
    & p:last-child {
      font-size: 2.2rem;
    }
  }
`;

const FistText = styled.p`
  font-size: 2rem;
`;
const SecondText = styled(FistText)`
  font-size: 3.125rem;
`;

const CardContainer = styled.div`
  width: 100%;
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 5em;
  gap: 3em;

  @media (max-width: 970px) {
    align-items: flex-start;
    padding-bottom: 0;
    padding-top: 3em;
  }
  @media (max-width: 720px) {
    padding-top: 5em;
  }
  @media (max-width: 600px) {
    padding-top: 0;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
`;

const Card = styled.div`
  background-color: #ffffff;
  max-width: 320px;
  max-height: 320px;
  width: ${(props) => props.$width && Math.round(props.$width / 4) - 100}px;
  aspect-ratio: 4 / 4;
  border-radius: 2em;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    scale: 1.1;
  }

  @media (max-width: 720px) {
    width: ${(props) => props.$width && Math.round(props.$width / 3.5)}px;
  }

  @media (max-width: 600px) {
    max-width: 95%;
    flex-direction: row;
    width: 100%;
    aspect-ratio: unset;
    padding: 1.75em 3em;
    border-radius: 1em;
    align-items: center;
    justify-content: flex-start;
  }
`;

const Icon = styled.img`
  width: 30%;
  margin: 0 auto;

  @media (max-width: 600px) {
    width: 10%;
    margin: 0;
  }
`;
const Text = styled.p`
  font-size: 2rem;
  color: var(--blue);
  font-family: "Roboto", sans-serif;
  font-weight: bold;

  @media (max-width: 600px) {
    margin: 0 auto;
  }
`;

const AuthCOntainer = styled.div`
  flex: 2;
  width: 100%;

  @media (min-width: 520px) {
    flex: 1;
  }
`;

const AuthWrapper = styled.div`
  width: 100%;
  @media (min-width: 520px) {
    display: none;
  }

  & a {
    font-size: 1.5rem;
    font-family: "Roboto", sans-serif;
    font-weight: bold;

    & div:hover {
      scale: 1.1;
    }
  }

  & a:first-child {
    color: var(--blue);

    & div {
      background-color: #ffffff;
      margin-top: 0;
    }
  }
  & a:last-child {
    color: #ffffff;

    & div {
      background-color: var(--blue);
    }
  }
`;

const Button = styled.div`
  margin: 2em auto;
  width: 75%;
  padding: 1em 0;
  border-radius: 1em;
  text-align: center;
  transition: all 200ms;
`;
