import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUsername,
  updatePassword,
  getLoginHistroy,
} from "../features/restApiSlice";
import { setUser, verifyUser } from "../features/authServices";

const Profile = () => {
  const [edit, setEdit] = useState(false);
  const [authUser, setAuthUser] = useState({ email: "", username: "" });
  const [pass, setPass] = useState({
    currentPass: "",
    newPass: "",
    confirmPass: "",
  });
  const [changePass, setChagePass] = useState(false);
  const usernameRef = useRef(null);
  const changePassRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const loginHistory = useSelector((state) => state.restApi.loginHistory);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?.token || !user?.email) {
      navigate("/");
    } else {
      setAuthUser({
        username: user.username,
        email: user.email,
      });

      dispatch(getLoginHistroy(user.email));
    }
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      changePassRef.current.focus();
    }, 0);
  }, [changePass]);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!authUser.username || authUser.username.length <= 6) {
      return;
    }
    const data = {
      email: authUser.email,
      username: authUser.username,
    };
    await dispatch(updateUsername({ data }));
    await dispatch(setUser());
    await dispatch(verifyUser());

    setEdit(false);
  };

  const handleChangePass = (e) => {
    setPass({ ...pass, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pass.currentPass || !pass.newPass || !pass.confirmPass) {
      return; // empty fields
    }

    if (pass.confirmPass !== pass.newPass) {
      return; // password do not macthed
    }

    const data = {
      email: authUser.email,
      currentPassword: pass.currentPass,
      newPassword: pass.newPass,
    };

    await dispatch(updatePassword({ data }));
    await dispatch(setUser());
    await dispatch(verifyUser());

    setPass({ currentPass: "", newPass: "", confirmPass: "" });
    setChagePass(false);
  };

  return (
    <Container>
      <AccountSetting className="accountSetting">
        <p className="accntSetting">Account Setting</p>
        <p className="info">
          Holy Angels uses this information to verify your identity and to keep
          our community safe.
        </p>
        <p className="email">{authUser.email}</p>
        <form
          action=""
          className="usernameForm"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            ref={usernameRef}
            type="text"
            key={authUser.username}
            className="username"
            name="username"
            disabled={!edit}
            value={authUser.username}
            onChange={(e) => {
              setAuthUser({ ...authUser, [e.target.name]: e.target.value });
              setTimeout(() => {
                usernameRef.current.focus();
              }, 0);
            }}
          />
          {!edit ? (
            <img
              className="edit"
              src="/images/pencil.png"
              alt="Edit"
              onClick={() => {
                setEdit(true);
                setTimeout(() => {
                  usernameRef.current.focus();
                }, 0);
              }}
            />
          ) : (
            <div className="usernameButtons">
              <img
                className="cancel"
                src="/images/check.png"
                alt="Save"
                onClick={(e) => handleUpdateUsername(e)}
              />
              <img
                className="cancel"
                src="/images/cancel.png"
                alt="Cancel"
                onClick={() => {
                  setAuthUser({
                    ...authUser,
                    username: user.username,
                  });
                  setEdit(false);
                }}
              />
            </div>
          )}
        </form>
        <p className="changePass" onClick={() => setChagePass(!changePass)}>
          Change Password
        </p>
        <p className="errorPass">error message</p>
        <ChangePassForm $changePass={changePass}>
          <div className="inputDiv">
            <Label $content={pass.currentPass} htmlFor="currentPass">
              Current Password
            </Label>
            <input
              type="password"
              name="currentPass"
              id="currentPass"
              disabled={!changePass}
              value={pass.currentPass}
              onChange={(e) => handleChangePass(e)}
              ref={changePassRef}
            />
          </div>
          <div className="inputDiv">
            <Label $content={pass.newPass} htmlFor="newPass">
              New Password
            </Label>
            <input
              type="password"
              name="newPass"
              id="newPass"
              disabled={!changePass}
              value={pass.newPass}
              onChange={(e) => handleChangePass(e)}
              key={pass}
            />
          </div>
          <div className="inputDiv">
            <Label $content={pass.confirmPass} htmlFor="confirmPass">
              Confirm Password
            </Label>
            <input
              type="password"
              name="confirmPass"
              id="confirmPass"
              disabled={!changePass}
              value={pass.confirmPass}
              onChange={(e) => handleChangePass(e)}
              key={pass}
            />
          </div>
          <div className="changePassButtons">
            <input
              type="submit"
              value="SUBMIT"
              onClick={(e) => handleChangePassword(e)}
            />
            <input
              type="reset"
              value="CANCEL"
              onClick={() => {
                setPass({
                  currentPass: "",
                  newPass: "",
                  confirmPass: "",
                });
                setChagePass(false);
              }}
            />
          </div>
          <p className="forgotPass">Forgot Password</p>
        </ChangePassForm>
      </AccountSetting>
      <LoginHistory>
        <h2>LOGIN HISTORY</h2>
        <table>
          <tr className="header">
            <th>DATE & TIME</th>
            <th>IP ADDRESS USED</th>
          </tr>

          {loginHistory.map((history, i) => (
            <tr className="history" key={i}>
              <td>{history.loginDate + " " + history.loginTime}</td>
              <td>{history.ipAddress}</td>
            </tr>
          ))}
        </table>
      </LoginHistory>
    </Container>
  );
};

