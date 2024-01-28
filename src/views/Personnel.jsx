import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  getPersonnel,
  searchForGuests,
  setError,
  emptyGuests,
  updateGuestAsEmployee,
  assignRoleToEmployee,
} from "../features/adminApi";
import { formatEmailToDisplay } from "../utility/textFormatter";

const Personnel = () => {
  const personnel = useSelector((state) => state.adminApi.personnel);
  const guests = useSelector((state) => state.adminApi.guests);
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [enableInput, setEnableInput] = useState(true);
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const [selectedGuest, setSelectedGuest] = useState({});
  const [selectedActionButton, setSelectedActionButton] = useState("");

  useEffect(() => {
    dispatch(getPersonnel());
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      !enableInput && inputRef.current.focus();
    }
  }, [enableInput]);

  const handleChange = async (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    let didCancel = false;
    let timeOut;

    if (!search) {
      dispatch(emptyGuests());
    }
    try {
      //supposed to cancel the timeout if the user is not done in typing or the user did not pause
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        if (searchRef.current) {
          // if the condition is true meaning there is an existing request
          searchRef.current.abort();
        }

        let response;

        setTimeout(async () => {
          //wrap the dispatch in a promise so thata await could take effect and wait for the completion
          response = await new Promise((resolve, reject) => {
            searchRef.current = dispatch(searchForGuests(search));
            searchRef.current
              .then((data) => resolve(data))
              .catch((error) => reject(error));
          });
        }, 0);

        searchRef.current = null;
      }, 20);

      if (!didCancel) {
        searchRef.current = null;
      }
    } catch (error) {
      setError(error.message);
    }

    // Cleanup function
    return () => {
      didCancel = true;
      // Abort the request when the component unmounts
      if (searchRef.current) {
        searchRef.current.abort();
      }
    };
  }, [search]);

  const handleAssignRoleOnClick = async (e, id, oldRole) => {
    if (e.target.dataset.name.toLowerCase() === oldRole.toLowerCase()) return;

    if (!id || !oldRole) {
      return;
    }

    await dispatch(assignRoleToEmployee({ id, role: e.target.dataset.name }));
    setSelectedActionButton("");
    dispatch(getPersonnel());
  };

  return (
    <Container>
      <Header>
        <h2>User Management</h2>
        <Search $isEnabled={!enableInput}>
          <input
            type="text"
            placeholder="Find Staff/Employee/Admin Via Name..."
            disabled={enableInput}
            ref={inputRef}
            value={search}
            onChange={(e) => handleChange(e)}
          />
          <img src="/images/eraser.png" alt="" onClick={() => setSearch("")} />
          {guests && (
            <SearchResult>
              {guests.map((guest) => (
                <div key={guest._id} onClick={() => setSelectedGuest(guest)}>
                  <p>{guest.username}</p>
                  <p>{guest.email}</p>
                </div>
              ))}
            </SearchResult>
          )}
        </Search>
        <button onClick={() => setEnableInput(!enableInput)}>
          {enableInput && <span>+</span>}
          {enableInput ? "Add Personnel" : "Cancel"}
        </button>
      </Header>
      <Table>
        <Wrapper>
          <thead>
            <tr>
              <td>USERNAME</td>
              <td>EMAIL</td>
              <td>ROLE</td>
              <td>ACTION</td>
            </tr>
          </thead>

          <tbody>
            <tr>
              {personnel &&
                personnel.map((user) => (
                  <td key={user._id}>
                    <p>{user.username.toUpperCase()}</p>
                    <p>{formatEmailToDisplay(user.email)}</p>
                    <p>{user.role.toUpperCase()}</p>
                    <div
                      className="actionButton btn"
                      onClick={(e) => {
                        if (
                          authUser.email.toLowerCase() ===
                          user.email.toLowerCase()
                        ) {
                          alert("Cannot Assign Role To Self");
                          return;
                        }

                        setSelectedActionButton(user._id);
                      }}
                    >
                      <img src="/images/editrole.png" alt="" />

                      {selectedActionButton === user._id && (
                        <form className="btn">
                          <p
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedActionButton("");
                            }}
                          >
                            Assign Role <span>{">>"}</span>
                          </p>
                          <ul>
                            <li
                              data-name="admin"
                              onClick={(e) =>
                                handleAssignRoleOnClick(e, user._id, user.role)
                              }
                            >
                              Admin
                            </li>
                            <li
                              data-name="employee"
                              onClick={(e) =>
                                handleAssignRoleOnClick(e, user._id, user.role)
                              }
                            >
                              Employee
                            </li>
                            <li
                              data-name="staff"
                              onClick={(e) =>
                                handleAssignRoleOnClick(e, user._id, user.role)
                              }
                            >
                              Staff
                            </li>
                            <li
                              data-name="guest"
                              onClick={(e) =>
                                handleAssignRoleOnClick(e, user._id, user.role)
                              }
                            >
                              Guest
                            </li>
                            <li>
                              <input
                                type="text"
                                placeholder="Others please specify"
                              />
                            </li>
                          </ul>
                        </form>
                      )}
                    </div>
                  </td>
                ))}
            </tr>
          </tbody>
        </Wrapper>
      </Table>
      {selectedGuest?._id && (
        <Modal>
          <div>
            <p>
              Are you sure you want to assign
              <span>{selectedGuest.username}</span>
              as <b>Employee</b>?
            </p>
            <button
              onClick={async () => {
                if (!selectedGuest || !selectedGuest?._id) {
                  return;
                }

                await dispatch(updateGuestAsEmployee(selectedGuest._id));
                dispatch(emptyGuests());
                dispatch(getPersonnel());
                setSelectedGuest({});
              }}
            >
              Yes
            </button>
            <button
              onClick={() => {
                setSelectedGuest({});
              }}
            >
              No
            </button>
          </div>
        </Modal>
      )}
    </Container>
  );
};

