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
  function loadNotes() {
    return API.get("tahoe", `/tahoe/tahoe-activities-1/65/Y`);
  }
  
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const notes = await loadNotes();
        setNotes(notes);
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
                <h3> 65° </h3>
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
                <Button variant="light">Refresh</Button>
              </Card.Body>
            </Card>
            <Card className="text-white bg-warning">
              <Card.Body>
                <Youtube embedId="rokGy0huYEA" />
              </Card.Body>
            </Card>
            </CardDeck>
        </Container>
        {/* <LinkContainer fluid to="/activities/new">
          <Row  className="justify-content-md-start fixed-bottom py-2 px-2">
            <Col xs lg="3" >
              <ListGroup.Item action className="py-3 text-nowrap text-truncate bg-light">
                <BsPencilSquare size={17} />
                <span className="ml-2 font-weight-bold">Suggest something!</span>
              </ListGroup.Item>
            </Col>
            </Row>
        </LinkContainer> */}
        {/* {notes.map(({ name, content, createdAt }) => (
          <LinkContainer key={name} to={`/notes/${name}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {content.trim().split("\n")[0]}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))} */}
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
      {isAuthenticated ? renderNotesList(notes) : renderLander()}
    </div>
  );
}
