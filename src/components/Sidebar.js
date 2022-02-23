import React, { useEffect, useRef, useState } from "react";
import ToggleDashboard from "./dashboard/ToggleDashboard";
import AddContactToggle from "./AddContactToggle";
import { Divider, Button, Icon } from "rsuite";
import ContactsList from "./contacts/ContactsList";
import StartChatBtn from "./StartChatBtn";
import ChatsList from "./chats/ChatsList";
import { useModalState } from "./customHooks";

const Sidebar = () => {
  const topSidebarRef = useRef();
  const [height, setHeight] = useState(0);
  const { isOpen, close, open } = useModalState();

  const showContacts = () => {
    open();
  };

  const hideContacts = () => {
    close();
  };

  useEffect(() => {
    if (topSidebarRef.current) {
      setHeight(topSidebarRef.current.scrollHeight);
    }
  }, [topSidebarRef]);
  return (
    <div className="h-100 pt-2">
      <div ref={topSidebarRef}>
        <ToggleDashboard />
        <AddContactToggle />
        <Button className="mt-1" block color="green" onClick={showContacts}>
          <Icon icon="phone" /> My Contacts
        </Button>
        <StartChatBtn />
        <Divider>Chats List</Divider>
      </div>
      <ContactsList isOpen={isOpen} onHide={hideContacts} />
      <ChatsList aboveElHeight={height} />
    </div>
  );
};

export default Sidebar;
