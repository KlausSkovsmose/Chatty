import React, { useState } from "react";
import { Alert, Button, Icon, Modal, SelectPicker } from "rsuite";
import firebase from "firebase/app";
import { useContacts } from "../context/contacts.context";
import { useProfile } from "../context/profile.context";
import { database } from "../firebase";
import { useModalState } from "./customHooks";
import { useChats } from "../context/chats.context";
import { useHistory } from "react-router";

const StartChatBtn = () => {
  const contacts = useContacts();
  const { isOpen, open, close } = useModalState();
  const [recipient, setRecipient] = useState("");
  const { profile } = useProfile();
  const chats = useChats();
  let history = useHistory();

  const handleChange = (value) => {
    setRecipient(value);
  };

  const onStart = async () => {
    if (recipient === "") {
      Alert.warning("Please Select a Contact to Start a Chat");
      return;
    }

    const hasChattedBefore = chats.filter((c) =>
      c.members.find((m) => m === recipient)
    )[0];

    if (hasChattedBefore) {
      setRecipient("");
      close();
      history.push(`/chats/${hasChattedBefore.id}`);
    } else {
      const updates = {};
      const chat = {
        members: [recipient, profile.email],
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      };

      const chatId = database.ref("chats").push().key;
      updates[`/chats/${chatId}`] = chat;
      await database.ref().update(updates);
      setRecipient("");
      close();
      history.push(`/chats/${chatId}`);
    }
  };

  return (
    <div className="mt-1">
      <Button block color="green" onClick={open}>
        <Icon icon="comments" /> Start Chat
      </Button>

      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Start Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SelectPicker
            data={contacts}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button block appearance="primary" onClick={onStart}>
            Start
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StartChatBtn;
