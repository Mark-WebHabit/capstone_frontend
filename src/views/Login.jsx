import React from "react";
import styled from "styled-components";

// component
import Welcome from "../components/Welcome";
import FormLogin from "../components/FormLogin";
import AuthFormFooter from "../components/AuthFormFooter";

const Login = () => {
  return (
    <Container>
      <Welcome />
      <FormLogin />
      <AuthFormFooter />
    </Container>
  );
};

const Container = styled.div`
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  position: realtive;
`;

export default Login;