export default Profile;

const Container = styled.div`
  height: 100%;
  overflow-y: scroll;
  background-color: var(--gray);
  display: grid;

  @media (min-width: 720px) {
    overflow-y: hidden;
    grid-template-columns: 40% 1fr;
  }
`;

const AccountSetting = styled.div`
  border: none;
  padding: 0 1em;
  font-family: "Montagu Slab", sans-serif;
  border-right: 2px solid #bfbfbf;
  display: flex;
  flex-direction: column;

  &.accountSetting .accntSetting {
    font-size: 2rem;
    margin: 0.5em 0;
    margin-bottom: 0;
    color: #8c8c8c;
  }

  & .info {
    font-size: 1.2rem;
    text-indent: 2em;
    margin: 1em 0;
  }

  & p.email {
    font-family: "Roboto", sans-serif;
    color: var(--blue);
    font-size: 1.6rem;
  }

  &.accountSetting form.usernameForm {
    margin-top: 0.6em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.2em 0;
    padding-right: 3em;
    position: relative;
    transition: all 250ms;

    &:focus-within {
      background-color: #ccd9ff;
    }

    &:hover img {
      display: unset;
    }
  }

  & img,
  & .usernameButtons img {
    width: 20px;
    height: 20px;
    margin: 0 0.5em;
    display: none;
    cursor: pointer;
    position: relative;
  }

  & .username {
    font-size: 1.3rem;
    color: var(--blue);
    background: transparent;
    outline: none;
    border: none;
    cursor: pointer;

    &:focus {
      color: black;
    }
  }

  & .changePass {
    text-align: right;
    margin-top: 1em;
    padding-top: 1em;
    cursor: pointer;
    text-decoration: underline;
    border-top: 2px solid rgba(0, 0, 0, 0.2);

    &:hover {
      color: red;
    }
  }
  & .errorPass {
    text-align: center;
    margin: 0.7em 0 0 0;
    color: red;
    text-transform: capitalize;
  }
`;

const ChangePassForm = styled.form`
  flex: 1;
  margin-top: 1em;
  display: flex;
  flex-direction: column;

  & .inputDiv {
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    margin: 1em 0;
    position: relative;
    padding: 0.3em 0.4em;
    background-color: ${(props) => (props.$changePass ? "white" : "#bfbfbf")};

    & * {
      font-size: 1.2rem;
    }

    &.inputDiv:focus-within label {
      font-size: 0.9rem;
      transform: translateY(-1.7em);
    }

    &,
    & * {
      transition: all 200ms;
    }

    & label {
      position: absolute;
    }
    & input {
      outline: none;
      border: none;
      background: transparent;
    }
  }
  & .forgotPass {
    text-align: right;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: red;
    }
  }

  & .changePassButtons {
    display: flex;
    justify-content: flex-end;
    gap: 0.5em;
    margin-bottom: 0.4em;

    &.changePassButtons input {
      padding: 0.5em 1em;
      border-radius: 0.3em;
      border: none;
      outline: none;
      cursor: pointer;
      transition: all 200ms;

      &:hover {
        background-color: #000470;
        color: white;
      }
    }
  }
`;

const Label = styled.label`
  transform: translateY(
    ${(props) => (props.$content == "" ? "0em" : "-1.7em")}
  );
`;

const LoginHistory = styled.div`
  & h2 {
    text-align: center;
    margin: 1em 0;
  }

  & * {
    font-family: "Roboto", sans-serif;
  }

  @media (min-width: 720px) {
    overflow-y: scroll;
  }

  & table {
    width: 100%;
    border-collapse: collapse;

    & tr.header {
      background: #f8f9f9;
    }

    & th,
    & td {
      padding: 0.5em 0;
      text-indent: 1em;
      text-align: left;
      cursor: crosshair;
    }

    & tr:nth-child(odd):not(.header) {
      background-color: #bfbfbf;
    }

    & tr:hover:not(.header) {
      background: #a6a6a6;
    }
  }
`;
