import * as React from "react";
import Box from "@material-ui/core/Box";
import { LineWave } from "react-loader-spinner";
import * as FaIcons from "react-icons/fa";

const ConditionalRendering = ({ loading, patientsInfo, filteredData }) => {
  return (
    <>
      {loading && (
        <Box sx={{ marginLeft: "38%" }}>
          <LineWave
            height="300"
            width="300"
            color="#212155"
            ariaLabel="line-wave"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            firstLineColor=""
            middleLineColor=""
            lastLineColor=""
          />
        </Box>
      )}
      {!patientsInfo && !loading && (
        <h1
          style={{
            textAlign: "center",
            marginTop: "5rem",
          }}
        >
          <FaIcons.FaExclamationTriangle
            style={{
              color: "#F7C110",
              fontSize: "2rem",
            }}
          />{" "}
          No information available
        </h1>
      )}

      {filteredData.length === 0 && (
        <h1
          style={{
            textAlign: "center",
            marginTop: "5rem",
          }}
        >
          <FaIcons.FaExclamationTriangle
            style={{
              color: "#F7C110",
              fontSize: "2rem",
            }}
          />{" "}
          No information available
        </h1>
      )}
    </>
  );
};

export default ConditionalRendering;
