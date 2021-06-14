import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";
import { FaSyncAlt, FaUtensils, FaHiking } from 'react-icons/fa';
import { Jumbotron, Container, Row, Col, Card, Button, CardDeck } from "react-bootstrap";
import Youtube from '../components/Youtube';
import Weather from '../components/Weather';
import config from "../config";

export default function Home() {
  
  const [weather, setWeather] = useState([]);
  const [temp, setTemp] = useState([290]);
  const [max, setMax] = useState([290]);
  const [min, setMin] = useState([280]);
  const [cond, setCond] = useState(["Clear"])
  const [activity, setActivity] = useState([]);
  const [food, setFood] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [foodVar, setFoodVar] = useState([0]);
  const [actVar, setActVar] = useState([0]);

  function getFoodCardTitle() {
    const foodCategoryTexts = [
      "really really good food", 
      "great bite for a great day", 
      "not as good as jimmy's cheeto shop",
      "better than SNU dining food"
    ];

   return foodCategoryTexts[foodVar];
  }

  function getFoodCardDescription() {
    const foodDescriptionFillerTexts = [
      "seems like today's weather calls for some ${foodName}... go grab some friends and head out!",
      "wouldn't want to have anything besides some ${foodName} today - why don't you get it for lunch?",
      "have you had ${foodName} recently? seems like a good idea to get for lunch today!", 
      "could i venture to offer ${foodName} as the restaurant of choice today?",
      "what about some ${foodName} for lunch?",
      "have you checked out ${foodName} yet? no? today's the day!",
      "haven't you been missing the food from ${foodName} recently?"
    ];

    var text = foodDescriptionFillerTexts[foodVar];
    return text.replace("${foodName}", food.name); 
  }

  function getActivityCardTitle() {
    const activityCategoryTexts = [
      "this is probably the best suggestion in here", 
      "hey, it's better than sitting at your desk...", 
      "to quote nike: just do it!",
      "don't forget to invite the interns!",
      "you might need to change shoes for this"
    ];

   return activityCategoryTexts[actVar];
  }

  function getActivityCardDescription() {
    const activityDescriptionFillerTexts = [
      "beautiful day to go to ${activityName}, isn't it?",
      "go get some friends! let's go to ${activityName} after work!", 
      "i haven't really gone to ${activityName} in a while...",
      "i normally hate to ${activityName} but i think it's the optimal choice for today!",
    ];

    var activityDescription = activityDescriptionFillerTexts[actVar]; 
    return activityDescription.replace("${activityName}", activity.name);
  }

  function stringify(d) {
    if (d != undefined) {
      console.log(JSON.stringify(d));
      return JSON.stringify(d);
    } else {
      return "";
    }
  }

  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  // This function loads an activity from the tahoe-activities-1 database.
  // TODO: take params
  function loadActivity() {
    return API.get("tahoe", `/tahoe/tahoe-activities-1/60/N`);
  }

  // This function loads an activity from the tahoe-activities-1 database.
  // TODO: take params
  function loadFood() {
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
        
        setCond(res.weather[0].main);

        var high = parseInt((res.main.temp_max - 273.15) * (9/5) + 32);
        var low = parseInt((res.main.temp_min - 273.15) * (9/5) + 32);
      
        setMax(JSON.stringify(high));
        setMin(JSON.stringify(low));
      })
    return out;
  }

  useEffect(() => {
    async function onLoad() {
      console.log("in effect");
      if (!isAuthenticated) {
        console.log("not auth"); //this auth flag us broken sometimes 
        return;
      }
  
      try {
        console.log("fetching weathe");
        const temp = await loadWeather();
        
        const activity = await loadActivity();
        setActivity(activity);

        const food = await loadFood();
        setFood(food);

        setFoodVar(randomIntFromInterval(0, 3));
        setActVar(randomIntFromInterval(0, 3));
      } catch (e) {
        console.log("erroring baby");
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
    event.preventDefault();
    setIsLoading(true);

    try {
      if (type === "activity") {
        const activity = await loadActivity();
        setActivity(activity);
        setActVar(randomIntFromInterval(0, 3));
      } else if (type === "food") {
        const food = await loadFood();
        setFood(food);
        setFoodVar(randomIntFromInterval(0, 3));
      }
      
    } catch (e) {
      onError(e);
    }

    setIsLoading(false);
  }

  function renderNotesList(notes) {

    // const activityName = activity.name; 
    // const activityDescription = activityDescriptionFillerTexts[randomIntFromInterval(0, 3)]; 
    // const activityCardTitle = "${activityName}".replace("${activityName}", activityName); 
    // const activityCardDescription = activityDescription.replace("${activityName}", activityName);
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
              <Weather cond={cond} max={max} min={min} />
            </Row>

          </Container>
        </Jumbotron>
        <Container fluid>
            <CardDeck>
            <Card className="bg-3 text-white">
            <Card.Header className="bg-1">
                  <Row className="text-center mx-auto w-100">
                    <Col xs lg={12}>
                    <p>{getFoodCardDescription()}</p>
                    </Col>
                    </Row>
                </Card.Header>
              <Card.Body>
                <Card.Text> 
                  <Row className="card-text mx-auto w-100 my-auto h-100">
                    <Col xs lg={2} className="justify-content-md-center my-auto">
                      <h1>
                    <FaUtensils className="iconL" size={30} /> 
                    </h1>
                    </Col>
                    <Col xs lg={9}>
                      <br></br>
                      <h3 className="card-title"> {food.name}</h3>
                      <h6 className="card-title">{getFoodCardTitle()}</h6>
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col xs lg={10}>
                    </Col>
                  </Row> */}
                    </Card.Text>
              </Card.Body>
              <Card.Footer className="card-footer">
                <Row className="justify-content-md-end my-auto h-100">
                  <Col xs lg={1}></Col>
                  <Col xs lg={9}>
                  </Col>
                  <Col xs lg={2}>
                  <Button variant="btn-outline-secondary text-light fa-2x" onClick={e => handleSubmit(e, "food")} >
                  <FaSyncAlt size={25} /> 
                  </Button>
                  </Col>
                  </Row>
                  </Card.Footer>
            </Card>

            <Card className="bg-3 text-white">
            <Card.Header className="bg-1">
                  <Row className="text-center mx-auto w-100">
                    <Col xs lg={12}>
                    <p>{getActivityCardDescription()}</p>
                    </Col>
                    </Row>
                </Card.Header>
              <Card.Body>
                <Card.Text> 
                  <Row className="card-text mx-auto w-100 my-auto h-100">
                    <Col xs lg={2} className="justify-content-md-center my-auto">
                      <h1>
                    <FaHiking className="iconL" size={30} /> 
                    </h1>
                    </Col>
                    <Col xs lg={9}>
                      <br></br>
                      <h3 className="card-title"> {activity.name}</h3>
                      <h6 className="card-title">{getActivityCardTitle()}</h6>
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col xs lg={10}>
                    </Col>
                  </Row> */}
                    </Card.Text>
              </Card.Body>
              <Card.Footer className="card-footer">
                <Row className="justify-content-md-end my-auto h-100">
                  <Col xs lg={1}></Col>
                  <Col xs lg={9}>
                  </Col>
                  <Col xs lg={2}>
                  <Button variant="btn-outline-secondary text-light fa-2x" onClick={e => handleSubmit(e, "activity")} >
                  <FaSyncAlt size={25} /> 
                  </Button>
                  </Col>
                  </Row>
                  </Card.Footer>
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
        <p className="slogan">unsure what to do? we have your back. </p>
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
