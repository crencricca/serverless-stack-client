import API from "@aws-amplify/api";
import React, { useState, useRef } from "react"; 
import LoaderButton from "../components/LoaderButton";
import Form from "react-bootstrap/Form"; 
import "./SuggestRestaurant.css"; 
import { Jumbotron } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { s3Upload } from "../libs/awsLib";


export default function SuggestRestaurant() {
    const suggestionFile = useRef(""); 
    const [restaurantName, setRestaurantName] = useState(""); 
    const [restaurantCategory, setRestaurantCategory] = useState(""); 
    const [restaurantHotness, setRestaurantHotness] = useState(false); 
    const [restaurantColdness, setRestaurantColdness] = useState(false);
    const [restaurantTemperateness, setRestaurantTemperatness] = useState(false); 
    const [restaurantRainyness, setRestaurantRainyness] = useState(false); 
    const [restaurantSnowyness, setRestaurantSnowyness] = useState(false); // we don't use as of now

    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory(); 
    const TABLE_NAME = 'tahoe-food-1'

    function validateForm() {
        return restaurantName.length > 0 & restaurantCategory.length > 0; 
    }

    function handleFileChange(event) {
        suggestionFile.current = event.target.files[0];
    }


    /**
     * API Call requires: 
     *   a name, fileName, songLink, cold, hot, temperate, tableName, & precip. 
     */
    async function submitForm(event) {
        event.preventDefault(); 

        setIsLoading(true);

    // Change variable declaration to match API request keys
        const name = restaurantName; 
        const description = restaurantCategory;
        const songLink = ""; 
        const cold = (restaurantColdness ? "Y" : "N");
        const hot = (restaurantHotness ? "Y" : "N");
        const temperate = (restaurantTemperateness ? "Y" : "N");
        const precip = (restaurantRainyness ? "Y" : "N"); 

        try {
            const fileName = suggestionFile.current ? await s3Upload(suggestionFile.current) : null; 
            await postRestaurantEntry(
                {name,
                fileName,
                description,
                songLink, 
                cold, 
                hot,
                temperate,
                "tableName" : TABLE_NAME,
                precip 
            }); 
            history.push("/suggestion/another")
        }

        catch (e) {
            onError(e);
            setIsLoading(false); 
        }
    }

    function postRestaurantEntry(restaurantInformation) {
        return API.post("tahoe", "/tahoe", {
            body: restaurantInformation
        }); 
    }

    return (
        <Jumbotron>
                <h1> suggest a restaurant </h1>
                <p class="lead">fill out the fields below to have your suggestion added to our database!</p>
                <hr></hr>
                <div className = "Restaurant Suggestion"> 
                    <Form onSubmit = {submitForm}> 


                        <Form.Group controlId="restaurantName">
                            <Form.Label> 1. what's the restaurant name?</Form.Label> 
                            <Form.Control 
                                value = {restaurantName}
                                type="text"
                                placeholder="jimmy's cheeto shop"
                                onChange={(e) => setRestaurantName(e.target.value)}
                            /> 
                        </Form.Group>

                        <Form.Group controlId="restaurantCateogory">
                            <Form.Label> 2. what kind of food is here?</Form.Label> 
                            <Form.Control 
                                value = {restaurantCategory}
                                type="text"
                                placeholder="really good food"
                                onChange={(e) => setRestaurantCategory(e.target.value)}
                            /> 
                        </Form.Group>
                        <hr></hr>

                        <p class = 'lead'> and you'd eat here... </p>
                        <Form.Group controlId="restaurantHotness">
                            <Form.Check 
                                type="checkbox" 
                                label="when it's hot outside." 
                                inline
                                onChange={(e) => setRestaurantHotness(e.target.value)}/>

                            <Form.Check 
                                type="checkbox" 
                                label="when it's cold outside." 
                                inline
                                onChange={(e) => setRestaurantColdness(e.target.value)}/>

                            <Form.Check 
                                type="checkbox" 
                                label="when it's not too hot but not too cold..." 
                                inline
                                onChange={(e) => setRestaurantTemperatness(e.target.value)}/>             

                        </Form.Group>

                        <p class = 'lead'> how about when it's ... </p>


                        <Form.Group controlId="restaurantWeather">

                            <Form.Check 
                                    type="checkbox" 
                                    label="raining outside?"
                                    inline
                                    onChange={(e) => setRestaurantRainyness(e.target.value)}/>

                            <Form.Check 
                                    type="checkbox" 
                                    label="snowing outside?"
                                    inline
                                    onChange={(e) => setRestaurantSnowyness(e.target.value)}/>
                        </Form.Group>
                        
                        <LoaderButton
                            block
                            type="submit"
                            size="lg"
                            variant="primary"
                            isLoading={isLoading}
                            disabled={!validateForm()}
                        >
                            take my suggestion!
                        </LoaderButton>
                    </Form>
                </div>   
        </Jumbotron>
    );
}