import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import AdminHeader from "../components/AdminHeader";
import { useSelector, useDispatch } from "react-redux";
import {
  getTableinfo,
  setError,
  setPage,
  setSearchEnabled,
  setSearchPage,
  setSubmitSearch,
  updatePlotNotWithInterment,
  updateInterment,
} from "../features/adminApi";
import { convertToISOFormat, convertToReadableFormat } from "../utility/date";

const Admin = () => {
  const {
    tableContent,
    tableContentLength,
    fetchingStatus,
    selectedAreas,
    page,
    searchEnabled,
  } = useSelector((state) => state.adminApi);
  const error = useSelector((state) => state.adminApi.error);
  const dispatch = useDispatch();

  const [pageCount, setPageCount] = useState(undefined);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [tenDataObject, setTenDataObject] = useState(null);
  const [currentButtonView, setCurrentButtonView] = useState(null);
  const [tablePage, setTablePage] = useState(1); //this will be sent to backend
  const [first5Button, setFirst5Button] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isAscending, setIsAscending] = useState(true);
  const [openAction, setOpenAction] = useState(null);
  const [openInfoForm, setOpenInfoForm] = useState(false);
  const [deceasedInfo, setDeceasedInfo] = useState({
    name: "",
    middleName: "",
    lastName: "",
    suffix: "",
    age: "",
    birthDate: "",
    deathDate: "",
    contact: "",
  });
  const [selectedPlot, setSelectedPlot] = useState({
    id: null,
    val: null,
  });

  const prevState = useRef();
  const responseRef = useRef(null);

  useEffect(() => {
    setTablePage(1);
  }, []);

  useEffect(() => {
    const handleOnBlur = (e) => {
      if (!e.target.classList.contains("editAction")) {
        setOpenAction(null);
      }
    };

    document.addEventListener("click", handleOnBlur);

    return () => {
      document.removeEventListener("click", handleOnBlur);
    };
  }, [setOpenAction]);

  useEffect(() => {
    dispatch(setPage(tablePage));
  }, [tablePage]);

  useEffect(() => {
    let didCancel = false;

    if (!selectedAreas) {
      return;
    }

    const fetchData = async () => {
      dispatch(setSearchEnabled(false));
      try {
        // Abort the previous request
        if (responseRef.current) {
          responseRef.current.abort();
        }
        let response;
        setTimeout(async () => {
          // Wrap the dispatch in a Promise to await its completion
          response = await new Promise((resolve, reject) => {
            responseRef.current = dispatch(
              getTableinfo({ areaId: selectedAreas, page, filter })
            );
            responseRef.current
              .then((data) => resolve(data))
              .catch((error) => reject(error));
          });
        }, 100);

        if (!didCancel) {
          responseRef.current = null;
        }
      } catch (error) {
        // Handle errors
        setError(error.message);
      }
    };

    // Execute fetchData function
    fetchData();

    // Cleanup function
    return () => {
      didCancel = true;
      // Abort the request when the component unmounts
      if (responseRef.current) {
        responseRef.current.abort();
      }
    };
  }, [selectedAreas, page, filter]);

  useEffect(() => {
    if (selectedAreas && tableContent && tableContent.length) {
      setPageCount(Math.ceil(tableContentLength / 10));
    }
  }, [selectedAreas, tableContent]);

  useEffect(() => {
    if (pageCount) {
      setPages(Array.from({ length: pageCount }, (_, index) => index + 1));
    }
  }, [pageCount]);

  useEffect(() => {
    if (pages.length) {
      setCurrentPage(1);
      setCurrentButtonView(1);
    }
  }, [pages]);

  useEffect(() => {
    if (currentPage) {
      const start = (currentPage - 1) * 10;
      const end = currentPage * 10;
      const slice = tableContent.slice(start, end);
      setTenDataObject(slice);
    }
  }, [currentPage, tableContent]);

  useEffect(() => {
    if (pages && currentButtonView) {
      const start = (currentButtonView - 1) * 5;
      const end = currentButtonView * 5;
      const slice = pages.slice(start, end);
      setFirst5Button(slice);
    }
  }, [pages, currentButtonView]);

  const handleSetCUrrentButtonView = (method) => {
    const maxPages = Math.ceil(pages.length / 5);
    if (method == "increment") {
      if (currentButtonView + 1 > maxPages) {
        return;
      } else {
        setCurrentButtonView((oldval) => (oldval += 1));
      }
    } else {
      if (currentButtonView - 1 < 1) {
        return;
      } else {
        setCurrentButtonView((oldval) => (oldval -= 1));
      }
    }
  };

  const handleUpdateStatus = async (e, id, status) => {
    if (e.target.dataset.value == status) {
      return;
    }
    let val;
    switch (e.target.dataset.value) {
      case "withInterment":
        val = "With Interment";
        break;
      case "saleable":
        val = "Saleable";
        break;
      case "reserve":
        val = "Reserved";
        break;
      default:
        val = "owned";
        break;
    }
    const data = {
      id,
      value: e.target.dataset.value,
    };

    const updatedObject = tenDataObject.map((obj) => {
      if (obj.plotId == id) {
        if (obj.plotStatus == "With Interment") {
          return {
            ...obj,
            deceasedName: null,
            deceasedDeathDate: null,
            deceasedContact: null,
            deceasedBornDate: null,
            plotStatus: val,
          };
        } else {
          return { ...obj, plotStatus: val };
        }
      }
      return { ...obj };
    });
    // also update in the backend
    setTenDataObject(updatedObject);
    await dispatch(updatePlotNotWithInterment(data));
  };

  const handleChange = (e) => {
    setDeceasedInfo({
      ...deceasedInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setOpenInfoForm(false);
    setDeceasedInfo({
      name: "",
      middleName: "",
      lastName: "",
      suffix: "",
      age: "",
      contact: "",
      birthDate: "",
      deathDate: "",
    });
    setSelectedPlot({ id: null, val: null });
  };

  const handleUpdateWithInterment = async (e, stat, id) => {
    e.preventDefault();
    if (stat != "withInterment") {
      setOpenInfoForm(false);
      return;
    }
    let val;
    switch (stat) {
      case "withInterment":
        val = "With Interment";
        break;
      case "saleable":
        val = "Saleable";
        break;
      case "reserve":
        val = "Reserved";
        break;
      default:
        val = "owned";
        break;
    }

    const {
      name,
      lastName,
      middleName,
      age,
      birthDate,
      deathDate,
      contact,
      suffix,
    } = deceasedInfo;
    if (!name || !lastName || !birthDate || !deathDate || !contact) {
      return;
    }

    const updatedObject = tenDataObject.map((obj) => {
      if (obj.plotId !== id) {
        return obj;
      } else {
        let formattedName = `${name} ${middleName} ${lastName}${
          suffix && suffix !== "" ? " " + suffix : ""
        }`;
        return {
          ...obj,
          deceasedName: formattedName,
          deceasedDeathDate: convertToReadableFormat(deathDate),
          deceasedContact: contact,
          deceasedBornDate: convertToReadableFormat(birthDate),
          plotStatus: val,
          rawName: name,
          rawLastName: lastName,
          rawMiddleName: middleName || null,
          rawSuffix: suffix || null,
          deceasedAge: age,
        };
      }
    });
    // also update in the backend
    const data = {
      plotId: id,
      status: stat,
      name,
      middleName,
      lastName,
      suffix,
      age,
      birthDate: convertToReadableFormat(birthDate),
      deathDate: convertToReadableFormat(deathDate),
      contact,
    };
    await dispatch(updateInterment(data));
    setTenDataObject(updatedObject);

    setOpenInfoForm(false);
    setDeceasedInfo({
      name: "",
      middleName: "",
      lastName: "",
      suffix: "",
      age: "",
      contact: "",
      birthDate: "",
      deathDate: "",
    });
    setSelectedPlot({ id: null, val: null });
  };

  return (
    <Container>
      <InfoForm $show={openInfoForm}>
        <form>
          <h2>Deceased Information</h2>
          <div className="inputDiv">
            <input
              type="text"
              placeholder="First Name"
              name="name"
              value={deceasedInfo.name}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Middle Name"
              name="middleName"
              value={deceasedInfo.middleName}
              onChange={handleChange}
            />
          </div>
          <div className="inputDiv">
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={deceasedInfo.lastName}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Suffix"
              name="suffix"
              value={deceasedInfo.suffix}
              onChange={handleChange}
            />
          </div>
          <div className="inputDiv">
            <input
              type="number"
              placeholder="Age"
              name="age"
              value={deceasedInfo.age}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="+639 **********"
              name="contact"
              value={deceasedInfo.contact}
              onChange={handleChange}
            />
          </div>
          <div className="inputDiv">
            <div>
              <label htmlFor="birtDate">Birthday</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={deceasedInfo.birthDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="deathDate">Death</label>
              <input
                type="date"
                name="deathDate"
                value={deceasedInfo.deathDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="buttons">
            <button
              type="submit"
              onClick={(e) => {
                handleUpdateWithInterment(e, selectedPlot.val, selectedPlot.id);
              }}
            >
              DONE
            </button>
            <button type="button" onClick={handleCancel}>
              CANCEL
            </button>
          </div>
        </form>
      </InfoForm>
      <AdminHeader responseRef={responseRef} />
      <p>Grave Information</p>
      <Buttons>
        <div className="button">
          <img src="/images/filter.png" alt="Filter" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="owned">Owned</option>
            <option value="reserve">Reserved</option>
            <option value="saleable">Saleable</option>
            <option value="withInterment">With Interment</option>
          </select>
        </div>
        <div className="button" onClick={() => setIsAscending(!isAscending)}>
          <img src="/images/sort.png" alt="Add" />
          <p>{isAscending ? "Desc" : "Asc"}</p>
        </div>
      </Buttons>
      <InfoTable $length={tenDataObject}>
        {fetchingStatus === "idle" && (
          <div className="header">
            <p>Plot</p>
            <p>Status</p>
            {tenDataObject && tenDataObject[0]?.area && (
              <p className="area">Area</p>
            )}
            <p className="name">Name</p>
            <p>Contact</p>
            {/* <p>Interment</p> */}
            <p>Born</p>
            <p>Died</p>
            <p>Action</p>
          </div>
        )}
        {selectedAreas &&
          (fetchingStatus === "loading" ? (
            <div className="fetching">
              <div className="spinner"></div>
              <h3>Fetching Data...</h3>
            </div>
          ) : (
            tenDataObject &&
            (isAscending
              ? tenDataObject.map((obj) => (
                  <Body
                    className="body"
                    key={obj.plotId}
                    $selected={obj.plotId == openAction}
                  >
                    <p>{obj.plotName}</p>
                    <p>{obj.plotStatus}</p>
                    {obj.area && <p className="area">{obj.area?.areaName}</p>}
                    <p className="name">{obj?.deceasedName || "unavailable"}</p>
                    <p>{obj?.deceasedContact || "unavailable"}</p>
                    <p>{obj?.deceasedBornDate || "unavailable"}</p>
                    <p>{obj?.deceasedDeathDate || "unavailable"}</p>
                    <div className="lastChild">
                      <img
                        src="/images/edit-admin.png"
                        className="editAction"
                        alt="Edit"
                        onClick={() => setOpenAction(obj.plotId)}
                      />
                      <div
                        className="actionModal"
                        style={{
                          display:
                            openAction && openAction == obj.plotId
                              ? "unset"
                              : "none",
                        }}
                      >
                        <p className="markAs">Mark As:</p>
                        <p
                          data-value="withInterment"
                          onClick={(e) => {
                            if (obj.plotStatus == "With Interment") {
                              setDeceasedInfo({
                                name: obj.rawName,
                                middleName: obj.rawMiddleName || "",
                                lastName: obj.rawLastName,
                                suffix: obj.rawSuffix || "",
                                age: obj.deceasedAge,
                                contact: obj.deceasedContact,
                                birthDate: convertToISOFormat(
                                  obj.deceasedBornDate
                                ),
                                deathDate: convertToISOFormat(
                                  obj.deceasedDeathDate
                                ),
                              });
                            }
                            setOpenInfoForm(true);
                            setSelectedPlot({
                              id: obj.plotId,
                              val: e.target.dataset.value,
                            });
                          }}
                        >
                          With Interment
                        </p>
                        <p
                          data-value="saleable"
                          onClick={(e) =>
                            handleUpdateStatus(e, obj.plotId, obj.plotStatus)
                          }
                        >
                          Saleable
                        </p>
                        <p
                          data-value="reserve"
                          onClick={(e) =>
                            handleUpdateStatus(e, obj.plotId, obj.plotStatus)
                          }
                        >
                          Reserved
                        </p>
                        <p
                          data-value="owned"
                          onClick={(e) =>
                            handleUpdateStatus(e, obj.plotId, obj.plotStatus)
                          }
                        >
                          Owned
                        </p>
                      </div>
                    </div>
                  </Body>
                ))
              : tenDataObject &&
                [...tenDataObject].reverse().map((obj) => (
                  <Body
                    className="body"
                    key={obj.plotId}
                    $selected={obj.plotId == openAction}
                  >
                    <p>{obj.plotName}</p>
                    <p>{obj.plotStatus}</p>
                    {obj.area && <p className="area">{obj.area?.areaName}</p>}
                    <p className="name">{obj?.deceasedName || "unavailable"}</p>
                    <p>{obj?.deceasedContact || "unavailable"}</p>
                    {/* <p>
                      {convertToReadableFormat(obj?.deceasedBornDate) ||
                        "unavailable"}
                    </p>
                    <p>
                      {convertToReadableFormat(obj?.deceasedDeathDate) ||
                        "unavailable"}
                    </p> */}
                    <p>{obj?.deceasedBornDate || "unavailable"}</p>
                    <p>{obj?.deceasedDeathDate || "unavailable"}</p>
                    <div className="lastChild">
                      <img
                        src="/images/edit-admin.png"
                        className="editAction"
                        alt="Edit"
                        onClick={() => setOpenAction(obj.plotId)}
                      />
                      <div
                        className="actionModal"
                        style={{
                          display:
                            openAction && openAction == obj.plotId
                              ? "unset"
                              : "none",
                        }}
                      >
                        <p className="markAs">Mark As:</p>
                        <p
                          data-value="withInterment"
                          onClick={(e) => {
                            if (obj.plotStatus == "With Interment") {
                              setDeceasedInfo({
                                name: obj.rawName,
                                middleName: obj.rawMiddleName || "",
                                lastName: obj.rawLastName,
                                suffix: obj.rawSuffix || "",
                                age: obj.deceasedAge,
                                contact: obj.deceasedContact,
                                birthDate: convertToISOFormat(
                                  obj.deceasedBornDate
                                ),
                                deathDate: convertToISOFormat(
                                  obj.deceasedDeathDate
                                ),
                              });
                            }
                            setOpenInfoForm(true);
                            setSelectedPlot({
                              id: obj.plotId,
                              val: e.target.dataset.value,
                            });
                          }}
                        >
                          With Interment
                        </p>
                        <p
                          data-value="saleable"
                          onClick={(e) =>
                            handleUpdateStatus(e, obj.plotId, obj.plotStatus)
                          }
                        >
                          Saleable
                        </p>
                        <p
                          data-value="reserve"
                          onClick={(e) =>
                            handleUpdateStatus(e, obj.plotId, obj.plotStatus)
                          }
                        >
                          Reserved
                        </p>
                        <p
                          data-value="owned"
                          onClick={(e) =>
                            handleUpdateStatus(e, obj.plotId, obj.plotStatus)
                          }
                        >
                          Owned
                        </p>
                      </div>
                    </div>
                  </Body>
                )))
          ))}
      </InfoTable>
      {tenDataObject && tenDataObject.length && fetchingStatus === "idle" ? (
        <p className="plotTotal">Total Plot {tableContentLength}</p>
      ) : (
        <p></p>
      )}
      {pages.length &&
      tableContent &&
      tableContent.length &&
      fetchingStatus === "idle" ? (
        <PaginationButton>
          <div
            className="arrow"
            onClick={() => handleSetCUrrentButtonView("decrement")}
          >
            <img src="/images/back-admin.png" alt="Back" />
          </div>

          {first5Button.map((btn) => (
            <div
              className="number"
              key={btn}
              onClick={(e) => {
                if (!searchEnabled) {
                  if (parseInt(btn) === page) {
                    return;
                  }
                  setTablePage(parseInt(btn));
                } else {
                  dispatch(setSearchPage(parseInt(btn)));
                  dispatch(setSubmitSearch(true));
                }
              }}
            >
              <p>{btn}</p>
            </div>
          ))}
          <div
            className="arrow"
            onClick={() => handleSetCUrrentButtonView("increment")}
          >
            <img src="/images/next-admin.png" alt="Next" />
          </div>
        </PaginationButton>
      ) : (
        <p></p>
      )}
    </Container>
  );
};

export default Admin;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const InfoForm = styled.div`
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(2px);
  z-index: 5;
  display: ${(props) => (props.$show ? "grid" : "none")};
  place-items: center;

  & form {
    padding: 1em;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 1em;

    & * {
      font-family: "Roboto", sans-serif;
    }

    & h2 {
      font-weight: 800;
    }

    & .inputDiv {
      width: 100%;
      display: flex;
      gap: 1em;
      justify-content: space-between;

      & input {
        outline: none;
        border: 1px solid black;
        padding: 0.3em 0.5em;
        font-size: 1rem;
      }

      & div {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }

    & .buttons {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      gap: 0.4em;

      & button {
        width: 20%;
        padding: 0.5em 0;
        cursor: pounter;
        font-size: 1rem;
        font-weight: 800;
        color: #595959;
      }
    }
  }
`;

const Container = styled.div`
  wdith: 100%;
  background-color: var(--gray);
  display: flex;
  flex-direction: column;

  & > p {
    margin: 0.8em 1.3em;
    font-family: "Roboto", sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: #737373;
  }

  & .plotTotal {
    font-size: 1rem;
    color: var(--blue);
  }
`;

const Buttons = styled.div`
  display: flex;
  padding: 0 1.3em;

  & .button {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.4em 0.8em;
    background-color: #ffffff;
    border-radius: 0.7em;
    &:first-child {
      margin-right: 1em;
    }

    & > p {
      font-family: "Roboto", sans-serif;
      colro: var(--blue);
      font-size: 1.2rem;
      margin: 0 0.5em;
    }

    & select {
      border: none;
      margin: none;
      outline: none;
      font-size: 1rem;
      text-align: center;
    }
  }
`;

const InfoTable = styled.div`
  overflow: visible;
  background-color: #ffffff;
  flex: 1;
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  & * {
    font-family: "Roboto", sans-serif;
    font-size: 1rem;
  }
  & .header {
    display: flex;
    align-items: center;
    border-bottom: 2px solid var(--gray);
    padding: 0.5em;
    &.header p:first-child {
      flex: 0.5;
    }
    &.header p {
      flex: 1;
      color: var(--grayfont);
      font-weight: bold;
    }
    &.header .area {
      flex: 0.5;
    }
    &.header p.name {
      flex: 1.2;
    }
    &.header p:last-child {
      flex: 0.5;
    }
  }

  & .body {
    display: flex;
    align-items: center;
    border-bottom: 2px solid var(--gray);
    padding: 0.5em;

    &.body:hover p {
      color: white;
    }

    &.body p:first-child {
      flex: 0.5;
    }
    &.body p:nth-child(2) {
      text-transform: uppercase;
    }
    &.body p {
      flex: 1;
      font-weight: bold;
    }
    &.body .area {
      flex: 0.5;
    }
    &.body p.name {
      flex: 1.2;
    }
    &.body:hover {
      background: dodgerblue;
    }
    &.body .lastChild {
      flex: 0.5;
      position: relative;
      z-index: 2;
      cursor: pointer;

      & .actionModal {
        position: absolute;
        right: 105%;
        width: max-content;
        top: 0.5em;
        background: white;
        padding: 0.5em;
        box-shadow: 0px 0px 3px black;
        z-index: 1;

        & p.markAs,
        & p {
          color: var(--blue);
          text-transform: uppercase;
          padding: 0.3em;
          transition: all 150ms linear;
        }
        & p {
          color: black;
          cursor: pointer;
          &:hover {
            background: var(--yellow);
            color: var(--blue);
          }
        }
      }
    }
  }

  & .fetching {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    & h3 {
      font-size: 2rem;
    }

    & .spinner {
      border: 4px solid rgba(0, 0, 0, 0.3);
      border-left: 4px solid var(--blue);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: ${spinAnimation} 1s linear infinite;
      margin-right: 1em;
    }
  }
`;

const Body = styled.div`
  background: ${(props) => (props.$selected ? "dodgerblue" : "transparent")};
  &.body:nth-child(even) {
    background: ${(props) => (props.$selected ? "dodgerblue" : "#f2f2f2")};
  }
  &.body p {
    color: ${(props) => (props.$selected ? "white" : "var(--grayfont)")};
  }
`;

const PaginationButton = styled.div`
  margin: 2em 0;
  display: flex;
  align-items: center;
  justify-content: center;

  & div {
    padding: 0.5em;
    background-color: #ffffff;
    border-radius: 50%;
    display: grid;
    place-items: center;
    cursor: pointer;
    margin: 0 0.5em;
  }

  & .number p {
    font-size: 25px;
    width: 25px;
    height: 25px;
    text-align: center;
  }

  & .number:hover p {
    color: red;
  }
`;
