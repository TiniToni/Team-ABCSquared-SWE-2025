import "./DashboardMain.css";

export default function DashboardMain() {
  return (
    <div className="dashboard-container">

      {/* LEFT PANEL — Units */}
      <div className="unit-panel">
        <h3>Units</h3>
        <button className="unit-btn active">Unit 1</button>
        <button className="unit-btn locked">Unit 2</button>
        <button className="unit-btn locked">Unit 3</button>
        <button className="unit-btn locked">Unit 4</button>
      </div>

      {/* CENTER PANEL — Progress */}
      <div className="progress-panel">
        <h2>Unit 1 Progress</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{width: "40%"}}></div>
        </div>
      </div>

      {/* RIGHT PANEL — Mascot */}
      <div className="mascot-panel">
        <img src="/assets/mascot/base.png" className="mascot-display"/>

        <div className="mascot-selector">
          <button className="mascot-icon"><img src="/assets/mascot/base.png"/></button>
          <button className="mascot-icon"><img src="/assets/mascot/unit1.png"/></button>
          <button className="mascot-icon locked"><img src="/assets/mascot/unit2.png"/></button>
          <button className="mascot-icon locked"><img src="/assets/mascot/unit3.png"/></button>
        </div>
      </div>

      {/* ACCOUNT BUTTON */}
      <button className="account-btn">My Account</button>
    </div>
  );
}
