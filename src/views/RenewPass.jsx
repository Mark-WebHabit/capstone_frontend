import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { validateCanChangepass } from "../features/authServices";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Welcome from "../components/Welcome";
import AuthFormFooter from "../components/AuthFormFooter";
import FormFogotPass from "../components/FormFogotPass";
const RenewPass = () => {
  const { token } = useParams();
  const [decodedToken, setDecodedToken] = useState("");

  // const
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;

    let uriEncoded = token.replace(/_dt_/g, ".");

    setDecodedToken(decodeURIComponent(uriEncoded));
  }, []);

  useEffect(() => {
    if (!decodedToken) return;

    async function dispatchVerification() {
      await dispatch(validateCanChangepass(decodedToken));
    }

    dispatchVerification();

    return () => {
      dispatchVerification();
    };
  }, [decodedToken]);

  return (
    <Container>
      <Welcome />
      <FormFogotPass decodedToken={decodedToken} />
      <AuthFormFooter />
    </Container>
  );
};

export default RenewPass;

const Container = styled.div`
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;
