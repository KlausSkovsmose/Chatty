import React from "react";
import { createContext, useContextSelector } from "use-context-selector";

const CurrentChatContext = createContext();

export const CurrentChatProvider = ({ children, data }) => {
  return (
    <CurrentChatContext.Provider value={data}>
      {children}
    </CurrentChatContext.Provider>
  );
};

export const useCurrentChat = (selector) =>
  useContextSelector(CurrentChatContext, selector);
