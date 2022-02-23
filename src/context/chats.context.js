import React, { createContext, useState, useEffect, useContext } from "react";
import { database } from "../firebase";
import { toArrWithId } from "../utils";
import { useProfile } from "./profile.context";

const ChatsContext = createContext();

export const ChatsProvider = ({ children }) => {
  const [chats, setChats] = useState(null);
  const { profile } = useProfile();

  useEffect(() => {
    const chatListRef = database.ref("chats");

    chatListRef.on("value", (snap) => {
      const data = toArrWithId(snap.val());
      const myChats = data
        .filter(
          (c) =>
            c.members[0] === profile.email || c.members[1] === profile.email
        )
        .sort((a, b) => {
          if (!b.lastMessage)
            b = { ...b, lastMessage: { createdAt: b.createdAt } };
          if (!a.lastMessage)
            a = { ...a, lastMessage: { createdAt: a.createdAt } };
          return (
            new Date(b.lastMessage.createdAt) -
            new Date(a.lastMessage.createdAt)
          );
        });
      setChats(myChats);
    });

    return () => {
      chatListRef.off();
    };
  }, [profile.email]);

  return (
    <ChatsContext.Provider value={chats}>{children}</ChatsContext.Provider>
  );
};

export const useChats = () => useContext(ChatsContext);
