import React, { useContext } from "react";
import noteContext from "../context/notes/noteContext";

function About() {
  const a = useContext(noteContext);
  
  return (
    <div>
      About {a.name} and he is in class {a.class}
    </div>
  );
}

export default About;
