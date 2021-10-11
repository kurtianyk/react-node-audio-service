import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, TextField } from '@material-ui/core';

import AudioFileUpload from './AudioFileUpload';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: "15px",
    '& > *': {
      margin: theme.spacing(1),
    }
  },
  title: {
    textAlign: "center",
    color: "#9bf9f9",
    margin: "5px 0 15px 20px",
    fontFamily: "'Montserrat', sans-serif",
    textShadow: "0 0 8px #60F8F6",
    textTransform: "uppercase"
  },
  btn: {
    background: "linear-gradient(90deg, #60F8F6 0%, #9bf9f9 100%)",
    color: "#150933",
    marginLeft: "10px"
  },
  disabled: {
    background: "grey"
  },
  container: {
    display: "flex",
    justifyContent: "center"
  },
  paper: {
    position: 'absolute',
    width: "82vw",
    maxWidth: 700,
    backgroundColor: "#0F1224",
    border: "2px solid #60F8F6",
    borderRadius: "0.5rem",
    boxShadow: `0 0 0.5rem #9bf9f9`,
    padding: "20px",
  }
}));

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export const ModalForm = (props) => {
  const [values, setValues] = useState({
    business_name: props.values?.business_name,
    business_address: props.values?.business_address,
    offer_description: props.values?.offer_description,
    days_to_use: props.values?.days_to_use
  });

  const [errors, setErrors] = useState({
    business_name: null,
    business_address: null,
    offer_description: null,
    days_to_use: null
  });

  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });

    if (["business_name", "business_address", "offer_description"].includes(prop) && event.target.value.length > 256) {
      setErrors({ ...errors, [prop]: "The maximum length is 256ch" });
    } else {
      setErrors({ ...errors, [prop]: null });
    }

    if (prop === "days_to_use") {
      if (Number(event.target.value) > 31) {
        setErrors({ ...errors, [prop]: "The maximum duration is 31 days" });
      }

      if (isNaN(Number(event.target.value))) {
        setErrors({ ...errors, [prop]: "Days to use should be number" });
      }
    }
  };

  const handleSave = () => {
    props.callback(values)
  };

  const handleClose = () => {
    props.onClose()
  };

  if (props.type === "confirm") {
    return (
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.gridContainer}>
      <form className={classes.root} noValidate autoComplete="off">
        <Typography className={classes.title} variant="h6">{props.title} "{values.business_name}"</Typography>
        <div
          className={classes.container}
        >
          <Button
            onClick={handleClose}
            color="primary"
          >
            No
          </Button>
          <Button
            variant="contained"
            className={classes.btn}
            onClick={props.callback}
            color="primary"
          >
            Yes
          </Button>
        </div>
      </form>
      </div>
    </div>
    )
  }

  const isSaveDisabled = (Object.values(values).some(v => !v) || Object.values(errors).some(e => e))

  return (
    <div style={modalStyle} className={classes.paper}>
      <div className={classes.gridContainer}>
    <form className={classes.root} noValidate autoComplete="off">
      <Typography className={classes.title} variant="h6">{props.title}</Typography>
        <TextField
          error={errors.business_name}
          required
          label="Track Name"
          fullWidth
          onChange={handleChange("title")}
          helperText={errors.business_name}
          value={values.business_name}
          variant="outlined"
        />

        <TextField
          error={errors.business_address}
          required
          label="Artist Name"
          fullWidth
          onChange={handleChange("artist")}
          helperText={errors.business_address}
          value={values.business_address}
          variant="outlined"
        />

        <AudioFileUpload />

      <div
        className={classes.container}
      >
        <Button
          onClick={handleClose}
          color="primary"
        >
          Cancel
        </Button>


        <Button
          disabled={isSaveDisabled}
          variant="contained"
          classes={{ disabled: classes.disabled }}
          className={classes.btn}
          onClick={handleSave}
          color="primary"
        >
          Save
        </Button>
      </div>

    </form>
    </div>
  </div>
  );
}

export default ModalForm
