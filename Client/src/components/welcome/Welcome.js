import React from "react";
import { Link } from "react-router-dom";
import video from "./videoHome.mp4";

import "./Welcome.css";

export default function Welcome() {
  return (
    <div className="main_class">
      <Link className="button" role="button" to="/home">
        <span>START</span>
      </Link>
      <video className="video" autoPlay loop muted>
        <source src={video} type="video/mp4"></source>
      </video>
    </div>
  );
}
