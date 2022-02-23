import React, { useState, useCallback, useRef } from "react";
import {
  Button,
  Icon,
  Modal,
  Form,
  ControlLabel,
  FormControl,
  FormGroup,
  Schema,
  Alert,
} from "rsuite";
import firebase from "firebase/app";
import { database } from "../firebase";
import { useModalState } from "./customHooks";
import { useProfile } from "../context/profile.context";

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired("Name is required"),
  email: StringType().isRequired("Email is required"),
  phone: NumberType().isRequired("Phone is required"),
  address: StringType(),
});

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

const AddContactToggle = () => {
  const { isOpen, open, close } = useModalState();
  const { profile } = useProfile();

  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();

  const onFormChange = useCallback((value) => {
    setFormValue(value);
  }, []);

  const onSubmit = async () => {
    if (!formRef.current.check()) {
      return;
    }

    setIsLoading(true);
    formValue.email = formValue.email.toLowerCase();
    const contactData = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };

    try {
      const userContacts = database.ref(`/contacts/${profile.uid}`);

      await userContacts.push(contactData);

      Alert.info(`${formValue.name} has been created`, 4000);

      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close();
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 4000);
    }
  };

  return (
    <div className="mt-1">
      <Button block color="green" onClick={open}>
        <Icon icon="creative" /> Add Contact
      </Button>

      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Add a New Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            onChange={onFormChange}
            formValue={formValue}
            model={model}
            ref={formRef}
          >
            <FormGroup>
              <ControlLabel>Name</ControlLabel>
              <FormControl name="name" placeholder="Name" />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Email</ControlLabel>
              <FormControl name="email" type="email" placeholder="E-mail" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Phone</ControlLabel>
              <FormControl
                name="phone"
                type="number"
                placeholder="Phone Number"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Address</ControlLabel>
              <FormControl name="address" placeholder="Address" />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddContactToggle;
