import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  getLawn,
  getPlotInfo,
  clearAreaPlots,
  getAreaPlots,
} from "../features/restApiSlice";
import LoadingScreen from "./LoadingScreen";

const Lawn3 = ({ selectedPlot, setSelectedPlot, map }) => {
  const frame1Ref = useRef();
  const frame2Ref = useRef();
  const containerRef = useRef();
  const mappingRef = useRef();

  // push the divs directly to this array instead of passing it in a ref
  const plotArr = [];

  const [showFrame1Plots, setShowFrame1Plots] = useState(false);
  const [showFrame2Plots, setShowFrame2Plots] = useState(false);
  const [showFrames, setShowFrames] = useState(false);
  const [lawn3Plots, setLawn3Plots] = useState(null);

  const dispatch = useDispatch();
  const areaPlots = useSelector((state) => state.restApi.areaPlots);

  const [plotFrame1Size, setPlotFrame1Size] = useState({
    width: 0,
    height: 0,
  });
  const [plotFrame2Size, setPlotFrame2Size] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    dispatch(clearAreaPlots());
    dispatch(getAreaPlots("Lawn3"));
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setShowFrames(true);
    }
  }, [areaPlots]);

  useEffect(() => {
    const setRef = () => {
      if (frame1Ref.current) {
        setShowFrame1Plots(true);
        setPlotFrame1Size({
          width: frame1Ref.current.clientWidth / 17,
          height: frame1Ref.current.clientHeight / 11,
        });
      }

      if (frame2Ref.current) {
        setShowFrame2Plots(true);
        setPlotFrame2Size({
          width: frame2Ref.current.clientWidth / 15,
          height: frame2Ref.current.clientHeight / 12,
        });
      }
    };

    const callInitialFunctions = () => {
      setRef();
    };

    callInitialFunctions();

    window.addEventListener("resize", callInitialFunctions);

    return () => {
      window.removeEventListener("resize", callInitialFunctions);
    };
  }, [frame1Ref.current, frame2Ref.current]);

  const frame1Row1 = Array.from({ length: 17 });
  const frame1Row2 = Array.from({ length: 17 });
  const frame1Row3 = Array.from({ length: 16 });
  const frame1Row4 = Array.from({ length: 16 });
  const frame1Row5 = Array.from({ length: 16 });
  const frame1Row6 = Array.from({ length: 16 });
  const frame1Row7 = Array.from({ length: 16 });
  const frame1Row8 = Array.from({ length: 16 });
  const frame1Row9 = Array.from({ length: 16 });
  const frame1Row10 = Array.from({ length: 16 });

  const frame2Row1 = Array.from({ length: 14 });
  const frame2Row2 = Array.from({ length: 15 });
  const frame2Row3 = Array.from({ length: 15 });
  const frame2Row4 = Array.from({ length: 15 });
  const frame2Row5 = Array.from({ length: 15 });
  const frame2Row6 = Array.from({ length: 15 });
  const frame2Row7 = Array.from({ length: 15 });
  const frame2Row8 = Array.from({ length: 15 });
  const frame2Row9 = Array.from({ length: 15 });
  const frame2Row10 = Array.from({ length: 15 });
  const frame2Row11 = Array.from({ length: 1 });

  const renderRow = (arr = [], plotNum = 0, frame, margin = 0) => {
    const width = frame.width * arr.length;
    const height = frame.height;
    const marginLeft = margin ? margin * frame.width : 0;
    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          display: "flex",
          marginLeft: `${marginLeft}px`,
        }}
      >
        {arr.map((plot, index) => {
          return (
            <Plot
              data-name={isNaN(parseInt(plotNum)) ? plotNum : plotNum + index}
              key={index}
              style={{
                width: `${frame.width}px`,
              }}
              ref={(element) => {
                plotArr.push(element);
              }}
              onClick={(e) => {
                setSelectedPlot(e.target.getAttribute("data-name"));
                dispatch(getPlotInfo(e.target.getAttribute("data-name")));
              }}
            ></Plot>
          );
        })}
      </div>
    );
  };

  // fetching the specific lawn in the database
  useEffect(() => {
    const fetchLawn = async () => {
      if (containerRef.current) {
        await dispatch(getLawn("Lawn3"));
      }
    };

    fetchLawn();
  }, [containerRef]);

  // get the plots that belong to this lawn and store it in a state
  useEffect(() => {
    setLawn3Plots(areaPlots);
  }, [areaPlots]);

  // listen if the state that hollds the plots that belong to this lawn is already set
  // if the plotName matches the data-name of div set the id to the status of plot in the db
  useEffect(() => {
    if (lawn3Plots && lawn3Plots.length && plotArr) {
      plotArr.forEach((plot) => {
        const matched = lawn3Plots.find(
          (el) => el.plotName == plot.getAttribute("data-name")
        );
        if (matched) {
          plot.setAttribute("id", matched.status);
          plot.setAttribute("data-name", matched._id);
        }
      });
    }
  }, [lawn3Plots]);

  useEffect(() => {
    if (lawn3Plots && lawn3Plots.length && plotArr) {
      if (selectedPlot || map) {
        plotArr.forEach((plot) => {
          if (plot.getAttribute("data-name") == selectedPlot) {
            plot.style.background = "purple";
          } else {
            switch (plot.getAttribute("id")) {
              case "reserve":
                plot.style.background = "#e6e600";
                break;
              case "withInterment":
                plot.style.background = "#004d99";
                break;
              case "owned":
                plot.style.background = "#008000";
                break;
              case "saleable":
                plot.style.background = "#b3b3b3";
                break;
            }
          }
        });
      }
    }
  }, [lawn3Plots, selectedPlot, map]);

  if (!areaPlots) {
    return <LoadingScreen />;
  }

  return (
    <Main ref={mappingRef}>
      <Container
        data-name="Lawn3"
        $screenSize={mappingRef.current}
        ref={containerRef}
      >
        {showFrames && (
          <>
            <Frame1>
              <div className="border"></div>
              <PlotContainer className="plotContainerFrame1" ref={frame1Ref}>
                {showFrame1Plots && (
                  <>
                    {renderRow(frame1Row1, 281, plotFrame1Size)}
                    {renderRow(frame1Row2, 249, plotFrame1Size)}
                    {renderRow(frame1Row3, 218, plotFrame1Size)}
                    {renderRow(frame1Row4, 187, plotFrame1Size)}
                    {renderRow(frame1Row5, 156, plotFrame1Size)}
                    {renderRow(frame1Row6, 125, plotFrame1Size)}
                    {renderRow(frame1Row7, 94, plotFrame1Size)}
                    {renderRow(frame1Row8, 63, plotFrame1Size)}
                    {renderRow(frame1Row9, 32, plotFrame1Size)}
                    {renderRow(frame1Row10, 1, plotFrame1Size)}
                  </>
                )}
                <Road>
                  <div className="roadChild">
                    <div></div>
                    <div>
                      <div>
                        <small>X</small>
                      </div>
                    </div>
                  </div>
                </Road>
              </PlotContainer>
            </Frame1>
            <Frame2>
              <div className="border"></div>
              <PlotContainer ref={frame2Ref}>
                {showFrame2Plots && (
                  <>
                    {renderRow(frame2Row1, 299, plotFrame2Size, 1)}
                    {renderRow(frame2Row2, 266, plotFrame2Size)}
                    {renderRow(frame2Row3, 234, plotFrame2Size)}
                    {renderRow(frame2Row4, 203, plotFrame2Size)}
                    {renderRow(frame2Row5, 172, plotFrame2Size)}
                    {renderRow(frame2Row6, 141, plotFrame2Size)}
                    {renderRow(frame2Row7, 110, plotFrame2Size)}
                    {renderRow(frame2Row8, 79, plotFrame2Size)}
                    {renderRow(frame2Row9, 48, plotFrame2Size)}
                    {renderRow(frame2Row10, 17, plotFrame2Size)}
                    {renderRow(frame2Row11, "E", plotFrame2Size)}
                  </>
                )}
                <RoadExt></RoadExt>
              </PlotContainer>
            </Frame2>
          </>
        )}
      </Container>
    </Main>
  );
};

