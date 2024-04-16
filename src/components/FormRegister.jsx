import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/authServices.js";
import { clearLoadingErrorState } from "../features/authServices.js";

const FormRegister = () => {
  const [datas, setDatas] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [check, setCheck] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  // redux state
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.status === "loading");
  const errorMessage = useSelector((state) => state.auth.error);
  const response = useSelector((state) => state.auth.response);

  const handleOnChange = (e) => {
    setError("");
    setDatas((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage);
    }
  }, [errorMessage, loading]);

  const handleClearState = () => {
    setDatas({
      username: "",
      email: "",
      password: "",
    });
    setCheck(false);
  };

  useEffect(() => {
    if (response) {
      setShowModal(true);
      handleClearState();
    } else {
      setShowModal(false);
    }
  }, [response]);

  const handleNavigate = () => {
    setShowModal(false);
    navigate("/auth");
    dispatch(clearLoadingErrorState());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (datas.username == "" || datas.email == "" || datas.password == "") {
      setError("All fields are required");
      return;
    }

    if (datas.username.length < 3) {
      setError("Username too short");
      return;
    }

    if (!emailRegex.test(datas.email)) {
      setError("Invalid Email Format");
      return;
    }

    if (datas.password.length < 8) {
      setError("Password too short");
      return;
    }

    if (!check) {
      return;
    }
    let credentials = {
      username: datas.username,
      email: datas.email,
      password: datas.password,
    };
    dispatch(registerUser(credentials));
    dispatch(clearLoadingErrorState());
  };

  const TermsAndCondition = () => (
    <Terms>
      <div className="terms-wrapper">
        <p>
          Terms and Conditions for Holyangels Memorial Park Mapping and
          Information System
          <br /> <br />
          Introduction <br />
          Thank you for choosing Holyangels Memorial Park Mapping and
          Information System ("Service"). These Terms and Conditions govern your
          access to and use of our Service, which helps users navigate and
          obtain information about Holyangels Memorial Park. By accessing or
          using our Service, you agree to abide by these Terms.
          <br /> <br />
          Service Description <br /> Holyangels Memorial Park Mapping and
          Information System provides interactive digital maps and informational
          resources about the cemetery, helping visitors locate gravesites,
          amenities, and other park features. This Service is designed for
          support and guidance within the cemetery grounds.
          <br /> <br />
          Collection of Personal Information <br /> We collect your contact
          information, name, and email address solely for the purpose of
          enhancing your user experience and facilitating effective
          communication related to the services provided by the cemetery. We are
          committed to respecting your privacy and the sensitive nature of the
          information we handle.
          <br /> <br />
          Cookies and Session Tokens <br /> Our Service utilizes cookies and
          session tokens to personalize and enhance your interaction with our
          website. These tools help maintain your session integrity and store
          your preferences for future visits. You can adjust your browser
          settings to decline cookies if you prefer.
          <br /> <br />
          Respectful Use Policy <br /> As this Service pertains to a cemetery,
          we ask that you engage with our platform respectfully and sensitively.
          The information should be used in a manner that maintains the dignity
          and solemnity of the cemetery environment.
          <br /> <br />
          Intellectual Property <br /> The content displayed on the Service,
          including but not limited to maps, texts, and graphical
          representations, is owned by or licensed to Holyangels Memorial Park.
          This content is protected by copyright and intellectual property laws.
          <br /> <br />
          No Commercial Use <br /> This Service is provided for personal,
          non-commercial use only. Users are prohibited from exploiting any part
          of the Service for commercial purposes without explicit permission
          from Holyangels Memorial Park.
          <br /> <br />
          Disclaimer of Warranties <br /> The Service is provided on an "as is"
          basis. Holyangels Memorial Park makes no warranties regarding the
          completeness, reliability, or accuracy of the information provided
          through the Service.
          <br /> <br />
          Limitation of Liability Holyangels Memorial Park, including its
          affiliates and staff, will not be liable for any damages resulting
          from the use of this Service. This limitation of liability is
          comprehensive and applies to all damages of any kind.
          <br /> <br />
          Amendments to Terms <br /> We reserve the right to modify these Terms
          at any time. Changes will be effective immediately upon posting to the
          website. Your continued use of the Service after such changes will
          constitute your agreement to the new Terms.
          <br /> <br />
          Contact Information <br /> For questions or concerns regarding these
          Terms or the Service, please contact us at
          holyangelsmemorialpark69@gmail.com.
        </p>
        <br />
        <br />
        <button
          style={{
            float: "right",
            position: "relative",
            bottom: "2em",
            padding: "0.5em 1em",
          }}
          onClick={() => setShowTerms(false)}
        >
          CLOSE
        </button>
      </div>
    </Terms>
  );

  return (
    <Container method="POST" onSubmit={(e) => handleSubmit(e)}>
      {showTerms && <TermsAndCondition />}
      <small>{error}</small>
      <DarkOpacity $showModal={showModal}>
        <div className="darkWrapper">
          <div className="modal">
            <p>An Email Verification was sent to your account</p>
            <span className="button" onClick={handleNavigate}>
              OK
            </span>
          </div>
        </div>
      </DarkOpacity>
      <InputContainer>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          type="text"
          name="email"
          id="email"
          value={datas.email}
          onChange={(e) => handleOnChange(e)}
        />
      </InputContainer>
      <InputContainer>
        <InputLabel htmlFor="username">Username</InputLabel>
        <Input
          type="text"
          name="username"
          id="username"
          value={datas.username}
          onChange={(e) => handleOnChange(e)}
        />
      </InputContainer>
      <InputContainer>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          type="password"
          name="password"
          id="password"
          value={datas.password}
          onChange={(e) => handleOnChange(e)}
        />
      </InputContainer>
      <InputFooter>
        <CheckBoxContainer onClick={() => setCheck(!check)}>
          <CheckBox
            id="termsCondition"
            name="tersmsCondition"
            $check={check ? "checked" : null}
          >
            <img src="/images/check.png" alt="Checked" />
          </CheckBox>
          <InputLabel htmlFor="termsCondition">
            I agreed to the{" "}
            <a onClick={() => setShowTerms(true)}>Terms and Condition</a>
          </InputLabel>
        </CheckBoxContainer>
      </InputFooter>
      <Button disabled={loading}>REGISTER</Button>
    </Container>
  );
};

