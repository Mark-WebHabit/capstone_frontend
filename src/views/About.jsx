import React from "react";
import styled from "styled-components";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";

const About = () => {
  const headerHeight = useSelector((state) => state.nodeHandler.headerRef);
  return (
    <Container $marginTop={headerHeight}>
      <Image1 src="/images/frontgate.jpg" alt="Frontgate" />
      <p className="pagename">ABOUT US</p>
      <Line />
      <p className="phrase">“Helping in the grief of many people.”</p>
      <Line />
      <MissionVisionContainer>
        <Vision>
          <p className="title">Vision</p>
          <p>
            To provide and complete the following affordable memorialization
            services for the next 5 years in the Holy Gardens Memorial Park:
          </p>
          <p>
            <b>1st Year </b>
            Crematorium and Chapel Service, <br /> Columbarium
            <br />
            <br />
            <b> 2nd Year </b> <br /> Columbarium
            <br />
            <br />
            <b> 3rd Year </b> <br /> Crematorium
            <br />
            <br />
            <b> 4th Year </b> <br /> Chapel Services
            <br />
            <br />
            <b> 5th Year </b>
            <br /> Crematorium and Chapel Services
          </p>
        </Vision>
        <Mission>
          <p className="title">Mission</p>
          <p>
            1. To remember our loved ones in a special place in a special way.{" "}
            <br />
            <br />
            2. John 14: 2-3. “In my father’s house, there are many mansions... I
            go there to prepare a place for you, where I am, there may be also.”
            <br />
            <br /> 3. Jubilee: when we return to the Lord, it must be a happy
            occasion. <br />
            <br />
            4. Job creation
          </p>
        </Mission>
      </MissionVisionContainer>
      <img src="/images/entance.jpg" alt="Entrance" className="secondPic" />
      <p className="tributes">“Tributes for life.”</p>
      <Line />
      <PrincipleContainer>
        <Beliefs>
          <p className="title">BELIEFS</p>
          <p>
            <b>1. CUSTOMER SERVICE </b>
            <br /> To give the best service that there is; the customer is
            divine, the customer is the king. He pays our wages. <br />
            <br />
            <b>2. EXCELLENCE</b> <br />
            To strive to be the best in everything we do; to hire and train the
            best, to practice the best processes. <br />
            <br /> <b>3. LEARNING</b> <br />
            We will keep abreast of the world’s best practices; we will learn
            one new thing a day. <br />
            <br /> <b>4. CHANGE </b>
            <br />
            Change is the only constant thing. We will change always to be
            better and competitive.
          </p>
        </Beliefs>
        <Principles>
          <p className="title">PRINCIPLES</p>{" "}
          <p>
            1. We will give capable and intelligent directions in the management
            of the ----??? <br />
            <br /> We will find ways to be first effective and to be efficient
            in the utilization of resources, operation of the business:
            manpower, machinery, materials, and methods. <br />
            <br /> We want to grow because we want to create more jobs and
            employment opportunities to everyone. <br />
            <br /> We will create wealth for our stakeholders, investors,
            suppliers, landlords, lenders, and employees.{" "}
          </p>
        </Principles>
      </PrincipleContainer>
      <Footer />
    </Container>
  );
};

export default About;

const Container = styled.div`
  min-height: 100vh;
  background-color: var(--blue);

  @media (max-width: 520px) {
    background: none;

    & *:not(.phrase) {
      background-color: var(--blue);
    }

    .footer {
      background-color: var(--darkblue);
    }

    & .phrase {
      margin-bottom: 2em;
    }
  }

  & p {
    font-family: "Montagu Slab", sans-serif;
    text-align: center;
  }
  & .pagename {
    color: #ffffff;
    font-size: 2.5rem;
    margin: 0.3em 0 1em 0;
    @media (max-width: 520px) {
      display: none;
    }

    @media (max-width: 600px) {
      font-size: 2rem;
    }
  }

  & .phrase {
    color: var(--yellow);
    font-size: 3.1275rem;

    @media (max-width: 600px) {
      font-size: 2rem;
    }
  }
  & .secondPic {
    width: calc(100% - 8em);
    display: block;
    margin: 0 auto;
    aspect-ratio: 4 / 1;

    @media (max-width: 670px) {
      width: 95%;
      aspect-ratio: 4 / 2;
    }
    @media (max-width: 520px) {
      width: 100%;
      aspect-ratio: 4 / 2;
    }
  }

  & .tributes {
    font-size: 3.1275rem;
    padding: 1em 0 1em 0;
    color: var(--yellow);

    @media (max-width: 600px) {
      font-size: 2rem;
    }
  }
`;

const Image1 = styled.img`
  width: 100%;
  height: 60vh;
  @media (max-width: 520px) {
    display: none;
  }
`;

const Line = styled.div`
  border: 1px solid white;
  width: 6em;
  margin: 2em auto;

  @media (max-width: 520px) {
    display: none;
  }
`;

const MissionVisionContainer = styled.div`
  display: flex;
  padding: 2em 4em;
  gap: 3em;

  @media (max-width: 720px) {
    padding: 2em 2em;
  }
  & p {
    text-align: left;
    color: #ffffff;
    margin: 1em 0;
    font-size: 1.4rem;

    @media (max-width: 600px) {
      font-size: 1.2rem;
    }
  }

  & .title {
    color: var(--yellow);
    font-size: 2.2rem;

    @media (max-width: 600px) {
      font-size: 1.8rem;
    }
  }
`;
const Vision = styled.div`
  flex: 1;
  p {
    font-family: "Roboto", sans-serif;
  }
`;
const Mission = styled(Vision)``;
const PrincipleContainer = styled(MissionVisionContainer)``;
const Beliefs = styled(Mission)``;
const Principles = styled(Vision)``;
