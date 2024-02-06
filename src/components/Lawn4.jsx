import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  getLawn,
  getPlotInfo,
  clearAreaPlots,
  getAreaPlots,
} from "../features/restApiSlice";
import LoadingScreen from "./LoadingScreen";
const Lawn4 = ({ selectedPlot, setSelectedPlot, map }) => {
  const frame1Ref = useRef(0);
  const containerRef = useRef(0);

  // push the divs directly to this array instead of passing it in a ref
  const plotArr = [];
  const dispatch = useDispatch();
  const areaPlots = useSelector((state) => state.restApi.areaPlots);
  const [lawn4Plots, setLawn4Plots] = useState(null);

  const [showFrames, setShowFrames] = useState(false);
  const [plotSize, setPlotSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    dispatch(clearAreaPlots());
    dispatch(getAreaPlots("Lawn4"));
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setShowFrames(true);
    }
  }, [areaPlots]);

  useEffect(() => {
    const setRefs = () => {
      if (frame1Ref.current) {
        setPlotSize({
          width: frame1Ref.current.clientWidth / 31,
          height: frame1Ref.current.clientHeight / 16,
        });
      }
    };

    setRefs();

    window.addEventListener("resize", setRefs);

    return () => {
      window.removeEventListener("resize", setRefs);
    };
  }, [frame1Ref.current]);

  // fetching the specific lawn in the database
  useEffect(() => {
    const fetchLawn = async () => {
      if (containerRef.current) {
        await dispatch(getLawn("Lawn4"));
      }
    };

    fetchLawn();
  }, []);
  const frame1Row = Array.from({ length: 21 });
  const frame1Row2 = Array.from({ length: 23 });
  const frame1Row3 = Array.from({ length: 25 });
  const frame1Row4 = Array.from({ length: 26 });
  const frame1Row5 = Array.from({ length: 26 });
  const frame1Row6 = Array.from({ length: 26 });
  const frame1Row7 = Array.from({ length: 27 });
  const frame1Row8 = Array.from({ length: 27 });
  const frame1Row9 = Array.from({ length: 27 });
  const frame1Row10 = Array.from({ length: 28 });
  const frame1Row11 = Array.from({ length: 29 });
  const frame1Row12 = Array.from({ length: 30 });
  const frame1Row13 = Array.from({ length: 31 });
  const frame1Row14 = Array.from({ length: 31 });
  const frame1Row15 = Array.from({ length: 31 });
  const frame1Row16 = Array.from({ length: 31 });

  const frame2Plots = Array.from({ length: 31 });
  const frame3Plots = Array.from({ length: 31 });

  const renderRows = (arr = [], plotNum = 0, margin = null, flag = false) => {
    const width = plotSize.width * arr.length;
    const marginLeft = margin ? plotSize.width * margin : 0;

    return (
      <div
        style={{
          width: `${width}px`,
          height: `${plotSize.height}px`,
          border: "1px solid black",
          display: "flex",
          marginLeft: `${marginLeft}px`,
          pointerEvents: "none",
        }}
      >
        {arr.map((plot, index) => {
          return (
            <Plot
              data-name={
                flag ? (index == 0 ? "E" : plotNum + index) : plotNum + index
              }
              ref={(element) => {
                plotArr.push(element);
              }}
              key={index}
              style={{
                width: `${plotSize.width}px`,
                height: `${plotSize.height}px`,
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

  // get the plots that belong to this lawn and store it in a state
  useEffect(() => {
    setLawn4Plots(areaPlots);
  }, [areaPlots]);

  // listen if the state that hollds the plots that belong to this lawn is already set
  // if the plotName matches the data-name of div set the id to the status of plot in the db
  useEffect(() => {
    if (lawn4Plots && lawn4Plots.length && plotArr) {
      plotArr.forEach((plot) => {
        const matched = lawn4Plots.find(
          (el) => el.plotName == plot.getAttribute("data-name")
        );
        if (matched) {
          plot.setAttribute("id", matched.status);
          plot.setAttribute("data-name", matched._id);
        }
      });
    }
  }, [lawn4Plots]);

  useEffect(() => {
    if (lawn4Plots && lawn4Plots.length && plotArr) {
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
  }, [lawn4Plots, selectedPlot, map]);

  if (!areaPlots) {
    return <LoadingScreen />;
  }

  return (
    <Container data-name="Lawn4" ref={containerRef}>
      <RoadTop src={`/images/lawn4roadtop.svg`} />
      <FrameContainer>
        <Frame1 ref={frame1Ref}>
          {showFrames && (
            <>
              {renderRows(frame1Row, 1, 4)}
              {renderRows(frame1Row2, 22, 2)}
              {renderRows(frame1Row3, 44, 0, true)}
              {renderRows(frame1Row4, 69)}
              {renderRows(frame1Row5, 95)}
              {renderRows(frame1Row6, 121)}
              {renderRows(frame1Row7, 147)}
              {renderRows(frame1Row8, 174)}
              {renderRows(frame1Row9, 201)}
              {renderRows(frame1Row10, 228)}
              {renderRows(frame1Row11, 256)}
              {renderRows(frame1Row12, 285)}
              {renderRows(frame1Row13, 315)}
              {renderRows(frame1Row14, 346)}
              {renderRows(frame1Row15, 377)}
              {renderRows(frame1Row16, 408)}
            </>
          )}
        </Frame1>
        <Frame2>
          {showFrames && (
            <>
              {renderRows(frame2Plots, 439, 0)}
              {renderRows(frame2Plots, 470, 0)}
              {renderRows(frame2Plots, 501, 0)}
              {renderRows(frame2Plots, 532, 0)}
              {renderRows(frame2Plots, 563, 0)}
              {renderRows(frame2Plots, 594, 0)}
              {renderRows(frame2Plots, 625, 0)}
              {renderRows(frame2Plots, 656, 0)}
              {renderRows(frame2Plots, 687, 0)}
              {renderRows(frame2Plots, 718, 0)}
              {renderRows(frame2Plots, 749, 0)}
              {renderRows(frame2Plots, 780, 0)}
              {renderRows(frame2Plots, 811, 0)}
            </>
          )}
        </Frame2>
        <Frame3>
          {showFrames && (
            <>
              {renderRows(frame3Plots, 842, 0)}
              {renderRows(frame3Plots, 873, 0)}
              {renderRows(frame3Plots, 904, 0)}
              {renderRows(frame3Plots, 935, 0)}
              {renderRows(frame3Plots, 966, 0)}
              {renderRows(frame3Plots, 997, 0)}
              {renderRows(frame3Plots, 1028, 0)}
              {renderRows(frame3Plots, 1059, 0)}
              {renderRows(frame3Plots, 1090, 0)}
              {renderRows(frame3Plots, 1121, 0)}
              {renderRows(frame3Plots, 1152, 0)}
              {renderRows(frame3Plots, 1183, 0)}
            </>
          )}
        </Frame3>
      </FrameContainer>
    </Container>
  );
};

export default Lawn4;
const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 3%;
  background-color: transparent;
`;

const RoadTop = styled.img`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  pointer-events: none;
`;

const Plot = styled.div`
  border: 1px solid black;
  cursor: pointer;
  pointer-events: initial;

  &:hover {
    box-shadow: 0px 0px 18px 14px aqua inset;
    -webkit-box-shadow: 0px 0px 18px 14px aqua inset;
    -moz-box-shadow: 0px 0px 18px 14px aqua inset;
  }
`;

const FrameContainer = styled.div`
  width: calc(100% * 0.96349829);
  height: calc(100% * 0.8161569);
  padding-left: 1.3936%;
  transform: rotate(-0.7deg);
  z-index: 1;
`;

const Frame1 = styled.div`
  height: calc(100% * 0.36922773);
  width: 100%;
  margin-bottom: 1.78659%;
  border: 1px solid black;
  border-top: 0;
  border-bottom: 0;
  border-right: 0;
`;

const Frame2 = styled.div`
  height: calc(100% * 0.294191);
  width: 100%;
  margin-bottom: 1.78659%;
`;

const Frame3 = styled.div`
  height: calc(100% * 0.2810895);
  width: 100%;
  border: 1px solid black;
`;
