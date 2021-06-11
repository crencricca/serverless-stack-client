import React from "react";
import "./Suggest.css";
import { Jumbotron, Container, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function Suggest() {
    return (
        <>

            <Jumbotron> 
                <h1 class="display-4">i want to suggest...</h1>
                <hr class="my-4">
                    </hr> 

                <Container>
                    <LinkContainer to="/suggestion/restaurant">
                        <Button size='lg' block>
                            a restaurant.
                        </Button>      
                    </LinkContainer>
              
                    <LinkContainer to="/suggestion/activity">
                        <Button size='lg' block>
                            an activity.
                        </Button>      
                    </LinkContainer>                   
                    
                    <LinkContainer to="/suggestion/song">
                        <Button size='lg' block>
                            a song. 
                        </Button>      
                    </LinkContainer>
                </Container>
            </Jumbotron>

        </> 
    );
}