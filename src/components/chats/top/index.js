import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Icon } from "rsuite";
import { useCurrentChat } from "../../../context/current-chat.context";
import { useMediaQuery } from "../../customHooks";

const Top = () => {
  const recipient = useCurrentChat((v) => v.recipient);
  const isMobile = useMediaQuery("(max-width: 992px)");

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="text-disappear d-flex align-items-center">
          <Icon
            componentClass={Link}
            to="/"
            icon="arrow-circle-left"
            size="2x"
            className={
              isMobile
                ? "d-inline-block p-0 mr-2 text-blue link-unstyled"
                : "d-none"
            }
          />
          <span className="text-disappear">{recipient}</span>
        </h4>
      </div>
    </div>
  );
};

export default memo(Top);
