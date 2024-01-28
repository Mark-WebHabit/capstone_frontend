import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { sendEmail } from "../features/authServices.js";
import { useDispatch, useSelector } from "react-redux";

const Contact = () => {
  const [datas, setDatas] = useState({
    email: "",
    name: "",
    message: "",
    subject: "",
  });
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setDatas({ ...datas, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, name, subject, message } = datas;
    if (!email || !name || !subject || !message) return;

    await dispatch(sendEmail(datas));

    if (error) {
      return;
    }
    setDatas({
      email: "",
      name: "",
      message: "",
      subject: "",
    });
  };

  return (
    <Container>
      <Form>
        <FormContainer>
          <p>Leave a Message</p>
          {error && (
            <p
              style={{
                textAlign: "center",
                color: "red",
              }}
            >
              {error}
            </p>
          )}
          <InputContainer>
            <InputField>
              <Label htmlFor="name">Name</Label>
              <input
                type="text"
                name="name"
                id="name"
                value={datas.name}
                onChange={handleChange}
              />
            </InputField>
            <InputField>
              <Label htmlFor="email">Email</Label>
              <input
                type="text"
                name="email"
                id="email"
                value={datas.email}
                onChange={handleChange}
              />
            </InputField>
            <InputField>
              <Label htmlFor="subject">Title</Label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={datas.subject}
                onChange={handleChange}
              />
            </InputField>
            <InputField>
              <Label htmlFor="message">Message</Label>
              <textarea
                name="message"
                htmlFor="message"
                value={datas.message}
                onChange={handleChange}
              />
            </InputField>
            <div>
              <Button onClick={handleSubmit}>SUBMIT</Button>
            </div>
          </InputContainer>
        </FormContainer>
      </Form>
      <Footer>
        <p>CONTACT US</p>

        <Grid>
          <Wrapper>
            <Icon src="/images/location.png" alt="LocationIcon" />
            <Text>
              Taghangin, San Juan, <br />
              Morong, Rizal
            </Text>
          </Wrapper>
          <Wrapper>
            <Icon src="/images/phone.png" alt="PhoneIcon" />
            <Text>
              978-4381 <br /> 0917-8221110 <br /> 0933-8615858
            </Text>
          </Wrapper>
          <Wrapper>
            <Icon src="/images/email.png" alt="EmailIcon" />
            <Text>
              holyangels@ymail.com <br /> holyangels.morong@gmail.com
            </Text>
          </Wrapper>
        </Grid>
      </Footer>
    </Container>
  );
};

export default Contact;

const Container = styled.div`
  flex: 1;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
`;

const Footer = styled.div`
  height: 25%;
  background-color: var(--blue);
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;

  & p:first-child {
    color: #ffffff;
    font-family: "Montagu Slab", sans-serif;
    font-size: 3rem;
    position: absolute;
    top: -3.5rem;

    @media (max-width: 930px) {
      display: none;
    }
  }

  @media (max-width: 760px) {
    grid-template-columns: 80% 1fr;
  }

  @media (max-width: 550px) {
    padding: 0 3em;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "div1 div1"
    "div2 div3";

  & div:first-child {
    grid-area: div1;
  }

  & div:nth-child(2) {
    grid-area: div2;
  }

  & div:nth-child(3) {
    grid-area: div3;
  }

  @media (max-width: 550px) {
    grid-template-columns: 1f;
    grid-template-rows: 1fr 1fr 1fr;

    grid-template-areas:
      "div1"
      "div2"
      "div3";
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 550px) {
    width: 100%;
  }
`;

const Icon = styled.img`
  height: 50%;
  margin-right: 1em;
`;

const Text = styled.p`
  font-size: 1rem;
  color: #ffffff;
  font-family: "Roboto", sans-serif;

  @media (max-width: 930px) {
    font-size: 0.9rem;
  }
  @media (max-width: 760px) {
    font-size: 1rem;
  }
`;

const Form = styled.div`
  flex: 1;
  width: 50%;
  align-self: flex-end;
  position: relative;
  bottom: -5em;
  z-index: 3;
  display: flex;
  padding: 0.5em 0;

  @media (max-width: 760px) {
    align-self: center;
    width: 80%;
    bottom: 0;
  }

  @media (max-width: 520px) {
    width: 97%;
  }
`;

const FormContainer = styled.form`
  width: 90%;
  background-color: #ffffff;
  border-radius: 1em;
  padding-bottom: 1em;

  & p:first-child {
    color: var(--blue);
    font-size: 2rem;
    font-family: "Roboto", sans-serif;
    padding: 0.5em;
    font-weight: 600;
  }

  @media (max-width: 560px) {
    width: 100%;
  }
`;

const InputContainer = styled.div`
  height: calc(100% - 4.5em);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;

  & div:last-child {
    width: 85%;
    display: flex;
    justify-content: right;

    @media (max-width: 760px) {
      justify-content: center;
    }
  }
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & input {
    border: none;
    border-bottom: 2px solid var(--blue);
    width: 100%;
    outline: none;
  }

  &:nth-child(odd) {
    width: 45%;
  }
  &:nth-child(even) {
    width: 30%;
  }

  @media (max-width: 1050px) {
    &:nth-child(even) {
      width: 45%;
    }
  }

  &:nth-child(4) {
    width: 85%;

    & textarea {
      width: 100%;
      max-height: 300px;
      height: 300px;
      resize: none;
      border: none;
      padding: 1em;

      outline: 2px solid var(--blue);
      margin-bottom: 1em;
    }
  }
`;

const Label = styled.label`
  font-size: 1rem;
  font-family: "Roboto", sans-serif;
  font-weight: bold;
  color: #6b6b6b;
  margin: 1em 0;
`;

const Button = styled.button`
  padding: 1em 2em;
  position: relative;
  align-self: flex-center;
  color: var(--blue);
  font-weight: bold;
  font-family: "Roboto", sans-serif;
  font-size: 1.2rem;
  border-radius: 0.5em;
  border: 1px solid var(--blue);
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    scale: 1.1;
  }

  @media (max-width: 760px) {
    width: 70%;
  }
`;
