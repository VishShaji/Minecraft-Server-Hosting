import React, { useState } from "react";
import axios from "axios";

const ServerControl = ({ status }) => {
  const [serverStatus, setServerStatus] = useState(status);

  const startServer = () => {
    axios.post("https://d6wrnrfjri.execute-api.ap-south-1.amazonaws.com/dev/start-server")
      .then(() => setServerStatus("starting"))
      .catch((err) => console.error(err));
  };

  const stopServer = () => {
    axios.post("https://d6wrnrfjri.execute-api.ap-south-1.amazonaws.com/dev/stop-server")
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
