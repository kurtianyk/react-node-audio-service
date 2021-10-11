import React, { useEffect, useState } from "react"
import Modal from '@material-ui/core/Modal';
import { Typography, IconButton } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import MUIDataTable from "mui-datatables";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from "../services/api";
import { Header } from "../components/Header";
import ModalForm from "../components/ModalForm";

import AudioPlayer from '../components/AudioPlayer';

const toastConfig = {
  position: "bottom-left",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const notifySuccess = (message) => toast.success(message, toastConfig);
const notifyError = () => toast.error('Oops! Try again', toastConfig);

const useStyles = makeStyles({
  gridContainer: {
    background: "inherit",
    padding: "0 1.25rem 0.5rem 1.25rem",
    '& .MuiTableCell-root': {
      padding: '0.8rem',
      height: "5vh",
      boxSizing: "border-box",
      fontSize: '0.8rem'
    },
    '& .MuiTableHead-root > th': {
      fontSize: '0.2rem'
    }
  },
  loaderContainer: {
    border: "1px solid #60F8F6",
    borderRadius: "0.5rem",
    boxShadow: `0 0 0.3rem #9bf9f9`,
    fontFamily: "'HK Grotesk', sans-serif",
    background: "#0F1224",
  }, 
  grid: {
    border: "1px solid #60F8F6",
    borderRadius: "0.5rem",
    boxShadow: `0 0 0.3rem #9bf9f9`,
    fontFamily: "'HK Grotesk', sans-serif",
    background: "#0F1224",
  },
  title: {
    color: "#9bf9f9",
    margin: "0.2rem 0 0 1.25rem",
    fontSize: "1rem",
    fontFamily: "'Montserrat', sans-serif",
    textShadow: "0 0 8px #60F8F6",
    textTransform: "uppercase"
  },
  btn: {
    background: "#9bf9f9",
    color: "#150933",
  },
  addIcon: {
    height: "0.7em",
    width: "0.7em"
  }
});

export const Dashboard = (props) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const [modalProps, setModalProps] = useState({
    open: false,
    title: "Add new track",
    values: null,
    callback: () => {}
  });

  const [modalPlayerProps, setModalPlayerProps] = useState({
    open: true,
    track: null,
    callback: () => {}
  });

  function renderActions(id, params) {
    const selectedRow = params.tableData.find(row => row.id === id)

    const onDelete = () => {
      setModalProps({
        open: true,
        title: "Are you sure you want to delete ",
        values: selectedRow,
        type: "confirm",
        callback: () => {
          api.deleteAudio(id);
          notifySuccess('Your audio track was deleted!');
          setRows(rows.filter(r => r.id !== id));
          handleClose();
        }
      });
    };

    const onEdit = () => {
      setModalProps({
        open: true,
        title: "Edit Audio Track",
        values: selectedRow,
        callback: async (values) => {
          try {
            const { data, ok, status } = await api.editAudio({ id, ...values });

            if (ok, status === 200) {
              handleClose();
              setRows([ ...rows.filter(r => r.id !== id), data ]);
              return notifySuccess('Your trackF was edited!');
            }
          } catch(e) {
            return notifyError();
          }
        }
      });
    };

    return (
      <div style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
        <EditIcon style={{ paddingRight: '0.5rem' }} onClick={onEdit} />{" "}
        <DeleteForeverIcon onClick={onDelete} />
      </div>
    );
  };

  const columns = [
    {
      name: "audioSrc",
      label: " ",
      options: {
        customBodyRender: (value, tableMeta) => (renderActions(value, tableMeta)),
        filter: false,
        download: false,
        sort: false,
        filterOptions: {
          fullWidth: true
        }
      }
    },
    {
      name: "title",
      label: "Track Name",
      options: {
        filter: true,
        sort: true,
        filterOptions: {
          fullWidth: true,
          fullHeiht: true
        }
      }
    },
    {
      name: "artist",
      label: "Artist Name",
      options: {
        filter: true,
        sort: true,
        filterOptions: {
        fullWidth: true
        }
      }
    },
    {
      name: "file_name",
      label: "File Name",
      options: {
        filter: true,
        sort: true,
        filterOptions: {
        fullWidth: true
    }
      }
    },
    {
      name: "id",
      label: " ",
      options: {
        customBodyRender: (value, tableMeta) => (renderActions(value, tableMeta)),
        filter: false,
        download: false,
        sort: false,
        filterOptions: {
          fullWidth: true
        }
      }
    }
  ];

  useEffect(() => {
    // fetch();
  }, []);

  const fetch = async () => {
    api.setToken();
    try {
      setLoading(true);
      const response = await api.getAllTracks();
      if (response.ok && response.status === 200) {
        setRows(response.data);
        setLoading(false);
      }
    } catch(e) {
      setLoading(false);
      console.error(e);
    }
  };

  const handleClose = () => {
    setModalProps({ open: false, title: null, values: null });
  };

  const handlePlayerClose = () => {
    setModalPlayerProps({ open: false, track: null });
  };

  const handleAdd = () => {
    setModalProps({
      open: true,
      title: "Add new track",
      values: null,
      callback: async (values) => {
        try {
          const { data, ok, status } = await api.addAudio(values);

          if (ok, status === 200) {
            handleUpdateRows(data);
            return notifySuccess('New audio track added!');
          }
        } catch(err) {
          return notifyError();
        }
      }
    });
  }

  const handleUpdateRows = (newRow) => {
    handleClose();
    setRows([...rows, newRow]);
  };

  const options = {
    filter: false,
    filterType: 'dropdown',
    print: false,
    selectableRows: 'none',
    download: false,
    viewColumns: false,
    // responsive: "scroll",
    tableBodyHeight: '61.5vh',
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 15, 25, 50, 100],
    sortOrder: {
      name: 'track_name',
      direction: 'asc'
    }
  };

  const gridContent = loading
    ? <div className={classes.loaderContainer} style={{ display: "flex", justifyContent: "center", padding: "28vh 0" }}><CircularProgress size="10rem" color="primary" /></div>
    : <MUIDataTable
        //title={"Audio Track"}
        className={classes.grid}
        isRowSelectable={false}
        data={rows}
        columns={columns}
        options={options}
      />

  return (
    <>
      <Header {...props} />
      <div style={{ display: "flex", justifyContent: "space-between", margin: "0.5em 0.1em" }}>
        <Typography className={classes.title} variant="h6">ᐅ Your audio track list</Typography>
        <Fab variant="contained" style={{ marginRight: "1.25rem" }} onClick={handleAdd} size="small" color="primary" aria-label="add">
          <AddIcon variant="contained" className={classes.addIcon} />
        </Fab>
      </div>

      <div className={classes.gridContainer}>{gridContent}</div>
      <Modal
        open={modalProps.open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ModalForm onClose={handleClose} {...modalProps} />
      </Modal>
      <Modal
        open={modalPlayerProps.open}
        onClose={handlePlayerClose}
      >
        <AudioPlayer
          onClose={handlePlayerClose}
          {...modalPlayerProps}
        />
      </Modal>
      <ToastContainer />
    </>
  );
}
