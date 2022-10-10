import * as React from "react";

const PatientsInformationContext = React.createContext();

const PatientsInformationProvider = ({ children }) => {
  const [patientsInfo, setPatientsInfo] = React.useState([]);

  return (
    <PatientsInformationContext.Provider
      value={{ patientsInfo, setPatientsInfo }}
    >
      {children}
    </PatientsInformationContext.Provider>
  );
};

export default PatientsInformationProvider;

export const usePatientInformationContext = () =>
  React.useContext(PatientsInformationContext);
