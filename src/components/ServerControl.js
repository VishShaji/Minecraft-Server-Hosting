import React, { useState } from "react";
import axios from "axios";

const ServerControl = ({ status }) => {
  const [serverStatus, setServerStatus] = useState(status);

  const startServer = () => {
    axios.post("http://localhost:5000/start-server") // Update with Amplify backend URL
      .then(() => setServerStatus("starting"))
      .catch((err) => console.error(err));
  };

  const stopServer = () => {
    axios.post("http://localhost:5000/stop-server") // Update with Amplify backend URL
      .then(() => setServerStatus("stopped"))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <p>Current Server Status: {serverStatus}</p>
      {serverStatus === "stopped" ? (
        <button onClick={startServer}>Start Server</button>
      ) : (
        <button onClick={stopServer}>Stop Server</button>
      )}
    </div>
  );
};

export default ServerControl;