export default Personnel;

const Container = styled.div`
  height: 100%;
  background: var(--gray);

  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1em 0;
  padding: 0 2em;

  & h2 {
    font-size: 2rem;
    font-family: "Roboto", sans-serif;
    color: var(--grayfont);
  }

  & button {
    display: flex;
    align-items: center;
    gap: 0.3em;
    padding: 0.5em 1em;
    color: var(--blue);
    font-size: 1.125rem;
    border: none;
    border-radius: 0.5em;
    outline: none;
    cursor: pointer;
    box-shadow: 0px 4px 2px rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
    font-weight: bold;

    & span {
      font-size: 2rem;
    }
  }
`;

const Search = styled.div`
  width: 40%;
  display: flex;
  background: white;
  border-radius: 1em;
  border: ${(props) => (props.$isEnabled ? "2px solid #0099ff" : "none")};
  position: relative;

  & img {
    width: 8%;
    cursor: pointer;
  }

  & input {
    flex: 1;
    width: 100%;
    padding: 0.4em 1em;
    font-size: 1.2rem;
    border: none;
    outline: none;
    background: none;
  }
`;

const Table = styled.div`
  flex: 1;
  max-height: 800px;
  overflow: scroll;
  display: grid;
  place-items: center;
  margin-top: 3%;
`;

const Wrapper = styled.table`
  height: 90%;
  width: 75%;
  background: var(--white);
  border-collapse: collapse;
  border-radius: 1em;
  padding: 1em;
  overflow-y: hidden;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 1);

  & thead tr {
    display: flex;
    padding: 1em;
    border-bottom: 4px solid var(--gray);

    & td {
      flex: 1;
      color: var(--grayfont);
      font-family: "Roboto", sans-serif;
      font-weight: bold;
    }

    & td:last-child {
      flex: 0.5;
    }
  }

  & tbody tr {
    flex: 1;

    & td {
      display: flex;
      align-items: center;
      padding: 0.5em 1em;
      cursor: pointer;

      & p {
        flex: 1;
        overflow: hidden;
        font-size: 1rem;
        color: var(--grayfont);
        font-weight: bold;
        font-family: "Roboto", sans-serif;
      }
      & .actionButton {
        flex: 0.5;
        position: relative;

        & form {
          position: absolute;
          top: 0;
          right: 100%;
          background: white;
          box-shadow: 0 0 3px 0 #000;
          border-radius: 0.1em;
          padding: 0.4em;
          z-index: 1;

          & * {
            font-family: "Roboto", sans-serif;
          }
          & p {
            margin: 0.3em 0;
            pointer-events: all;

            & span {
              float: right;
              color: var(--blue);
            }
          }

          & ul {
            list-style: none;

            & li {
              padding: 0.3em 0.3em;
              transition: all 200ms;

              &:hover {
                background: var(--gray);
              }
            }
          }
          & input {
            border: none;
            border-bottom: 1px solid black;
            outline: none;
            padding: 0.1em;
            font-size: 0.9rem;
          }
        }
      }
    }

    & td:nth-child(even) {
      background: #e6e6e6;
    }
    & td:hover {
      background: #bfbfbf;
    }
  }
`;

const SearchResult = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0px 0px 8px 0px #000;
  border-radius: 0.2em;
  overflow: hidden;

  & div {
    display: flex;
    justify-content: space-between;
    padding: 0.7em 1em;
    cursor: pointer;

    &:hover {
      background: var(--gray);
    }
    &:hover p {
      color: var(--blue);
    }

    & p {
      font-family: "Roboto", sans-serif;
    }
  }
`;

const Modal = styled.div`
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(2px);
  display: grid;
  place-items: center;

  & div {
    padding: 2em;
    background: white;
    border-radius: 1em;

    & * {
      font-family: "Roboto", sans-serif;
      font-size: 1.2rem;
    }

    & p span {
      margin: 0 0.3em;
      text-transform: uppercase;
      color: red;
    }

    & button {
      float: right;
      width: 15%;
      padding: 0.2em 0;
      margin: 1em 0.5em 0 0.5em;
      cursor: pointer;
      border: none;
      outline: none;
      background: var(--gray);
      transition: all 200ms;
    }

    & button:hover {
      color: white;
      background: var(--blue);
    }
  }
`;
