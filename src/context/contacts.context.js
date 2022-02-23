import React, { createContext, useState, useEffect, useContext } from "react";
import { database } from "../firebase";
import { transformToArrWithId } from "../utils";
import { useProfile } from "./profile.context";

const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState(null);
  const { profile } = useProfile();

  useEffect(() => {
    const contactsListRef = database.ref(`/contacts/${profile.uid}`);
    contactsListRef.on("value", (snap) => {
      const data = transformToArrWithId(snap.val());
      setContacts(data);
    });

    return () => {
      contactsListRef.off();
    };
  }, [profile.uid]);

  return (
    <ContactsContext.Provider value={contacts}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => useContext(ContactsContext);
