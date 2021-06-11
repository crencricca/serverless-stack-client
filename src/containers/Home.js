import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";
import { Jumbotron, Container, Row, Col, Card, Button, CardDeck } from "react-bootstrap";
import Youtube from '../components/Youtube';

export default function Home() {
  
  const [temp, setTemp] = useState([65]);
  const [precip, setPrecip] = useState([])
  const [activity, setActivity] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  // This function loads an activity from the tahoe-activities-1 database.
  // TODO: take params
  function loadActivity() {
    return API.get("tahoe", `tahoe/tahoe-activities-1/${temp}/Y`);
  }

  // This function loads the weather from the weather API.
  // TODO: take params
  function loadWeather() {
    var url = "http://api.openweathermap.org/data/2.5/weather?zip=89451,US&appid=b0385345f7dde1e31b60ca3fe61aecec"
    var d
    var out = fetch(url)
      .then(response => response.json())
      .then(data =>  {
        var res = data
        d = JSON.stringify(res.main.temp)
        setTemp(d);
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
  
        const activity = await loadActivity();
        setActivity(activity);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]); // only update hook when authenticated value changes

  function renderNotesList(notes) {
    return (
      <>
        <Jumbotron fluid>
          <Container>
            <Row className="justify-content-md-end">
              <Col xs lg="1">
                <h3> {temp} </h3>
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <h1>Tahoe Buddy</h1>
            </Row>

          </Container>
        </Jumbotron>
        <Container fluid>
            <CardDeck>
            <Card className="bg-danger text-white">
              <Card.Img variant="top" src="./food.jpeg" className="card-image-top" />
              <Card.Body>
                <Card.Title>{notes.name}</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.

                  
                </Card.Text>
                {/* <Button variant="primary">Go somewhere</Button> */}
              </Card.Body>
            </Card>

            <Card className="bg-info text-white">
              <Card.Img variant="top" src="./rl.png" className="card-image-top" />
              <Card.Body>
                <Card.Title>{notes.name}</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text>
                <Button variant="light" onClick={loadActivity}>Refresh</Button>
              </Card.Body>
            </Card>
            <Card className="text-white bg-warning">
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
      <div className="lander">
        <h1>Scratch</h1>
        <p className="text-muted">A simple note taking app</p>
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
