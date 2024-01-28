import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  getLawn,
  getPlotInfo,
  getAreaPlots,
  clearAreaPlots,
} from "../features/restApiSlice";
import LoadingScreen from "./LoadingScreen";

const Lawn2 = ({ selectedPlot, setSelectedPlot, map }) => {
  const frame1Ref = useRef();
  const framesContainerRef = useRef();

  // push the divs directly to this array instead of passing it in a ref
  const plotArr = [];

  const [showFrames, setShowFrames] = useState(false);
  const [showFrame1, setShowFrame1] = useState(false);
  const [lawn2Plots, setLawn2Plots] = useState(null);

  const dispatch = useDispatch();
  const areaPlots = useSelector((state) => state.restApi.areaPlots);

  const [plotSize, setPlotSize] = useState({
    width: 0.0238,
    height: 0.0242457,
  });

  useEffect(() => {
    dispatch(clearAreaPlots());
    dispatch(getAreaPlots("Lawn2"));
  }, []);

  useEffect(() => {
    if (framesContainerRef.current) {
      setShowFrames(true);
    }
  }, [areaPlots]);

  // make sure framesConatinerRef's's ref is rendered bebfore passing to child
  useEffect(() => {
    const calculateSize = () => {
      if (framesContainerRef.current) {
        // setShowFrames(true);
        setPlotSize({
          width: Math.round(framesContainerRef.current.clientWidth * 0.0238),
          height: Math.round(
            framesContainerRef.current.clientHeight * 0.0242457
          ),
        });
      }
    };

    calculateSize();

    window.addEventListener("resize", calculateSize);
    return () => {
      window.removeEventListener("resize", calculateSize);
    };
  }, [framesContainerRef.current]);

  // make sure frame1's ref is rendered bebfore passing to child
  useEffect(() => {
    if (framesContainerRef.current && frame1Ref.current) {
      setShowFrame1(true);
    }
  }, [framesContainerRef.current, frame1Ref.current]);

  // lawn2 frame1
  const frame1Row1 = Array.from({ length: 32 });
  const frame1Row2To9 = Array.from({ length: 31 });
  const frame1Row10To12 = Array.from({ length: 30 });

  // lawn2 frame2
  const frame2Row1 = Array.from({ length: 28 });
  const frame2Row2 = Array.from({ length: 27 });
  const frame2Row3 = Array.from({ length: 26 });
  const frame2Row4 = Array.from({ length: 25 });
  const frame2Row5 = Array.from({ length: 23 });
  const frame2Row6 = Array.from({ length: 22 });
  const frame2Row7 = Array.from({ length: 22 });
  const frame2Row8 = Array.from({ length: 21 });
  const frame2Row9 = Array.from({ length: 20 });
  const frame2Row10 = Array.from({ length: 19 });
  const frame2Row11 = Array.from({ length: 18 });
  const frame2Row12 = Array.from({ length: 17 });
  const frame2Row13 = Array.from({ length: 16 });
  const frame2Row14 = Array.from({ length: 15 });
  const frame2Row15 = Array.from({ length: 14 });
  const frame2Row16 = Array.from({ length: 13 });
  const frame2Row17 = Array.from({ length: 11 });
  const frame2Row18 = Array.from({ length: 10 });
  const frame2Row19 = Array.from({ length: 9 });
  const frame2Row20 = Array.from({ length: 7 });
  const frame2Row21 = Array.from({ length: 6 });
  const frame2Row22 = Array.from({ length: 4 });
  const frame2Row23 = Array.from({ length: 2 });
  const frame2Row24 = Array.from({ length: 1 });

  const renderColumn = (arr = null, plotNum = 0, margin = null) => {
    const width = plotSize.width * arr.length;
    const marginLeft = margin ? plotSize.width * margin : 0;

    return (
      <PlotRow $width={width} $height={plotSize.height} $padding={marginLeft}>
        {arr.map((plot, index) => (
          <Plot
            ref={(element) => {
              plotArr.push(element);
            }}
            key={index}
            data-name={plotNum + index}
            style={{
              width: `${plotSize.width}px`,
              height: `${plotSize.height}px`,
            }}
            onClick={(e) => {
              setSelectedPlot(e.target.getAttribute("data-name"));
              dispatch(getPlotInfo(e.target.getAttribute("data-name")));
            }}
          ></Plot>
        ))}
      </PlotRow>
    );
  };

  // fetching the specific lawn in the database
  useEffect(() => {
    const fetchLawn = async () => {
      if (framesContainerRef.current) {
        await dispatch(getLawn("Lawn2"));
      }
    };

    fetchLawn();
  }, [framesContainerRef]);

  // get the plots that belong to this lawn and store it in a state
  useEffect(() => {
    setLawn2Plots(areaPlots);
  }, [areaPlots]);

  // listen if the state that hollds the plots that belong to this lawn is already set
  // if the plotName matches the data-name of div set the id to the status of plot in the db
  useEffect(() => {
    if (lawn2Plots && lawn2Plots.length && plotArr) {
      plotArr.forEach((plot) => {
        const matched = lawn2Plots.find(
          (el) => el.plotName == plot.getAttribute("data-name")
        );
        if (matched) {
          plot.setAttribute("id", matched.status);
          plot.setAttribute("data-name", matched._id);
        }
      });
    }
  }, [lawn2Plots]);

  useEffect(() => {
    if (lawn2Plots && lawn2Plots.length && plotArr) {
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
  }, [lawn2Plots, selectedPlot, map]);

  if (!areaPlots) {
    return <LoadingScreen />;
  }

  return (
    <Container data-name="Lawn2">
      <div className="child1">
        <div></div>
      </div>
      <div className="child2">
        <div></div>
        <span>
          <div>
            <small>X</small>
          </div>
        </span>
      </div>
      <div className="child3">
        <div></div>
      </div>

      <Wrapper id="framesContainer" ref={framesContainerRef}>
        {showFrames && (
          <>
            <Frame1 id="frame1" ref={frame1Ref}>
              {showFrame1 && (
                <Frame1PlotContainer
                  $padding={framesContainerRef.current.clientHeight}
                >
                  {renderColumn(frame1Row1, 1)}
                  {renderColumn(frame1Row2To9, 33)}
                  {renderColumn(frame1Row2To9, 64)}
                  {renderColumn(frame1Row2To9, 95)}
                  {renderColumn(frame1Row2To9, 126)}
                  {renderColumn(frame1Row2To9, 157)}
                  {renderColumn(frame1Row2To9, 188)}
                  {renderColumn(frame1Row2To9, 219)}
                  {renderColumn(frame1Row2To9, 250)}
                  {renderColumn(frame1Row10To12, 281)}
                  {renderColumn(frame1Row10To12, 311)}
                  {renderColumn(frame1Row10To12, 341)}
                  {renderColumn(frame1Row10To12, 371)}
                </Frame1PlotContainer>
              )}
            </Frame1>
            {showFrame1 && (
              <Frame2>
                {renderColumn(frame2Row1, 401)}
                {renderColumn(frame2Row2, 429, 1)}
                {renderColumn(frame2Row3, 456, 2)}
                {renderColumn(frame2Row4, 482, 3)}
                {renderColumn(frame2Row5, 507, 4)}
                {renderColumn(frame2Row6, 530, 5)}
                {renderColumn(frame2Row7, 552, 5)}
                {renderColumn(frame2Row8, 574, 6)}
                {renderColumn(frame2Row9, 595, 7)}
                {renderColumn(frame2Row10, 615, 8)}
                {renderColumn(frame2Row11, 634, 9)}
                {renderColumn(frame2Row12, 652, 10)}
                {renderColumn(frame2Row13, 669, 11)}
                {renderColumn(frame2Row14, 685, 12)}
                {renderColumn(frame2Row15, 700, 13)}
                {renderColumn(frame2Row16, 714, 14)}
                {renderColumn(frame2Row17, 727, 16)}
                {renderColumn(frame2Row18, 738, 17)}
                {renderColumn(frame2Row19, 748, 18)}
                {renderColumn(frame2Row20, 757, 20)}
                {renderColumn(frame2Row21, 764, 21)}
                {renderColumn(frame2Row22, 770, 22)}
                {renderColumn(frame2Row23, 774, 24)}
                {renderColumn(frame2Row24, 776, 25)}
              </Frame2>
            )}
            <EmptyBoxes>
              <span className="span1"></span>
              <span className="span2"></span>
              <span className="span2"></span>
            </EmptyBoxes>
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default Lawn2;

const Container = styled.div.attrs((props) => ({
  style: {
    width: "100%",
    height: "100%",
    position: "relative",
    zIndex: 4,
    background: "#f2f2f8",
    transform: "rotate(-15deg)",
  },
}))`
  & .child1 {
    width: 100%;
    height: calc(100% * 0.1664154);
    border: 1px solid black;

    & div {
      width: 100%;
      height: 98%;
      border: none;
      border-bottom: 2px solid black;
    }
  }

  & .child2 {
    margin: 4% 0;
    width: calc(100% * 0.664798);
    height: calc(100% * 0.04889824);
    display: flex;

    & div {
      border: 1px solid black;
      width: 93%;

      @media (max-width: 1000px) {
        width: 85%;
      }
      @media (max-width: 600px) {
        width: 80%;
      }
      @media (max-width: 430px) {
        width: 75%;
      }
    }

    & span {
      width: 7%;
      border-top-right-radius: 50%;
      border-bottom-right-radius: 50%;
      height: 100%;
      border: 1px solid black;
      padding: 2px;
      padding-left: 0;

      @media (max-width: 1000px) {
        width: 15%;
      }
      @media (max-width: 600px) {
        width: 20%;
      }
      @media (max-width: 430px) {
        width: 25%;
      }

      & div {
        width: 100%;
        height: 100%;
        border-top-right-radius: 50%;
        border-bottom-right-radius: 50%;
        border: 1px solid black;
        border-left: none;
        font-size: 0.8rem;
        display: flex;
        align-items: center;

        & small {
          margin-left: 5px;
          font-weight: bold;
        }
      }
    }
  }

  & .child3 {
    border: 1px solid black;
    border-top: none;
    padding: 2px 0;
    overflow: hidden;

    & div {
      border: 2px solid black;
      border-top: none;
    }
  }

  @media (max-width: 720px) {
    width: 200%;
    transform: rotate(0);
    top: 2em;
  }
`;

const Plot = styled.div`
  border: 1px solid black;
  cursor: pointer;
  fontsize: 0.6rem;

  &:hover {
    box-shadow: 0px 0px 18px 14px aqua inset;
    -webkit-box-shadow: 0px 0px 18px 14px aqua inset;
    -moz-box-shadow: 0px 0px 18px 14px aqua inset;
  }
`;

const Wrapper = styled.div`
  height: calc(100% * 0.55);
  width: 100%;
  position: relative;
`;

const Frame1 = styled.div`
  margin-left: 10.02%;
  width: calc(100% - 0.1002);
  border: 1px solid black;
  border-right: none;
  height: calc(100% * 0.37726239667);
  padding-left: 1.0149%;
  padding-bottom: 0.6em;
`;

const Frame1PlotContainer = styled.div`
  height: 100%;
  padding-left: 0.4em;
  border: 1px solid black;
  border-right: none;
  padding-top: ${(props) => Math.round(props.$padding * 0.035)}px;
`;

const Frame2 = styled.div`
  margin-left: 16.25%;
  width: calc(100%);
  margin-top: 0.26%;
  height: calc(100% * 0.593953);
  border: 1px solid black;
  border-right: none;
  border: none;
`;

const EmptyBoxes = styled.div`
  position: absolute;
  width: calc(100% * 0.423271);
  height: calc(100% * 1.04055);
  border: 1px solid black;
  top: 17.8022%;
  right: -26.9%;
  transform: rotate(-345.438deg);
  background-color: white;
  z-index: 1;
  border-top: none;
  border-bottom: none;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;

  @media (max-width: 980px) {
    transform: rotate(-345.5deg);
    right: -30.9%;
  }

  & span {
    display: block;
    width: 98%;
    height: 30%;
    border: 1px solid black;
  }

  @media (max-width: 1440px) {
    top: 16%;
  }
  @media (max-width: 1250px) {
    top: 14%;
  }
  @media (max-width: 1150px) {
    top: 13%;
  }
  @media (max-width: 1000px) {
    top: 11.5%;
  }

  @media (max-width: 980px) {
    right: -32.9%;
  }
  @media (max-width: 600px) {
    transform: rotate(-350.5deg);
    right: -30.9%;
  }

  @media (max-width: 900px) {
    top: 9%;
  }
  @media (max-width: 720px) {
    top: 7%;
  }
  @media (max-width: 570px) {
    top: 5%;
  }
  @media (max-width: 440px) {
    top: 3%;
  }
  @media (max-width: 440px) {
    transform: rotate(-354.5deg);
    right: -30.9%;
  }
  @media (max-width: 380px) {
    top: 1 %;
  }
`;

const PlotRow = styled.div.attrs((props) => ({
  style: {
    width: `${props.$width}px`,
    height: `${props.$height}px`,
    marginLeft: `${props.$padding - 1}px`,
  },
}))`
  display: flex;
  align-items: center;
`;
