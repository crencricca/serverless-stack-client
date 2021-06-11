import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import "./NewNote.css";
import Button from 'react-bootstrap/Button'

export default function NewNote() {


  const file = useRef(null);
  const history = useHistory();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  var state = { tableName: 'Activity', name: 'default' , cold: 'Y', hot: 'Y', temperate: 'Y', precip: 'Y'};
  
  function myChangeHandlerType(event){
    alert("changing type")
    state.tableName = event.target.value;
  }

  function myChangeHandlerName(event){
    state.name = event.target.value;
  }

  function myChangeHandlerCold(event){
    state.cold = event.target.value;
  }

  function myChangeHandlerHot(event){
    state.hot = event.target.value;
  }

  function myChangeHandlerTemperate(event){
    state.temperate = event.target.value;
  }

  function myChangeHandlerPrecip(event){
    state.precip = event.target.value;
  }



  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
  
    setIsLoading(true);
  
    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
  
      await createNote({ content, attachment });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  
  function createNote() {
    if(state.tableName == "Activity"){
      state.tableName = "tahoe-activities-1";
    }else{
      state.tableName = "tahoe-food-1";
    }
    alert("hit create")
    alert(state.tableName)
    return API.post("tahoe", "tahoe", {
        body : {
          "name":state.name,
          "cold":state.cold,
          "hot":state.hot,
          "temperate":state.temperatetemp,
          "tableName": state.tableName, 
          "precip":state.precip
        }
    });
  }

  return (
    <div className="NewNote">
      <Form>
        <Form.Group onChange={myChangeHandlerType} controlId="exampleForm.ControlSelect1">
          <Form.Label>Select Type of Reccomendation</Form.Label>
          <Form.Control as="select">
            <option>Activity</option>
            <option>Resturant</option>
          </Form.Control>
        </Form.Group>
        <Form.Group onChange={myChangeHandlerName} controlId="exampleForm.ControlInput1">
          <Form.Label>Name</Form.Label>
          <Form.Control placeholder="enter resturant or activity name" />
        </Form.Group>
        <Form.Group onChange={myChangeHandlerCold} controlId="exampleForm.ControlSelect1">
          <Form.Label>Suitable in Cold Weather?</Form.Label>
          <Form.Control as="select">
            <option>Yes</option>
            <option>No</option>
          </Form.Control>
        </Form.Group>
        <Form.Group onChange={myChangeHandlerTemperate} controlId="exampleForm.ControlSelect1">
          <Form.Label>Suitable in Temperate Weather?</Form.Label>
          <Form.Control as="select">
            <option>Yes</option>
            <option>No</option>
          </Form.Control>
        </Form.Group>
        <Form.Group onChange={myChangeHandlerHot} controlId="exampleForm.ControlSelect1">
          <Form.Label>Suitable in Hot Weather?</Form.Label>
          <Form.Control as="select">
            <option>Yes</option>
            <option>No</option>
          </Form.Control>
        </Form.Group>
        <Form.Group onChange={myChangeHandlerPrecip} controlId="exampleForm.ControlSelect1">
          <Form.Label>Suitable in Rain, Snow, Sleet, Hail?</Form.Label>
          <Form.Control as="select">
            <option>Yes</option>
            <option>No</option>
          </Form.Control>
        </Form.Group>

        <Button  onClick = {createNote} variant="primary">Submit</Button>{' '}

      </Form>
    </div>
  );
}
