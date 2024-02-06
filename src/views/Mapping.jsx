import React, { useCallback, useEffect, useRef, useState } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import styled, { keyframes } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  searchQuery,
  getPlotInfo,
  reset,
  resetLawn,
  clearAreaPlots,
} from "../features/restApiSlice";

import { useNavigate, useLocation } from "react-router-dom";

import NoSelectedMap from "../components/NoSelectedMap";
import Lawn1 from "../components/Lawn1";
import Lawn2 from "../components/Lawn2";
import Lawn3 from "../components/Lawn3";
import Lawn4 from "../components/Lawn4";

const Mapping = () => {
  const location = useLocation();
  const mappingRef = useRef(0);
  const maps = ["NoSelected", "Lawn1", "Lawn2", "Lawn3", "Lawn4"];
  const [mapIndex, setMapIndex] = useState(0);

  const [showSearch, setShowSearch] = useState(false);
  const [showSideBar, setShowSidebar] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [mapLoading, setmapLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showLegend, setShowLegend] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const searchResult = useSelector((state) => state.restApi.searchResult);
  const searchStatus = useSelector((state) => state.restApi.searchStatus);
  const plotInfo = useSelector((state) => state.restApi.plotInfo);
  const areaPlotsStatus = useSelector(
    (state) => state.restApi.areaPlotsLoading
  );
  const [disableLegendNav, setDisableLegendNav] = useState(false);

  // set the selectedMap dynamically
  const [map, setMap] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);

  const particlesInit = useCallback(async (engine) => {
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    //await loadFull(engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  // everytime the map changes clear the area plots
  useEffect(() => {
    dispatch(clearAreaPlots());
  }, [map]);

  // reset the state when page changes
  useEffect(() => {
    dispatch(reset());
  }, [location.pathname]);

  useEffect(() => {
    if (!user?.token || !user?.email) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    if (!showBottomBar || !showSideBar) {
      setShowSearch(false);
    }
  }, [showBottomBar, showSideBar]);
  useEffect(() => {
    if (showBottomBar || showSideBar) {
      setShowSearch(true);
    }
  }, [showBottomBar, showSideBar]);

  useEffect(() => {
    if (mappingRef.current) {
      setMap(maps[mapIndex]);
    }
  }, [mapIndex, mappingRef.current]);

  // put a delay before setting the loading to falase

  const showMap = useCallback(async () => {
    if (mappingRef.current) {
      setTimeout(() => {
        setmapLoading(false);
      }, 1200);
    }
  }, [mappingRef.current]);

  useEffect(() => {
    showMap();
  }, [showMap]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!query) {
      return;
    }

    await dispatch(searchQuery(query));
  };

  const handleSetMap = async (lawn, plot) => {
    await dispatch(getPlotInfo(plot));
    setSelectedPlot(plot);
    setMap(lawn);
  };

  const handleSwitchRenderMap = () => {
    switch (map) {
      case "Lawn1":
        return (
          <Lawn1
            key={map}
            selectedPlot={selectedPlot}
            setSelectedPlot={setSelectedPlot}
            map={map}
          />
        );
      case "Lawn2":
        return (
          <Lawn2
            key={map}
            selectedPlot={selectedPlot}
            setSelectedPlot={setSelectedPlot}
            map={map}
          />
        );
      case "Lawn3":
        return (
          <Lawn3
            key={map}
            selectedPlot={selectedPlot}
            setSelectedPlot={setSelectedPlot}
            map={map}
          />
        );
      case "Lawn4":
        return (
          <Lawn4
            key={map}
            selectedPlot={selectedPlot}
            setSelectedPlot={setSelectedPlot}
            map={map}
          />
        );
      // ad the other lawn here
      default:
        return <NoSelectedMap />;
    }
  };

  const togglegend = () => {
    setShowLegend(!showLegend);
  };

  const next = () => {
    if (areaPlotsStatus == "loading") {
      return;
    }
    if (mapIndex == maps.length - 1) {
      return;
    } else {
      setMapIndex((oldVal) => oldVal + 1);
    }
  };
  const prev = () => {
    if (areaPlotsStatus == "loading") {
      return;
    }
    if (mapIndex == 0) {
      return;
    } else {
      setMapIndex((oldVal) => oldVal - 1);
    }
  };

  const gotoFirst = () => {
    if (areaPlotsStatus == "loading") {
      return;
    }
    setMapIndex(0);
  };

  const gotoLast = () => {
    if (areaPlotsStatus == "loading") {
      return;
    }
    setMapIndex(maps.length - 1);
  };

  useEffect(() => {
    setmapLoading(false);
    dispatch(resetLawn());
  }, [map]);

  // render different file that represents different map
  // default is noselected map
  return (
    <Container ref={mappingRef}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "white",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#000000",
            },
            links: {
              color: "#000000",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 6,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 2,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "edge",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
      {mapLoading ? (
        <Loading>
          <h1>Loading...</h1>
        </Loading>
      ) : (
        <>
          {handleSwitchRenderMap()}
          <Legend>
            {showLegend ? (
              <>
                <div className="buttons">
                  <img
                    src="/images/gotofirst.png"
                    alt="GotoFirst"
                    onClick={gotoFirst}
                  />
                  <img src="/images/prev.png" alt="Previous" onClick={prev} />
                  <img src="/images/next.png" alt="Next" onClick={next} />
                  <img
                    src="/images/gotolast.png"
                    alt="GotoLast"
                    onClick={gotoLast}
                  />
                  <img
                    src="/images/minimize.png"
                    alt="Minimize"
                    onClick={togglegend}
                  />
                </div>
                <div className="legends">
                  <div className="desc">
                    <div className="reserve"></div>
                    <p>Reserve</p>
                  </div>
                  <div className="desc">
                    <div className="saleable"></div>
                    <p>Saleable</p>
                  </div>
                  <div className="desc">
                    <div className="owned"></div>
                    <p>Owned</p>
                  </div>
                  <div className="desc">
                    <div className="withInterment"></div>
                    <p>With Interment</p>
                  </div>
                </div>
              </>
            ) : (
              <img
                src="/images/maximize.png"
                alt="Maximize"
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
                onClick={togglegend}
              />
            )}
          </Legend>
        </>
      )}
      <SideBarForTabletAndDesktop $showSideBar={showSideBar}>
        {!mapLoading && (
          <SlideArrow $showSideBar={showSideBar}>
            <img
              src={`/images/${showSideBar ? "arrowleft" : "arrowright"}.png`}
              alt="Slide"
              className="slideimg"
              onClick={() => setShowSidebar(!showSideBar)}
            />
          </SlideArrow>
        )}
        <Wrapper
          style={{ paddingTop: `${!showSearch ? "1em" : 0}` }}
          $detail={plotInfo}
        >
          <img
            src="/images/searchbtn.png"
            alt="Search"
            className="open"
            style={{ display: `${showSearch ? "none" : "unset"}` }}
            onClick={() => setShowSearch(true)}
          />
          {showSearch && (
            <div className="search">
              <form onSubmit={(e) => handleSearchSubmit(e)}>
                <input
                  type="text"
                  name="search"
                  id=""
                  placeholder="Search for names..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={searchStatus == "loading"}
                />
                <img
                  className="close"
                  src="/images/closebtn.png"
                  alt="Close"
                  onClick={() => setShowSearch(false)}
                />
              </form>
              {plotInfo && showSideBar && (
                <div className="searchMatched">
                  {plotInfo.plotStatus == "withInterment" ? (
                    <>
                      <p className="row">
                        <span className="name">Name:</span>
                        {plotInfo.name}
                      </p>
                      <p className="row">
                        <span className="age">Age:</span>
                        {plotInfo.age}
                      </p>
                      <p className="row">
                        <span className="born">Born:</span>
                        {plotInfo.birthDate}
                      </p>
                      <p className="row">
                        <span className="died">Died:</span>
                        {plotInfo.deathDate}
                      </p>
                      <p className="row">
                        <span className="plot">Plot:</span>
                        {plotInfo.plotName}
                      </p>
                      <p className="row">
                        <span className="loc">Location:</span>
                        {plotInfo.lawn}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="row">
                        <span className="plot">Plot:</span>
                        {plotInfo.plotName}
                      </p>
                      <p className="row">
                        <span className="stat">Status:</span>
                        {plotInfo.plotStatus}
                      </p>
                      <p className="row">
                        <span className="loc">Loc:</span>
                        {plotInfo.lawn}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          <SearchResults $show={showSideBar}>
            {searchStatus == "loading" ? (
              <SearchLoading $showSideBar={showSideBar}>
                <img src="/images/logo.png" alt="Logo" />
                <p>Loading..</p>
              </SearchLoading>
            ) : (
              <>
                {searchResult.length ? (
                  searchResult.map((result, index) => (
                    <Result
                      $showSideBar={showSideBar}
                      key={index}
                      onClick={() => {
                        handleSetMap(result.lawn, result.plotId);
                        setShowSidebar(false);
                        setShowBottomBar(false);
                        setShowSearch(false);

                        setMapIndex(maps.indexOf(result.lawn));
                      }}
                    >
                      <p className="row">
                        <span className="name">Name:</span>
                        {result?.name}
                      </p>
                      <p className="row">
                        <span className="born">Born:</span>
                        {result?.birthDate}
                      </p>
                      <p className="row">
                        <span className="died">Died:</span>
                        {result?.deathDate}
                      </p>
                      <p className="row">
                        <span className="lawn">Loc:</span>
                        {result?.lawn}
                      </p>
                    </Result>
                  ))
                ) : (
                  <>
                    {searchStatus == "done" ? (
                      <p className="noMatched">No people matches the search</p>
                    ) : (
                      <p className="noMatched">Search death records</p>
                    )}
                  </>
                )}
              </>
            )}
          </SearchResults>
        </Wrapper>
      </SideBarForTabletAndDesktop>
      <BottomBarForMobile $showBottomBar={showBottomBar}>
        <Wrapper
          style={{ paddingTop: `${!showSearch ? "1em" : 0}` }}
          $detail={plotInfo}
        >
          <div
            className="drag"
            onClick={() => setShowBottomBar(!showBottomBar)}
          ></div>

          <img
            src="/images/searchbtn.png"
            alt="Search"
            className="open"
            style={{ display: `${showSearch ? "none" : "unset"}` }}
            onClick={() => setShowSearch(true)}
          />
          {showSearch && (
            <div className="search">
              <form onSubmit={(e) => handleSearchSubmit(e)}>
                <input
                  type="text"
                  name="search"
                  id=""
                  placeholder="Search for names..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={searchStatus == "loading"}
                />
                <img
                  className="close"
                  src="/images/closebtn.png"
                  alt="Close"
                  onClick={() => setShowSearch(false)}
                />
              </form>
              {plotInfo && showBottomBar && (
                <div className="searchMatched">
                  {plotInfo.plotStatus == "withInterment" ? (
                    <>
                      <p className="row">
                        <span className="name">Name:</span>
                        {plotInfo.name}
                      </p>
                      <p className="row">
                        <span className="age">Age:</span>
                        {plotInfo.age}
                      </p>
                      <p className="row">
                        <span className="born">Born:</span>
                        {plotInfo.birthDate}
                      </p>
                      <p className="row">
                        <span className="died">Died:</span>
                        {plotInfo.deathDate}
                      </p>
                      <p className="row">
                        <span className="plot">Plot:</span>
                        {plotInfo.plotName}
                      </p>
                      <p className="row">
                        <span className="loc">Location:</span>
                        {plotInfo.lawn}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="row">
                        <span className="plot">Plot:</span>
                        {plotInfo.plotName}
                      </p>
                      <p className="row">
                        <span className="stat">Status:</span>
                        {plotInfo.plotStatus}
                      </p>
                      <p className="row">
                        <span className="loc">Loc:</span>
                        {plotInfo.lawn}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          <SearchResults $show={showBottomBar}>
            {searchStatus == "loading" ? (
              <SearchLoading $showSideBar={showBottomBar}>
                <img src="/images/logo.png" alt="Logo" />
                <p>Loading..</p>
              </SearchLoading>
            ) : (
              <>
                {searchResult.length ? (
                  searchResult.map((result, index) => (
                    <Result
                      $showSideBar={showBottomBar}
                      key={index}
                      onClick={() => {
                        handleSetMap(result.lawn, result.plotId);
                        setShowSidebar(false);
                        setShowBottomBar(false);
                        setShowSearch(false);

                        setMapIndex(maps.indexOf(result.lawn));
                      }}
                    >
                      <p className="row">
                        <span className="name">Name:</span>
                        {result?.name}
                      </p>
                      <p className="row">
                        <span className="born">Born:</span>
                        {result?.birthDate}
                      </p>
                      <p className="row">
                        <span className="died">Died:</span>
                        {result?.deathDate}
                      </p>
                      <p className="row">
                        <span className="lawn">Loc:</span>
                        {result?.lawn}
                      </p>
                    </Result>
                  ))
                ) : (
                  <>
                    {searchStatus == "done" ? (
                      <p className="noMatched">No people matches the search</p>
                    ) : (
                      <p className="noMatched">Search death records</p>
                    )}
                  </>
                )}
              </>
            )}
          </SearchResults>
        </Wrapper>
      </BottomBarForMobile>
    </Container>
  );
};

export default Mapping;

const scaleAnimation = keyframes`
  0%{
    scale: 1;
  }
  50%{
    scale: 1.2
  }
  100%{
    scale: 1;
  }
`;

const Container = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow-y: hidden;
  background: #f2f2f8;
  z-index: 3;

  & #tsparticles {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
`;

const Legend = styled.div`
  position: absolute;
  width: auto;
  max-width: 200px;
  height: auto;
  max-height: 300px;
  background-color: white;
  z-index: 10;
  top: 1em;
  right: 1em;
  box-shadow: -2px 2px 5px 1px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: -2px 2px 5px 1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: -2px 2px 5px 1px rgba(0, 0, 0, 0.75);
  display: grid;
  place-items: center;
  transition: all 150ms;

  & .buttons img {
    width: 20px;
    height: 20px;
    margin: 1em 0.5em;
    cursor: pointer;

    &:hover {
      scale: 1.2;
    }
  }

  & .legends {
    padding: 0.5em;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    & .desc {
      display: flex;
      align-items: center;

      & p {
        font-family: "Roboto", sans-serf;
        font-size: 0.9rem;
      }

      & div {
        width: 20px;
        height: 10px;
        margin-right: 0.5em;
      }
      & .reserve {
        background-color: #e6e600;
      }
      & .saleable {
        background-color: #b3b3b3;
      }
      & .owned {
        background-color: #008000;
      }
      & .withInterment {
        background-color: #004d99;
      }
    }
  }
`;

const Loading = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-30%, -50%);

  & h1 {
    font-size: 3rem;
    font-family: "Roboto", sans-serif;
  }
`;

const SideBarForTabletAndDesktop = styled.div`
  width: ${(props) => (props.$showSideBar ? "60%" : "0px")};
  max-width: 500px;
  height: 100%;
  border: 1px solid black;
  position: absolute;
  left: 0;
  bottom: 0;
  overflow-y: ${(props) => (props.$showSideBar ? "scroll" : "visible")};
  background-color: var(--blue);
  display: flex;
  flex-direction: column;
  transition: all 250ms;
  z-index: 10;

  &::-webkit-scrollbar {
    display: unset;
    width: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--yellow);
  }

  @media (max-width: 530px) {
    display: none;
  }
`;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;

  & img.open {
    width: 35px;
    padding: 0.2em;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 0.3em;
    right: 0.3em;
    cursor: pointer;
  }

  & .search {
    width: 99%;
    height: 40%;
    background: url(/images/image7.png) center / cover;
    margin: auto;
    position: relative;
    top: 0.2em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: ${(props) =>
      props.$detail ? "space-evenly" : "flex-start"};
    padding-top: 1em;

    & form {
      width: 92%;
      height: 3em;
      background-color: #ffffff;
      border-radius: 1em;
      padding: 0 0.7em;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;

      & input {
        flex: 1;
        height: 100%;
        border: none;
        padding-left: 1em;
        font-size: 1.1rem;

        &:focus {
          outline: none;
        }
      }

      & img.close {
        height: 80%;
        cursor: pointer;
      }
    }
    & .searchMatched {
      width: 98%;
      height: 70%;
      background: white;
      z-index: 40;
      border-radius: 0.5em;
      display: flex;
      flex-direction: column;
      background-color: #d9d9d9;

      & p:nth-child(even) {
        background-color: #f2f2f2;
      }

      & p {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 0 1em;
        text-transform: capitalized;
        font-family: "Roboto", sans-serif;
        font-weight: 500;

        & span:first-child {
          flex-basis: 20%;
          font-weight: 600;
          color: #8c8c8c;
        }
      }
    }
  }
`;
const SearchResults = styled.div`
  min-height: 60%;
  width: 100%;
  margin-top: 1em;
  padding-bottom: 1.5em;
  position: relative;

  & .noMatched {
    color: white;
    font-size: 1.3rem;
    font-family: "Roboto", sans-seif;
    text-align: center;
    margin: 2em 0;
    display: ${(props) => (props.$show ? "block" : "none")};
  }
`;

const SearchLoading = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: ${(props) => (props.$showSideBar ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  animation: ${scaleAnimation} 5s linear infinite;

  & img {
    width: 150%;
  }
  & p {
    color: white;
    font-family: "Roboto", sans-serif;
    font-size: 1.4rem;
  }
`;

const Result = styled.div`
  background-color: #f2f2f8;
  width: 98%;
  display: ${(props) => (props.$showSideBar ? "flex" : "none")};
  flex-direction: column;
  margin: 1em auto;
  border-radius: 0.5em;
  cursor: pointer;
  overflow: hidden;
  transition: scale 150ms;

  &:hover {
    scale: 0.95;
  }

  & p:nth-child(even) {
    background-color: #f2f2f2;
  }

  & p {
    display: flex;
    align-items: center;
    padding: 0.6em 1em;
    text-transform: capitalized;
    font-family: "Roboto", sans-serif;
    font-weight: 500;

    & span:first-child {
      flex-basis: 20%;
      font-weight: 600;
      color: #8c8c8c;
    }
  }
`;

const SlideArrow = styled.div`
  width: 35px;
  height: 35px;
  background-color: var(--yellow);
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${(props) => (props.$showSideBar ? "10px" : "0")};
  border-bottom-left-radius: ${(props) => (props.$showSideBar ? "10px" : "0")};
  border-top-right-radius: ${(props) => (!props.$showSideBar ? "10px" : "0")};
  border-bottom-right-radius: ${(props) =>
    !props.$showSideBar ? "10px" : "0"};
  position: absolute;
  z-index: 4;
  top: 50%;
  right: ${(props) => (props.$showSideBar ? "0" : "-35px")};
  transform: translatey(50%);
  z-index: 1;

  & img.slideimg {
    width: 90%;
    height: 90%;
  }
`;

const BottomBarForMobile = styled.div`
  position: absolute;
  width: 100%;
  height: ${(props) => (props.$showBottomBar ? "90%" : "0")};
  padding-top: ${(props) => (props.$showBottomBar ? "1.5em" : "1em")};
  bottom: 0;
  background-color: var(--blue);
  overflow-y: ${(props) => (props.$showBottomBar ? "scroll" : "visible")};
  transition: all 150ms;
  z-index: 10;

  @media (min-width: 530px) {
    display: none;
  }

  .drag {
    width: 10%;
    height: 4px;
    border-radius: 2px;
    background-color: #f2f2f8;
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
  }
`;
