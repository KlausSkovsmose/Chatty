import React from "react";
import { Loader, Modal, List } from "rsuite";
import { useContacts } from "../../context/contacts.context";
import ContactItem from "./ContactItem";

const ContactsList = ({ isOpen, onHide }) => {
  const contacts = useContacts();

  return (
    <Modal show={isOpen} onHide={onHide}>
      <Modal.Header className="text-center  ">Contacts List</Modal.Header>
      <Modal.Body>
        {!contacts && (
          <Loader center vertical content="Loading" speed="slow" size="md" />
        )}
        {contacts && contacts.length > 0 && (
          <List>
            {contacts
              .sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                  return -1;
                }
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                  return 1;
                }
                return 0;
              })
              .map((contact) => (
                <List.Item key={contact.id}>
                  <ContactItem contact={contact} />
                </List.Item>
              ))}
          </List>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ContactsList;
