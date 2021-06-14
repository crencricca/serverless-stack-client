import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { FaCloud, FaMapMarkerAlt, FaSun, FaCloudShowersHeavy, FaSnowflake, FaRegSnowflake } from "react-icons/fa";
import { BiBrightness, BiCloudRain, BiCloudSnow, BiCloudLightRain, BiCloudDrizzle } from "react-icons/bi";
import "./Weather.css";
import { BsFillBrightnessAltHighFill, BsCloudFill, BsSoundwave } from "react-icons/bs";
import { FaCloudRain } from "react-icons/fa";



export default function LoaderButton({
  isLoading,
  className = "",
  cond = "Clear",
  max = 80,
  min = 60,
  disabled = false,
  ...props
}) {
  return (
    <Container fluid className="Weather">
        <Row>
            <Col xs lg={4} className="justify-content-md-center text-center">
                {cond === "Clear" && <BsFillBrightnessAltHighFill className="icon" size={80}/>}
                {cond === "Clouds" && <BsCloudFill className="icon" size={80}/>}
                {cond === "Rain" && <BiCloudRain className="icon" size={80}/>}
                {cond === "Snow" && <BiCloudSnow className="icon" size={80}/>}
                <h4>
                    {max}° F / {min}° F 
                </h4>
            </Col>
            <Col xs lg={6} className="mx-auto my-auto text-center">
                <h1>Incline Village, NV</h1>
                <h4>
                    <FaMapMarkerAlt className="weatherIcon" size={20} />
                    89450 
                </h4>
            </Col>
            <br></br>
            <Col xs lg={2}></Col>
        </Row>
        <Row className="justify-content-md-center" xs lg={3}>
        </Row>
    </Container>
  );
}
