import { Link } from "react-router-dom";
import { useState } from "react";
import "./DashboardMain.css";

// Import images
import Illustration from "../assets/pixel-art-cheeseburger-seamless-background.png";
import BaseCreature from "../assets/basecreature.png";
import CreatureCook from "../assets/creaturecook.png";

export default function DashboardMain() {
  // Simple array of general safety tips
  const safetyTips = [
    "Always wash your hands before cooking.",
    "Keep raw meat separate from vegetables.",
    "Use oven mitts to handle hot pans.",
    "Keep a fire extinguisher nearby.",
    "Clean spills immediately to prevent slips."
  ];

  const [tip] = useState(safetyTips[Math.floor(Math.random() * safetyTips.length)]);
  const [currentCreature, setCurrentCreature] = useState(BaseCreature);

  return (
    <div className="dashboard-container">

      {/*units to be continued*/}
      <div className="unit-panel">
        <h3 className="panel-title">Units</h3>

        <Link to="/lesson/1">
          <button className="unit-btn unlocked">Unit 1</button>
        </Link>

        <button className="unit-btn locked">Unit 2</button>
        <button className="unit-btn locked">Unit 3</button>
        <button className="unit-btn locked">Unit 4</button>
      </div>

      {/* Middle panel: image + safety tip */}
      <div className="middle-panel">
        <div className="middle-image">
          <img src={Illustration} alt="Cooking illustration" />
        </div>
        <div className="safety-tip">
          <p>{tip}</p>
        </div>
      </div>

      {/* the mascot guy*/}
      <div className="mascot-panel">
        <img 
          src={currentCreature} 
          className="mascot-display" 
          key={currentCreature} // ensures fade works on change
        />

        <div className="mascot-selector">
          <button className="mascot-icon" onClick={() => setCurrentCreature(BaseCreature)}>
            <img src={BaseCreature} alt="Base creature"/>
          </button>
          <button className="mascot-icon" onClick={() => setCurrentCreature(CreatureCook)}>
            <img src={CreatureCook} alt="Cook creature"/>
          </button>
          <button className="mascot-icon locked"><img src={BaseCreature} alt="Locked"/></button>
          <button className="mascot-icon locked"><img src={CreatureCook} alt="Locked"/></button>
        </div>
      </div>

      {/* ACCOUNT BUTTON
      <button className="account-btn">My Account</button> */}
    </div>
  );
}
