import * as React from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";

const FilteredPatientsData = ({
  filteredByDay,
  day,
  setDay,
  patientsInfo,
  filteredByDate,
  filteredBy,
  setFilteredBy,
  filteredByMonthAndYear,
}) => {
  const year = new Date().getFullYear();

  const listOfDates = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
  ];

  const listOfMonthWithYear = [
    `January ${year}`,
    `February ${year}`,
    `March ${year}`,
    `April ${year}`,
    `May ${year}`,
    `June ${year}`,
    `July ${year}`,
    `August ${year}`,
    `September ${year}`,
    `October ${year}`,
    `November ${year}`,
    `December ${year}`,
  ];

  return (
    <>
      <Box
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: "1rem",
          justifyContent: "flex-start",
        }}
      >
        <p
          style={{
            marginTop: "0.5rem",
          }}
        >
          Filtered By Date:
        </p>

        <FormControl
          style={{
            flex: "1 1 auto",
            backgroundColor: "inherit",
          }}
        >
          <Select
            disabled={patientsInfo.length === 0}
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={day}
            label={day}
            onChange={(e) => setDay(e.target.value)}
            style={{
              width: "40%",
              marginLeft: "0.7rem",
              border: "1px solid #000000",
              padding: "0 0.5rem",
              backgroundColor: "inherit",
            }}
          >
            {listOfDates.map((date, index) => {
              return (
                <MenuItem
                  key={index}
                  value={date}
                  style={{
                    backgroundColor: "inherit",
                  }}
                  onClick={() => filteredByDate(date)}
                >
                  {date}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>

      <Box
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: "1rem",
          justifyContent: "flex-start",
        }}
      >
        <p
          style={{
            marginTop: "0.5rem",
          }}
        >
          Filtered By Month:
        </p>

        <FormControl
          style={{
            flex: "1 1 auto",
            backgroundColor: "inherit",
          }}
        >
          <Select
            disabled={patientsInfo.length === 0}
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={filteredBy}
            label={filteredBy}
            onChange={(e) => setFilteredBy(e.target.value)}
            style={{
              width: "100%",
              border: "1px solid #000000",
              padding: "0 0.5rem",
              backgroundColor: "inherit",
            }}
          >
            {listOfMonthWithYear.map((month, index) => {
              return (
                <MenuItem
                  key={index}
                  value={month}
                  style={{
                    backgroundColor: "inherit",
                  }}
                  onClick={() => filteredByMonthAndYear(month)}
                >
                  {month}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>

      <small
        style={{
          display: "block",
          textAlign: "left",
          color: "red",
        }}
      >
        {filteredByDay ? "This" : "These"} information filtered by{" "}
        {filteredByDay ? "date" : "month and year"}
      </small>
    </>
  );
};

export default FilteredPatientsData;
