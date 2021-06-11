import API from "@aws-amplify/api";
import React, { useState, useRef } from "react"; 
import LoaderButton from "../components/LoaderButton";
import Form from "react-bootstrap/Form"; 
import "./SuggestSong.css"; 
import { Jumbotron } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";


export default function Suggestsong() {
    const suggestionFileName = useRef(""); 
    const [songName, setsongName] = useState(""); 
    const [songCategory, setsongCategory] = useState(""); 
    const [suggestionSongLink, setSongLink] = useState("");
    const [songHotness, setsongHotness] = useState(false); 
    const [songColdness, setsongColdness] = useState(false);
    const [songTemperateness, setsongTemperatness] = useState(false); 
    const [songRainyness, setsongRainyness] = useState(false); 
    const [songSnowyness, setsongSnowyness] = useState(false); // we don't use as of now

    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory(); 
    const TABLE_NAME = 'tahoe-songs-1'

    function validateForm() {
        return songName.length > 0 & songCategory.length > 0; 
    }

    /**
     * API Call requires: 
     *   a name, fileName, songLink, cold, hot, temperate, tableName, & precip. 
     */
    async function submitForm(event) {
        event.preventDefault(); 

        setIsLoading(true);

    // Change variable declaration to match API request keys
        const name = songName; 
        const description = songCategory;
        const fileName = suggestionFileName; 
        const songLink = suggestionSongLink; 
        const cold = (songColdness ? "Y" : "N");
        const hot = (songHotness ? "Y" : "N");
        const temperate = (songTemperateness ? "Y" : "N");
        const precip = (songRainyness ? "Y" : "N"); 

        try {
            await postsongEntry(
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

    function postsongEntry(songInformation) {
        return API.post("tahoe", "/tahoe", {
            body: songInformation
        }); 
    }

    return (
        <Jumbotron>
                <h1> suggest a song </h1>
                <p class="lead">fill out the fields below to have your suggestion added to our database!</p>
                <hr></hr>
                <div className = "song Suggestion"> 
                    <Form onSubmit = {submitForm}> 


                        <Form.Group controlId="songName">
                            <Form.Label> 1. what's the song name?</Form.Label> 
                            <Form.Control 
                                value = {songName}
                                type="text"
                                placeholder="rihanna - disturbia"
                                onChange={(e) => setsongName(e.target.value)}
                            /> 
                        </Form.Group>

                        <Form.Group controlId="songCateogory">
                            <Form.Label> 2. what kind of song is this?</Form.Label> 
                            <Form.Control 
                                value = {songCategory}
                                type="text"
                                placeholder="makes me wanna cry"
                                onChange={(e) => setsongCategory(e.target.value)}
                            /> 
                        </Form.Group>


                        <Form.Group controlId="songCateogory">
                            <Form.Label> 3. what's the youtube link for this song? </Form.Label> 
                            <Form.Control 
                                value = {songLink}
                                type="text"
                                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                onChange={(e) => setSongLink(e.target.value)}
                            /> 
                        </Form.Group>
                        <hr></hr>

                        <p class = 'lead'> and you'd listen to this... </p>
                        <Form.Group controlId="songHotness">
                            <Form.Check 
                                type="checkbox" 
                                label="when it's hot outside." 
                                inline
                                onChange={(e) => setsongHotness(e.target.value)}/>

                            <Form.Check 
                                type="checkbox" 
                                label="when it's cold outside." 
                                inline
                                onChange={(e) => setsongColdness(e.target.value)}/>

                            <Form.Check 
                                type="checkbox" 
                                label="when it's not too hot but not too cold..." 
                                inline
                                onChange={(e) => setsongTemperatness(e.target.value)}/>             

                        </Form.Group>

                        <p class = 'lead'> how about when it's ... </p>


                        <Form.Group controlId="songWeather">

                            <Form.Check 
                                    type="checkbox" 
                                    label="raining outside?"
                                    inline
                                    onChange={(e) => setsongRainyness(e.target.value)}/>

                            <Form.Check 
                                    type="checkbox" 
                                    label="snowing outside?"
                                    inline
                                    onChange={(e) => setsongSnowyness(e.target.value)}/>
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