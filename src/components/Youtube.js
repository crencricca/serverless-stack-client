import React from "react";
import Button from "react-bootstrap/Button";
import { BsArrowRepeat } from "react-icons/bs";
import "./LoaderButton.css";

export default function Youtube({
  isLoading,
  className = "",
  disabled = false,
  embedId = "5QP_W-yAlRc",
  ...props
}) {
  return (
    <div id="video">
        <iframe className="mx-auto my-auto h-100 w-100"
            width="400"
            height="350"
            src={`https://www.youtube.com/embed/${embedId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            volume="0"
            title="Embedded youtube"
        />
    </div>
  );
}
