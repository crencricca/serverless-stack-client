import React from "react";
import "./Home.css";
import AllocationPanel from "../panels/AllocationPanel"
import InfoPanel from "../panels/InfoPanel"

export default function Home() {
  return (
    <div className="Home">
      <div className="panels">
        <div className="panel-info">
          <InfoPanel />
        </div>
        <div className="panel-allocation">
          <AllocationPanel />
        </div>
      </div>
    </div>
  );
}
