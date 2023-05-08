import * as React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";

export default function EditDialog({
  open,
  handleClose,
  scroll,
  editableData,
  setEditableData,
}) {
  const { others } = editableData;

  const handleChange = (e) => {
    const { name, value } = e.target;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">
        {others &&
          `${editableData?.others?.Appointment_created_by.value}'s appointment`}
      </DialogTitle>
      <DialogContent dividers={scroll === "paper"}>
        {others && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {Object.entries(editableData?.others)
                .slice(0, 31)
                .sort()
                .map((key, value) => {
                  return (
                    <Box
                      key={value}
                      style={{
                        marginBottom: "1.5rem",
                      }}
                    >
                      <h6
                        style={{
                          whiteSpace: "nowrap",
                          fontSize: "0.8rem",
                        }}
                      >
                        {key[1]?.name}
                      </h6>
                      <TextField
                        fullWidth
                        name={key[0]}
                        id="outlined-required"
                        value={editableData?.others[key[0]]?.value}
                        onChange={handleChange}
                      />
                    </Box>
                  );
                })}
            </Grid>
            <Grid item xs={12} md={6}>
              {Object.entries(editableData?.others)
                .slice(31, 72)
                .sort()
                .map((key, value) => {
                  return (
                    <Box
                      key={value}
                      style={{
                        marginBottom: "1.5rem",
                      }}
                    >
                      <h6
                        style={{
                          whiteSpace: "nowrap",
                          fontSize: "0.8rem",
                        }}
                      >
                        {key[1]?.name}
                      </h6>
                      <TextField
                        fullWidth
                        name={key[0]}
                        id="outlined-required"
                        value={editableData?.others[key[0]]?.value}
                        onChange={handleChange}
                      />
                    </Box>
                  );
                })}
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Subscribe</Button>
      </DialogActions>
    </Dialog>
  );
}