export default Lawn3;

const Main = styled.div`
  height: 100%;
  display: grid;
  place-items: center;
  overflow-y: scroll
  position: relative

  @media(max-width: 530px){
    overflow: hidden;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 10%;
  padding: 0 2em;
  overflow: scroll;

  @media (max-width: 1700px) {
    scale: 0.9;
    width: 110%;
    height: 110%;
  }
  @media (max-width: 1600px) {
    scale: 0.8;
    width: 120%;
    height: 120%;
  }
  @media (max-width: 1500px) {
    scale: 0.7;
    width: 130%;
    height: 130%;
  }
  @media (max-width: 1400px) {
    scale: 0.6;
    width: 160%;
    height: 160%;
  }
  @media (max-width: 1270px) {
    scale: 0.5;
    width: 190%;
    height: 190%;
  }
  @media (max-width: 1270px) {
    scale: 0.4;
    width: 245%;
    height: 245%;
  }
  @media (max-width: 1270px) {
    scale: 0.3;
    width: 330%;
    height: 330%;
  }

  @media (max-width: 950px) {
    transform: rotate(90deg);
    height: 280%;
    width: 370%;
    margin-top: 10%;
    margin-bottom: 0%;
    margin-left: 0%;
  }
  @media (max-width: 930px) {
    margin-top: 25%;
  }
  @media (max-width: 905px) {
    scale: 0.2;
    height: 400%;
    width: 590%;
  }
  @media (max-width: 800px) {
    margin-top: 15%;
  }
  @media (max-width: 740px) {
    margin-top: 10%;
  }
  @media (max-width: 680px) {
    scale: 0.1;
    height: 600%;
    width: 1500%;
    margin-top: 30%;
  }

  @media (max-width: 650px) {
    margin-top: 20%;
  }
  @media (max-width: 600px) {
    margin-top: 10%;
  }
  @media (max-width: 550px) {
    margin-top: 0%;
  }
`;

