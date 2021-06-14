import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";
import { FaSyncAlt } from 'react-icons/fa';
import { Jumbotron, Container, Row, Col, Card, Button, CardDeck } from "react-bootstrap";
import Youtube from '../components/Youtube';
import Weather from '../components/Weather';
import config from "../config";

export default function Home() {
  
  const [weather, setWeather] = useState([]);
  const [temp, setTemp] = useState([290]);
  const [max, setMax] = useState([290]);
  const [min, setMin] = useState([280]);
  const [precip, setPrecip] = useState([false])
  const [activity, setActivity] = useState([]);
  const [food, setFood] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  function stringify(d) {
    if (d != undefined) {
      console.log(JSON.stringify(d));
      return JSON.stringify(d);
    } else {
      return "";
    }
  }

  // This function loads an activity from the tahoe-activities-1 database.
  // TODO: take params
  function loadActivity() {
    var t = (temp - 273.15) * (9/5) + 32;
    console.log(t);
    return API.get("tahoe", `/tahoe/tahoe-activities-1/60/N`);
  }

  // This function loads an activity from the tahoe-activities-1 database.
  // TODO: take params
  function loadFood() {
    var t = (temp - 273.15) * (9/5) + 32;
    console.log(t);
    return API.get("tahoe", `/tahoe/tahoe-food-1/60/Y`);
  }

  // This function loads the weather from the weather API.
  // TODO: take params
  function loadWeather() {
    var base = "http://api.openweathermap.org/data/2.5/weather?zip=89451,US&appid="
    var key = config.weather_api.key
    var url = base+key
    var d
    var out = fetch(url)
      .then(response => response.json())
      .then(data =>  {
        var res = data;
        setWeather(res);

        d = JSON.stringify(res.main.temp);
        setTemp(d);

        if (JSON.stringify(res.weather.main) === "Clear") setPrecip(false);
        else setPrecip(true);

        setMax(JSON.stringify(res.main.temp_max));
        setMin(JSON.stringify(res.main.temp_min));
      })
    return out;
  }

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const temp = await loadWeather();
        console.log("hello");
        
        const activity = await loadActivity();
        setActivity(activity);

        const food = await loadFood();
        setFood(food);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]); // only update hook when authenticated value changes

  async function handleSubmit(event, type) {
    if (!isAuthenticated) {
      return;
    }

    setIsLoading(true);

    try {
      if (type === "activity") {
        event.preventDefault();

        const activity = await loadActivity();
        setActivity(activity);
      } else {
        event.preventDefault();

        const food = await loadFood();
        setFood(food);
      }
      
    } catch (e) {
      onError(e);
    }

    setIsLoading(false);
  }

  function renderNotesList(notes) {
    return (
      <>
        <Jumbotron className="jumbo">
          <Container>
            {/* <Row className="justify-content-md-end">
              <Col xs lg="2">
                <h3> {temp} ° K </h3>
              </Col>
            </Row> */}
            <Row className="justify-content-md-center">
              <Weather precip={precip} max={max} min={min} />
            </Row>

          </Container>
        </Jumbotron>
        <Container fluid>
            <CardDeck>
            <Card className="bg-3 text-white">
              <Card.Img variant="top" src="./food.jpeg" className="card-image-top" />
              <Card.Body>
                <Card.Title>{food.name}</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text>
                <Row className="justify-content-md-end">
                  <Button variant="btn-outline-secondary text-light fa-2x" onClick={e => handleSubmit(e, "food")} >
                  <FaSyncAlt size={25} /></Button>
                  </Row>
              </Card.Body>
            </Card>

            <Card className="bg-3 text-white">
              <Card.Img variant="top" src="./rl.png" className="card-image-top" />
              <Card.Body>
                <Card.Title>{activity.name}</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text>
                  <Row className="justify-content-md-end">
                  <Button variant="btn-outline-secondary text-light fa-2x" onClick={e => handleSubmit(e, "activity")} >
                  <FaSyncAlt size={25} /></Button>
                  </Row>
              </Card.Body>
            </Card>
            <Card className="text-white bg-3">
              <Card.Body>
                <Youtube embedId="rokGy0huYEA" />
              </Card.Body>
            </Card>
            </CardDeck>
        </Container>
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander jumbo">
        <h1>tahoe buddy</h1>
        <p className="slogan">unsure what to do? we have your back</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      // <div className="notes">
      //   <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
      //   <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      // </div>
      null
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotesList(activity) : renderLander()}
    </div>
  );
}
