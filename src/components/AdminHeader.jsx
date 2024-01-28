import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  getAreasAdmin,
  setSelectedAreas,
  getSearchDeceaseds,
  setError,
  setSearchEnabled,
  setSubmitSearch,
} from "../features/adminApi.js";

const AdminHeader = ({ responseRef }) => {
  const { areas, searchPage, submitSearch } = useSelector(
    (state) => state.adminApi
  );
  const [selected, setSelected] = useState(undefined);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const formRef = useRef();

  useEffect(() => {
    dispatch(getAreasAdmin());
  }, []);

  useEffect(() => {
    if (areas && areas.length) {
      setSelected(areas[0]._id);
      dispatch(setSelectedAreas(areas[0]._id));
    }
  }, [areas]);

  const handleSearch = async (e = null) => {
    e && e.preventDefault();

    if (!query) {
      return;
    }

    let didCancel = false;

    try {
      if (responseRef.current) {
        responseRef.current.abort();
      }

      let response;
      setTimeout(async () => {
        // Wrap the dispatch in a Promise to await its completion
        response = await new Promise((resolve, reject) => {
          responseRef.current = dispatch(
            getSearchDeceaseds({ query, page: searchPage })
          );
          responseRef.current
            .then((data) => resolve(data))
            .catch((error) => reject(error));
        });
      }, 0);
      dispatch(setSearchEnabled(true));
      if (!didCancel) {
        responseRef.current = null;
      }
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (!submitSearch) {
      return;
    } else {
      setTimeout(() => {
        handleSearch();
        dispatch(setSubmitSearch(null));
      }, 0);
    }
  }, [submitSearch, searchPage]);

  return (
    <Container>
      <div className="selectWrapper">
        {areas && (
          <select
            className="selectWrapper"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              dispatch(setSelectedAreas(e.target.value));
            }}
          >
            {areas.map((area) => (
              <option value={area._id} key={area._id}>
                {/* change the lawnName to areaName when there is any other type than lawn */}
                {area.lawnName}
              </option>
            ))}
          </select>
        )}
      </div>
      <form className="search" onSubmit={(e) => handleSearch(e)} ref={formRef}>
        <input
          type="text"
          name="search"
          placeholder="Search for..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button>
          <img src="/images/search.png" alt="Search" />
        </button>
      </form>
    </Container>
  );
};

export default AdminHeader;

const Container = styled.div`
  width: 100%;
  height: 7%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #ffffff;
  padding-left: 4em;

  & .selectWrapper {
    height: 70%;
    min-width: 10%;
    max-width: 200px;
    position: relative;
    display: flex;
    align-items: center;
    font-family: "Roboto", sans-seriff;
    font-weight: 500;
    font-size: 1.1rem;
    color: #8c8c8c;
    border-right: 2px solid var(--blue);
    padding-right: 2em;
    margin-right: 2em;

    & select {
      width: 100%;
      display: block;
      border: none;
      outline: none;
    }
  }

  & .search {
    display: flex;
    align-items: center;
    background-color: var(--gray);
    width: 50%;
    max-width: 500px;
    height: 70%;
    padding: 0 1em;
    border-radius: 1em;

    & input {
      flex: 1;
      display: block;
      font-size: 1rem;
      border: none;
      outline: none;
      background: transparent;
      height: 100%;
    }

    & button {
      border: none;
      outline: none;
      background: transparent;
      cursor: pointer;
    }

    & button img {
      width: 80%;
    }
  }
`;
