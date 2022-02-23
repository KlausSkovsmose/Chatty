import React from "react";
import { Button, FlexboxGrid, Icon } from "rsuite";
import { useProfile } from "../../context/profile.context";
import { database } from "../../firebase";
import { useModalState } from "../customHooks";
import EditContactModal from "./EditContactModal";
//import TimeAgo from 'timeago-react';

const ContactItem = ({ contact }) => {
  const { name, phone, email, createdAt, id, address } = contact;
  const { profile } = useProfile();
  const { isOpen, close, open } = useModalState();

  const handleDelete = () => {
    if (!window.confirm(`Are you sure you want to delete ${name}`)) return;
    database.ref(`contacts/${profile.uid}`).child(id).set(null);
  };

  const showEditForm = () => {
    open();
  };

  const onHide = () => {
    close();
  };

  return (
    <FlexboxGrid justify="space-between">
      <FlexboxGrid.Item>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="text-disappear">{name}</h5>
        </div>

        <div className="d-flex align-items-center text-black-70">
          <span>Phone: {phone}</span>
        </div>
        <div className="d-flex align-items-center text-black-70">
          <span>Email: {email}</span>
        </div>
        <div className="d-flex align-items-center text-black-70">
          <span>Address: {address}</span>
        </div>
        <div className="d-flex align-items-center text-black-70">
          <span>On your list since {new Date(createdAt).toDateString()}</span>
        </div>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item>
        <div>
          <Button block color="green" onClick={showEditForm}>
            <Icon icon="edit" /> edit
          </Button>
        </div>
        <div className="mt-3">
          <Button block color="red" onClick={handleDelete}>
            <Icon icon="trash" /> delete
          </Button>
        </div>
        <EditContactModal isOpen={isOpen} onHide={onHide} id={id} />
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default ContactItem;
