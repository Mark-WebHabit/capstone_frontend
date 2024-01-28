import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { getLawn } from "../features/restApiSlice";
import {
  getPlotInfo,
  getAreaPlots,
  clearAreaPlots,
} from "../features/restApiSlice";
import LoadingScreen from "./LoadingScreen";

const Lawn1 = ({ selectedPlot, setSelectedPlot, map }) => {
  const lawn1ContainerRef = useRef();
  const lawn1Ref = useRef();

  // push the divs directly to this array instead of passing it in a ref
  const plotArr = [];

  const [showLawnContainer, setShowLawnContainer] = useState(false);
  const [showPlots, setShowPlots] = useState(false);
  const [lawn1Plots, setLawn1Plots] = useState(null);

  const dispatch = useDispatch();
  const areaPlots = useSelector((state) => state.restApi.areaPlots); // if this is empty meaning it is still fetching so the area shuldnt be displayed

  const [plotSize, setPlotSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    dispatch(clearAreaPlots());
    dispatch(getAreaPlots("Lawn1"));
  }, []);

  // make sure the container ref is not null before rendering its child and setting its size as the container size state

  useEffect(() => {
    if (lawn1ContainerRef.current) {
      setShowLawnContainer(true);
    }
  }, [areaPlots]);

  // making sure that after the parent was rendered, the ref is not null for its child to use
  useEffect(() => {
    if (lawn1ContainerRef.current && lawn1Ref.current) {
      setShowPlots(true);
    }
  }, [lawn1ContainerRef.current, lawn1Ref.current]);

  useEffect(() => {
    const calculatePlotSize = () => {
      if (lawn1Ref.current) {
        setPlotSize({
          width: lawn1Ref.current.clientWidth / 12,
          height: lawn1Ref.current.clientHeight / 18,
        });
      }
    };

    calculatePlotSize();

    window.addEventListener("resize", calculatePlotSize);

    return () => {
      window.removeEventListener("resize", calculatePlotSize);
    };
  }, [lawn1Ref.current]);

  // rendering the divs that represent the plots
  const renderRow = (arr, plotNum) => {
    return (
      <div
        style={{
          width: `${plotSize.width * 12}px`,
          height: `${plotSize.height}px`,
          display: "flex",
          alignItems: "center",
        }}
      >
        {arr.map((plot, index) => (
          <Plot
            ref={(element) => {
              plotArr.push(element);
            }}
            data-name={plotNum + index}
            key={index}
            $width={plotSize.width}
            onClick={(e) => {
              setSelectedPlot(e.target.getAttribute("data-name"));
              dispatch(getPlotInfo(e.target.getAttribute("data-name")));
            }}
          ></Plot>
        ))}
      </div>
    );
  };

  // fetching the specific lawn in the database
  useEffect(() => {
    const fetchLawn = async () => {
      if (lawn1ContainerRef.current) {
        await dispatch(getLawn("Lawn1"));
      }
    };

    fetchLawn();
  }, [lawn1ContainerRef]);

  // // get the plots that belong to this lawn and store it in a state
  useEffect(() => {
    // the area plot fetched were based on the active selected area type so no validation were made
    setLawn1Plots(areaPlots);
  }, [areaPlots]);

  // listen if the state that hollds the plots that belong to this lawn is already set
  // if the plotName matches the data-name of div set the id to the status of plot in the db
  useEffect(() => {
    if (lawn1Plots && lawn1Plots.length && plotArr) {
      plotArr.forEach((plot) => {
        const matched = lawn1Plots.find(
          (el) => el.plotName == plot.getAttribute("data-name")
        );
        if (matched) {
          plot.setAttribute("id", matched.status);
          plot.setAttribute("data-name", matched._id);
        }
      });
    }
  }, [lawn1Plots]);

  useEffect(() => {
    if (lawn1Plots && lawn1Plots.length && plotArr) {
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
  }, [lawn1Plots, selectedPlot, map]);

  const lawn1PlotRow1 = Array.from({ length: 12 }, (_, index) => 205 + index);

  if (!areaPlots) {
    return <LoadingScreen />;
  }

  return (
    <Main>
      <Container ref={lawn1ContainerRef} data-name="Lawn1" key={areaPlots}>
        {showLawnContainer && (
          <>
            <Lawn ref={lawn1Ref} $height={lawn1Ref.current?.clientHeight}>
              {showPlots && (
                <>
                  {renderRow(lawn1PlotRow1, 205)}
                  {renderRow(lawn1PlotRow1, 193)}
                  {renderRow(lawn1PlotRow1, 181)}
                  {renderRow(lawn1PlotRow1, 169)}
                  {renderRow(lawn1PlotRow1, 157)}
                  {renderRow(lawn1PlotRow1, 145)}
                  {renderRow(lawn1PlotRow1, 133)}
                  {renderRow(lawn1PlotRow1, 121)}
                  {renderRow(lawn1PlotRow1, 109)}
                  {renderRow(lawn1PlotRow1, 97)}
                  {renderRow(lawn1PlotRow1, 85)}
                  {renderRow(lawn1PlotRow1, 73)}
                  {renderRow(lawn1PlotRow1, 61)}
                  {renderRow(lawn1PlotRow1, 49)}
                  {renderRow(lawn1PlotRow1, 37)}
                  {renderRow(lawn1PlotRow1, 25)}
                  {renderRow(lawn1PlotRow1, 13)}
                  {renderRow(lawn1PlotRow1, 1)}
                </>
              )}
            </Lawn>
          </>
        )}
        <Road>
          <div>
            <div></div>
          </div>
        </Road>
      </Container>
    </Main>
  );
};

export default Lawn1;

const Main = styled.div`
  height: 100%;
  width: 100%;
  background-color: #f2f2f8;
  z-index: 1;
`;

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transform: rotate(-13deg);
  z-index: 1;

  @media (max-width: 1100px) {
    transform: rotate(85deg);
  }

  @media (max-width: 850px) {
    transform: rotate(-5deg);
  }
`;

const Lawn = styled.div`
  height: calc(100% * 0.621711);
  width: calc(100% * 0.7153152);
  border: 1px solid black;
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    height: ${(props) => props.$height - 1}px;
    border: 1px solid black;
    border-right: 0;
    width: 15px;
    position: absolute;
    left: -1.5%;
  }
`;

const Plot = styled.div`
  border: 1px solid black;
  width: ${(props) => props.$width}px;
  min-height: 100%;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 0px 18px 14px aqua inset;
    -webkit-box-shadow: 0px 0px 18px 14px aqua inset;
    -moz-box-shadow: 0px 0px 18px 14px aqua inset;
  }
`;

const Road = styled.div`
  width: 150%;
  height: 150%;
  position: absolute;
  bottom: -130%;
  outline: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;

  & div:first-child {
    height: 99%;
    width: 99%;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;

    & div {
      border: 1px solid black;
      width: 100%;
      height: 88%;
    }
  }
`;
