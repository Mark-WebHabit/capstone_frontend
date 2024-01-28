import React from "react";
import styled from "styled-components";

// component
import Welcome from "../components/Welcome";
import FormRegister from "../components/FormRegister";
import AuthFormFooter from "../components/AuthFormFooter";

const Register = () => {
  return (
    <Container>
      <Welcome />
      <FormRegister />
      <AuthFormFooter />
    </Container>
  );
};

const Container = styled.div`
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;

export default Register;
