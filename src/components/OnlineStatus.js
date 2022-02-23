import React from "react";
import { Whisper, Tooltip, Badge } from "rsuite";
import { useStatus } from "./customHooks";

const getColor = (status) => {
  if (!status) {
    return "gray";
  }

  switch (status.state) {
    case "online":
      return "green";
    case "offline":
      return "red";
    default:
      return "gray";
  }
};

const getText = (status) => {
  if (!status) {
    return "Unknown state";
  }

  return status.state === "online"
    ? "Online"
    : `Last online ${new Date(status.last_changed).toLocaleDateString()}`;
};

const OnlineStatus = ({ uid }) => {
  const status = useStatus(uid);

  return (
    <Whisper
      placement="top"
      trigger="hover"
      speaker={<Tooltip>{getText(status)}</Tooltip>}
    >
      <Badge
        className="cursor-pointer"
        style={{ backgroundColor: getColor(status) }}
      />
    </Whisper>
  );
};

export default OnlineStatus;
