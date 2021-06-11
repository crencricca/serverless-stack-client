import React from "react";
import "./AnotherSuggestion.css";
import { Jumbotron, Container, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function Suggest() {
    return (
        <>

            <Jumbotron> 
                <h1 class="display-4">would you want to make another suggestion?</h1>
                <hr class="my-4">
                    </hr> 

                <Container>
                    <LinkContainer to="/">
                        <Button size='lg' block>
                            no. take me to the dashboard!
                        </Button>      
                    </LinkContainer>
              
                    <LinkContainer to="/suggestion">
                        <Button size='lg' block>
                            yes! let me fill this database up!!
                        </Button>      
                    </LinkContainer>                   
                    
                </Container>
            </Jumbotron>

        </> 
    );
}