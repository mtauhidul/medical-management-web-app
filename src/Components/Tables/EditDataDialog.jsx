import * as React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";

export default function EditDialog({
  open,
  handleClose,
  scroll,
  editableData,
  setEditableData,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  editableData && console.log(editableData);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">
        {editableData &&
          `${editableData?.others?.Appointment_created_by.value}'s appointment`}
      </DialogTitle>
      <DialogContent dividers={scroll === "paper"}>
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <h6 className="header6">Patient Name</h6>
              <FormControl sx={{ mt: 1, mb: 2, width: "100%" }}>
                <TextField
                  required
                  name="name"
                  placeholder="Enter Patient Name"
                  id="outlined-required"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}></Grid>
          </Grid>

          {/* {JSON.stringify(editableData.others)} */}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Subscribe</Button>
      </DialogActions>
    </Dialog>
  );
}
