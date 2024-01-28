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

  return (
    <Container method="POST" onSubmit={(e) => handleSubmit(e)}>
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
            <Link to={"/terms-condition"}>Terms and Condition</Link>
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
