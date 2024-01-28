import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  changePassPost,
  clearLoadingErrorState,
} from "../features/authServices";

const FormForgotPass = ({ decodedToken }) => {
  const [datas, setDatas] = useState({
    password: "",
    confirmPass: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const changePassCred = useSelector(
    (state) => state.auth.user_changepass_credential
  );

  // redux state
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.auth.error);

  const handleChange = (e) => {
    setError("");
    setDatas((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  // check if there is an auth user, meaning the login was success or a user is already authenticated
  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage);
    }
  }, [errorMessage]);

  const handleClearState = () => {
    setDatas({
      password: "",
      confirmPass: "",
    });
    dispatch(clearLoadingErrorState());
  };

  useEffect(() => {
    if (changePassCred) {
      if (changePassCred == "Not Allowed") {
        alert("Unauthroized Access");
        navigate("/");
      }
    }
  }, [changePassCred]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearLoadingErrorState());

    if (datas.password < 8) {
      setError("Password Too Short");
      return;
    }

    if (datas.password !== datas.confirmPass) {
      setError("Passwords Dont Matched");
      return;
    }

    const response = await dispatch(
      changePassPost({ token: decodedToken, password: datas.password })
    );

    if (!error || !errorMessage) {
      navigate("/auth");
    }
    handleClearState();
  };

  return (
    <Container method="POST" onSubmit={(e) => handleSubmit(e)}>
      <small>{error}</small>
      <InputContainer>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          type="text"
          name="email"
          id="email"
          value={changePassCred?.email}
          disabled
        />
      </InputContainer>
      <InputContainer>
        <InputLabel htmlFor="password">New Password</InputLabel>
        <Input
          type="password"
          name="password"
          id="password"
          value={datas.password}
          onChange={(e) => handleChange(e)}
        />
      </InputContainer>
      <InputContainer>
        <InputLabel htmlFor="confirmPass">Confirm New Password</InputLabel>
        <Input
          type="password"
          name="confirmPass"
          id="confirmPass"
          value={datas.confirmPass}
          onChange={(e) => handleChange(e)}
        />
      </InputContainer>
      <InputFooter></InputFooter>
      <Button>CONFIRM</Button>
    </Container>
  );
};

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
  gap: 0.3em;
  align-items: center;
`;

const CheckBox = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 3px;
  background-color: #d9d9d9;

  & img {
    display: none;
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
`;

export default FormForgotPass;
