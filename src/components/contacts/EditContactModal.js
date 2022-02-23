import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  ControlLabel,
  FormControl,
  FormGroup,
  Schema,
  Alert,
} from "rsuite";
import { useProfile } from "../../context/profile.context";
import { database } from "../../firebase";

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired("Name is required"),
  phone: NumberType().isRequired("Phone is required"),
  address: StringType(),
});

const EditContactModal = ({ id, isOpen, onHide }) => {
  const { profile } = useProfile();
  const [formValue, setFormValue] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const formRef = useRef();

  const onFormChange = useCallback((value) => {
    setFormValue(value);
  }, []);

  const onSave = async () => {
    if (!formRef.current.check()) {
      return;
    }
    try {
      await database.ref(`contacts/${profile.uid}`).child(id).update(formValue);
      Alert.success("Contact successfully edited", 3000);
      onHide();
    } catch (error) {
      Alert.error(error.message, 3000);
    }
  };

  useEffect(() => {
    database
      .ref(`contacts/${profile.uid}`)
      .child(id)
      .get()
      .then((snap) => {
        const { name, phone, address } = snap.val();
        setFormValue({ name, phone, address });
      });
  }, [id, profile.uid]);

  return (
    <div className="mt-1">
      <Modal show={isOpen} onHide={onHide}>
        <Modal.Header>
          <Modal.Title>Edit: {formValue.name} </Modal.Title>
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
          <Button block onClick={onSave} appearance="primary">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditContactModal;
