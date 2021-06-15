import API from "@aws-amplify/api";
import React, { useState, useEffect, useRef } from "react"; 
import LoaderButton from "../components/LoaderButton";
import Form from "react-bootstrap/Form"; 
import "./SuggestSong.css"; 
import { Jumbotron } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import config from "../config";


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
    const [songValid, setsongValid] = useState(false); //


    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory(); 
    const TABLE_NAME = 'tahoe-songs-1'

    function validateForm() {
        const nameCheck = songName.length > 0 & songCategory.length > 0;
        const heatCheck = songHotness || songColdness || songTemperateness; 
        const weatherCheck = songRainyness || songSnowyness; 
        const songCheck = songValid;
        return nameCheck && heatCheck && songCheck; 
    }
        
    // start url verification
    function get_url_id(url) {
        if (url.length < 34) {
            return "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
    
        var split_link = "watch?v="
        var split_list = "&list"
    
        var res1 = url.split(split_link)[1]
        var new_url = res1.split(split_list)[0];
    
        return new_url
    }
    function validateSongURL(songLink) {
        console.log("url is",songLink)
        var vid_id = get_url_id(songLink)
        var url_base = "https://www.googleapis.com/youtube/v3/videos?part=id&id="
        var follow = "&key="
        var api_key = config.youtube_api.key
        var url = url_base + vid_id + follow + api_key
    
        var error = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    
        var d
        var output
        var out = fetch(url)
            .then(response => response.json())
            .then(data =>  {
                var res = data
    
                d = JSON.stringify(res.pageInfo.totalResults)    
                if (JSON.stringify(res.pageInfo.totalResults) == 1) {
                    console.log("good is:",songLink)
                    output = songLink
                    setSongLink(output)
                    setsongValid(true)
                    return output
                } else if (JSON.stringify(res.pageInfo.totalResults) == 0)  {
                    console.log("error is:",error)
                    output = error
                    setSongLink(output)
                    return output
                }
            })
        console.log("output is",output)
        return output
    }
    useEffect((songLink) => {
        async function onLoad() {
            try {
                const suggestionSongLink = await validateSongURL(songLink);
            } catch (e) {
                //onError(e);
            }
        }
        onLoad();
    },[]); // only update hook when authenticated value changes


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
            console.log("final youtube is:",songLink)

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
                            <Form.Label> 1. song name and artist?</Form.Label> 
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
                                type="text"
                                placeholder="Rick Roll"
                                onChange={(e) => validateSongURL(e.target.value)}

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