export default FormRegister;

const Container = styled.form`
  flex: 1;
  margin: 0 auto;
  width: calc(100% - 10em);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 960px) {
    width: calc(100% - 5em);
  }
  @media (max-width: 960px) {
    width: calc(100% - 7em);
  }

  & small {
    display: block;
    text-align: center;
    color: red;
    font-size: 0.9rem;
    margin: 0.3em;
  }
`;

const DarkOpacity = styled.div`
  height: 100vh;
  width: 100vw;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  display: ${(props) => (props.$showModal ? "unset" : "none")};

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
      top: ${(props) => (props.$showModal ? "0%" : "100%")};

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

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 1em 0;
`;

const InputLabel = styled.label`
  color: var(--gray);
  font-size: 1.3rem;
  font-family: "Roboto";
  font-weight: 500;
  margin-bottom: 0.3em;

  @media (max-width: 900px) {
    font-size: 1.2rem;
  }
`;

const Input = styled.input`
  font-size: 1.05rem;
  color: black;
  border: none;
  border-bottom: 2px solid var(--blue);

  &:focus {
    outline: none;
  }
`;

const InputFooter = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.2em;
`;

const CheckBoxContainer = styled.div`
  display: flex;
  gap: 0.5em;
  align-items: center;
`;

const CheckBox = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 3px;
  background-color: #d9d9d9;
  & img {
    display: ${(props) => (props.$check ? "unset" : "none")};
    width: 100%;
    height: 100%;
  }
`;

const ForgotPass = styled.p`
  color: var(--blue);
  font-size: 1.3rem;
  font-family: "Roboto";
  font-weight: 500;

  @media (max-width: 900px) {
    font-size: 1.1rem;
  }
`;

const Button = styled.button`
  margin: 1em 0 0 0;
  width: 100%;
  font-size: 1.5rem;
  font-family: "Roboto";
  font-weight: 500;
  padding: 0.5em;
  border-radius: 2.5em;
  border: 1px solid var(--blue);
  background-color: #fff;
  color: var(--blue);
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    color: #ffffff;
    background: var(--blue);
  }
  @media (max-width: 900px) {
    margin: 1em 0;
  }
`;

const Terms = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;

  & .terms-wrapper {
    width: 100%;
    max-width: 800px;
    height: 100%;
    max-height: 1000px;
    height: 500px;
    background: #f2f2f2;
    padding: 1em;
    border-radius: 1em;
    overflow-y: scroll;
  }
`;
