import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { FaCloud, FaMapMarkerAlt, FaSun } from "react-icons/fa";
import { BiBrightness } from "react-icons/bi";
import "./Weather.css";
import { BsFillBrightnessAltHighFill } from "react-icons/bs";
import { BsCloudFill } from "react-icons/bs";



export default function LoaderButton({
  isLoading,
  className = "",
  precip = false,
  max = 290,
  min = 280,
  disabled = false,
  ...props
}) {
  return (
    <Container fluid className="Weather">
        <Row>
            <Col xs lg={2}></Col>
            <Col xs lg={4} >
                <h1>Incline Village, NV</h1>
                <h4>
                    <FaMapMarkerAlt className="iconL" size={20} />
                    89450 
                </h4>
            </Col>
            <br></br>
            <Col xs lg={4} className="justify-content-md-center text-center">
                {!precip && <BsFillBrightnessAltHighFill className="iconL" size={80}/>}
                {precip && <BsCloudFill className="iconL" size={80}/>}
                <h4>
                    {max} °K / {min} °K 
                </h4>
            </Col>
            <Col xs lg={2}></Col>
        </Row>
        <Row className="justify-content-md-center" xs lg={3}>
        </Row>
    </Container>
  );
}
