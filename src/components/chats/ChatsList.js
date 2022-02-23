import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Nav, Loader } from "rsuite";
import { useChats } from "../../context/chats.context";
import ChatItem from "./ChatItem";

const ChatsList = ({ aboveElHeight }) => {
  const chats = useChats();
  const location = useLocation();

  return (
    <Nav
      appearance="subtle"
      vertical
      reversed
      className="overflow-y-scroll custom-scroll"
      style={{
        height: `calc(100% - ${aboveElHeight}px)`,
      }}
      activeKey={location.pathname}
    >
      {!chats && (
        <Loader center vertical content="Loading" speed="slow" size="md" />
      )}
      {chats &&
        chats.length > 0 &&
        chats.map((chat) => (
          <Nav.Item
            componentClass={Link}
            to={`/chats/${chat.id}`}
            key={chat.id}
            eventKey={`/chats/${chat.id}`}
          >
            <ChatItem chat={chat} />
          </Nav.Item>
        ))}
    </Nav>
  );
};

export default ChatsList;
