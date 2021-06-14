import API from "@aws-amplify/api";
import React, { useState, useRef } from "react"; 
import LoaderButton from "../components/LoaderButton";
import Form from "react-bootstrap/Form"; 
import "./SuggestRestaurant.css"; 
import { Jumbotron } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { s3Upload } from "../libs/awsLib";



export default function SuggestActivity() {
    const suggestionFile = useRef(""); 
    const [activityName, setActivityName] = useState(""); 
    const [activityCategory, setActivityCategory] = useState(""); 
    const [activityHotness, setActivityHotness] = useState(false); 
    const [activityColdness, setActivityColdness] = useState(false);
    const [activityTemperateness, setActivityTemperateness] = useState(false); 
    const [activityRainyness, setActivityRainyness] = useState(false); 
    const [activitySnowyness, setActivitySnowyness] = useState(false); // we don't use as of now

    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory(); 
    const TABLE_NAME = 'tahoe-activities-1'

    function validateForm() {
        return activityName.length > 0 & activityCategory.length > 0; 
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
        const name = activityName.toLowerCase(); 
        const description = activityCategory; 
        const songLink = ""; 
        const cold = (activityColdness ? "Y" : "N");
        const hot = (activityHotness ? "Y" : "N");
        const temperate = (activityTemperateness ? "Y" : "N");
        const precip = (activityRainyness ? "Y" : "N"); 

        try {
            const fileName = suggestionFile.current ? await s3Upload(suggestionFile.current) : null; 
            await postActivityEntry(
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
            history.push("/suggestion/another");
        }

        catch (e) {
            onError(e);
            setIsLoading(false); 
        }
    }

    function postActivityEntry(activityInformation) {
        return API.post("tahoe", "/tahoe", {
            body: activityInformation
        }); 
    }

    return (
        <Jumbotron>
                <h1 className ="suggestion-title"> suggest an activity </h1>
                <p className="lead">fill out the fields below to have your suggestion added to our database!</p>
                <hr></hr>
                <div className = "Activity Suggestion"> 
                    <Form onSubmit = {submitForm}> 


                        <Form.Group controlId="ActivityName">
                            <Form.Label className = "suggestion-title"> 1. what do you suggest we do?</Form.Label> 
                            <Form.Control 
                                value = {activityName}
                                type="text"
                                placeholder="hike to jimmy's cheeto shop"
                                onChange={(e) => setActivityName(e.target.value)}
                            /> 
                        </Form.Group>

                        <Form.Group controlId="ActivityCateogory">
                            <Form.Label className = "suggestion-title"> 2. what kind of activity is this?</Form.Label> 
                            <Form.Control 
                                value = {activityCategory}
                                type="text"
                                placeholder="it's a trail!"
                                onChange={(e) => setActivityCategory(e.target.value)}
                            /> 
                        </Form.Group>
                        <hr></hr>

                        <p className = 'lead'> and you'd do this... </p>
                        <Form.Group controlId="activityHotness">
                            <Form.Check 
                                type="checkbox" 
                                label="when it's hot outside." 
                                inline
                                onChange={(e) => setActivityHotness(e.target.value)}/>

                            <Form.Check 
                                type="checkbox" 
                                label="when it's cold outside." 
                                inline
                                onChange={(e) => setActivityColdness(e.target.value)}/>

                            <Form.Check 
                                type="checkbox" 
                                label="when it's not too hot but not too cold..." 
                                inline
                                onChange={(e) => setActivityTemperateness(e.target.value)}/>             

                        </Form.Group>

                        <p className = 'lead'> how about when it's ... </p>


                        <Form.Group controlId="activityWeather">

                            <Form.Check 
                                    type="checkbox" 
                                    label="raining outside?"
                                    inline
                                    onChange={(e) => setActivityRainyness(e.target.value)}/>

                            <Form.Check 
                                    type="checkbox" 
                                    label="snowing outside?"
                                    inline
                                    onChange={(e) => setActivitySnowyness(e.target.value)}/>
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