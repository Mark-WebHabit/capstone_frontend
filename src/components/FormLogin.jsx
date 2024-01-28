import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { clearLoadingErrorState, setUser } from "../features/authServices";
import { loginUser, forgotPassDispatch } from "../features/authServices";

const FormLogin = () => {
  const [datas, setDatas] = useState({
    email: "",
    password: "",
  });
  const [emailForgotPass, setEmailForgotPass] = useState("");
  const [error, setError] = useState(null);
  // redux state
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.status === "loading");
  const errorMessage = useSelector((state) => state.auth.error);
  const [forgotPass, setForgotPass] = useState(false);

  const handleChange = (e) => {
    setError("");
    setDatas((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  // check if there is an auth user, meaning the login was success or a user is already authenticated
  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage);
    }
  }, [errorMessage, loading]);

  const handleClearState = () => {
    setDatas({
      email: "",
      password: "",
    });
    dispatch(clearLoadingErrorState());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearLoadingErrorState());

    const { email, password } = datas;

    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    let credentials = {
      email,
      password,
    };
    dispatch(loginUser(credentials));
    dispatch(setUser());
    handleClearState();
  };

  const handleChangeForgotPassInput = (e) => {
    setEmailForgotPass(e.target.value);
  };

  return (
    <>
      <Container method="POST" onSubmit={(e) => handleSubmit(e)}>
        <small>{error}</small>
        <InputContainer>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            type="text"
            name="email"
            id="email"
            value={datas.email}
            onChange={(e) => handleChange(e)}
          />
        </InputContainer>
        <InputContainer>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            type="password"
            name="password"
            id="password"
            value={datas.password}
            onChange={(e) => handleChange(e)}
          />
        </InputContainer>
        <InputFooter>
          <ForgotPass
            onClick={() => {
              setForgotPass(true);
            }}
          >
            Forgot Password
          </ForgotPass>
        </InputFooter>
        <Button>LOGIN</Button>
      </Container>
      {forgotPass && (
        <GetEmailModal>
          <div className="wrapper">
            <input
              type="text"
              name="email"
              placeholder="Enter Your Email"
              value={emailForgotPass}
              onChange={handleChangeForgotPassInput}
            />
            <div className="buttons">
              <button
                onClick={async () => {
                  if (!emailForgotPass) {
                    return;
                  }

                  const response = await dispatch(
                    forgotPassDispatch({ email: emailForgotPass })
                  );
                  alert(response.payload.data);
                  setEmailForgotPass("");
                  setForgotPass(false);
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setEmailForgotPass("");
                  setForgotPass(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </GetEmailModal>
      )}
    </>
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

const ForgotPass = styled.p`
  color: var(--blue);
  font-size: 1.3rem;
  font-family: "Roboto";
  font-weight: 500;
  cursor: pointer;

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

const GetEmailModal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;

  & .wrapper {
    width: 250px;
    max-width: 250px;
    padding: 1em;
    background: white;
  }

  & .wrapper input {
    width: 100%;
    font-szie: 1.2rem;
    padding: 0.3em 1em;
    border: 1px solid var(--blue);
    outline: none;
    display: block;
    margin-bottom: 1em;
  }

  & .wrapper .buttons button {
    width: 75px;
    float: right;
    font-size: 1.1rem;
    padding: 0.3em 0;
    font-weight: bold;
    border: none;
    margin: 0 0.3em;
    color: red;
    border: 1px solid black;
    cursor: pointer;

    &:first-child {
      color: var(--blue);
    }
  }
`;

export default FormLogin;
