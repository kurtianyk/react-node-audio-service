import React, { useState } from 'react';
import axios from 'axios';
import {Progress} from 'reactstrap';
import {  toast } from 'react-toastify';
import { Button } from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';

const AudioFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loaded, setLoaded] = useState(0);


  const checkMimeType = (event) => {
    //getting file object
    let files = event.target.files 
    //define message container
    let err = []
    // list allow mime type
    const types = ['audio/mpeg']
    // loop access array
    for(var x = 0; x<files.length; x++) {
     // compare file type find doesn't matach
      if (types.every(type => files[x].type !== type)) {
         // create error message and assign to container   
          err[x] = files[x].type+' is not a supported format\n';
      }
    };
     for(var z = 0; z<err.length; z++) {// if message not same old that mean has error 
         // discard selected file
        toast.error(err[z])
        event.target.value = null
    }
      return true;
  }

  const checkFileSize=(event)=>{
  let files = event.target.files
  let size = 1024 * 100 * 8; 
  let err = []; 
  if (files[0].size > size) {
    err = files[0].type + 'is too large, please pick a smaller file\n';
  }


  toast.error(err)
  event.target.value = null
    return true;
  }
  const onChangeHandler = event => {
  var file = event.target.files[0];
    if(checkMimeType(event)){ 
      setSelectedFile(file);
      setLoaded(0);
    }
  }
  const onClickHandler = () => {
    const data = new FormData() 
      data.append('file', selectedFile);
      console.log(selectedFile, 'selectedFile')

    axios.post(`${document.location.origin}/api/v1/audio/upload`, data, {
      onUploadProgress: ProgressEvent => {
        // this.setState({
        setLoaded(ProgressEvent.loaded / ProgressEvent.total*100);
        // })
      },
    })
      .then(res => { // then print response status
        toast.success('upload success')
      })
      .catch(err => { // then print response status
        toast.error('upload fail')
      })
    }

  return (
    <div class="container">
      <div class="row">
        <div class="offset-md-3 col-md-6">
          <div class="form-group files">
                <label>Upload Your File </label>
                <input type="file" class="form-control" onChange={onChangeHandler}/>
              </div>  
              <div class="form-group">
              <Progress max="100" color="success" value={loaded} >{Math.round(loaded,2) }%</Progress>
              </div> 
              <Button  onClick={onClickHandler}>Upload</Button>
        </div>
      </div>
    </div>
  );
}

export default AudioFileUpload;
