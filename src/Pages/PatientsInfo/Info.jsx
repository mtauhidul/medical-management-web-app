import * as React from "react";
import Box from "@material-ui/core/Box";
import styles from "./PatientsInfo.module.scss";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";

const Info = ({ item, removeData, index }) => {
  const [hovered, setHovered] = React.useState(false);
  const slug = item.date?.split("/").join("-").split(" ").join("&");

  return (
    <Box
      style={{
        position: "relative",
      }}
    >
      <Box className={styles._icon_box}>
        <MdIcons.MdCancel
          onClick={() => removeData(item)}
          className={styles._icon}
          title="Remove"
        />
      </Box>
      <Link to={`/admin/patients/${slug}`} className={styles.hovered}>
        <Box
          className={`${styles._box} ${styles._data_box}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered ? (
            <h3>
              <FaIcons.FaEye /> View
            </h3>
          ) : (
            <>
              <h3>{item.date?.split(", ")[0]}</h3>
              <p style={{ color: "blue" }}>{item.patients?.length}</p>
            </>
          )}
        </Box>
      </Link>
    </Box>
  );
};

export default Info;