const Frame1 = styled.div`
  height: calc(100% * 0.320924);
  width: calc(100% * 0.47984764);
  border: none;
  border-left: 1px solid black;
  border-bottom: 1px solid black;
  transform: rotate(-9deg);
  position: relative;
  top: 4.8em;
  left: -0.5em;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 7.52211%;
  padding-left: 1.66478%;
  z-index: 1;

  @media (max-width: 500px) {
    border-width: 8px;
  }

  @media (min-width: 1870px) {
    top: 4.4em;
  }
  @media (max-width: 1850px) {
    top: 4.3em;
  }
  @media (max-width: 1780px) {
    top: 4.1em;
  }
  @media (max-width: 1600px) {
    top: 4.5em;
  }
  @media (max-width: 1600px) {
    top: 4.5em;
  }
  @media (max-width: 1400px) {
    top: 5.3em;
  }
  @media (max-width: 1320px) {
    top: 4.9em;
  }
  @media (max-width: 1270px) {
    top: 10em;
  }
  @media (max-width: 1200px) {
    top: 8.7em;
  }
  @media (max-width: 1068px) {
    top: 8.5em;
  }
  @media (max-width: 1028px) {
    top: 8.1em;
  }
  @media (max-width: 962px) {
    top: 7.8em;
  }
  @media (max-width: 952px) {
    top: 7.5em;
  }
  @media (max-width: 950px) {
    top: 8.3em;
  }
  @media (max-width: 902px) {
    top: 12em;
  }
  @media (max-width: 785px) {
    top: 11em;
  }
  @media (max-width: 700px) {
    top: 10em;
  }
  @media (max-width: 680px) {
    top: 25em;
  }
  @media (max-width: 640px) {
    top: 23em;
  }
  @media (max-width: 640px) {
    top: 22em;
  }
  @media (max-width: 540px) {
    top: 19em;
  }
  @media (max-width: 460px) {
    top: 16em;
  }

  & div.border {
    height: calc(100% * 0.30752);
    width: 120%;
    position: relative;
    right: -10%;
    border: none;
    border-style: solid;
    border-color: black;
    border-right: 1px;
    border-top: 1px;

    @media (max-width: 500px) {
      border-width: 8px;
    }
  }

  & div.plotContainerFrame1 {
    border-left: 1px solid black;

    @media (max-width: 500px) {
      border-width: 8px;
    }
  }
`;

const PlotContainer = styled.div`
  height: calc(100% * 0.549689);
  width: 100%;
  border-right: none;
  border-bottom: none;
  position: relative;

  @media (max-width: 500px) {
    border-width: 8px;
  }
`;

const Frame2 = styled.div`
  height: calc(100% * 0.320924);
  width: calc(100% * 0.44194);
  border: 1px solid black;
  border-left: none;
  border-top: none;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 7.52211%;
  z-index: 1;
  background: #f2f2f8;
  @media (max-width: 500px) {
    border-width: 8px;
  }

  & div.border {
    height: calc(100% * 0.30752);
    width: 100%;
    border: none;
    border-style: solid;
    border-color: black;
    border-left: 1px;
    border-top: 1px;
    border-right: none;
    @media (max-width: 500px) {
      border-width: 8px;
    }
  }
`;

const Plot = styled.div`
  height: 100%;
  border: 1px solid black;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 0px 18px 14px aqua inset;
    -webkit-box-shadow: 0px 0px 18px 14px aqua inset;
    -moz-box-shadow: 0px 0px 18px 14px aqua inset;
  }

  @media (max-width: 500px) {
    border-width: 4px;
  }
`;
const Road = styled.div`
  width: 150%;
  height: 117%;
  top: 100%;
  position: absolute;
  right: 3%;
  border: 2px solid black;
  border-right: none;
  display: grid;
  place-items: center;

  @media (max-width: 800px) {
    border-width: 8px;
  }

  & div.roadChild:first-child {
    height: 30%;
    width: 60%;
    display: flex;

    & div:first-child {
      flex-basis: 85%;
      height: 100%;
      border: 1px solid black;
      border-left: none;
      @media (max-width: 800px) {
        border-width: 8px;
      }
    }

    & div:last-child {
      border: 1px solid black;
      flex-basis: 15%;
      height: 100%;
      border-top-right-radius: 45%;
      border-bottom-right-radius: 45%;
      padding: 2px;
      @media (max-width: 800px) {
        border-width: 8px;
        padding: 10px;
      }
      & div {
        height: 100%;
        width: 100%;
        border: 1px solid black;
        display: flex;
        align-items: center;
        justify-ontent: flex-start;
        @media (max-width: 800px) {
          border-width: 8px;
        }
      }
    }
  }
`;

const RoadExt = styled.div`
  height: 120%;
  width: 100%;
  position: absolute;
  top: 100%;
  border: 2px solid black;
  z-index: 2;
  border-left: none;
  border-right: none;
  background: #f2f2f8;

  @media (max-width: 800px) {
    border-width: 8px;
  }
`;
