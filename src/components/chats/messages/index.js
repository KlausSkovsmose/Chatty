import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router";
import { Alert, Button } from "rsuite";
import { database } from "../../../firebase";
import { groupByDate, toArrWithId } from "../../../utils";
import MessageItem from "./MessageItem";

const INITIAL_PAGE_SIZE = 15;
const messagesRef = database.ref("/messages");

function shouldScrollToBottom(node, threshold = 30) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;

  return percentage > threshold;
}

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(INITIAL_PAGE_SIZE);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const loadMessages = useCallback(
    (limitToLast) => {
      const node = selfRef.current;
      messagesRef.off();
      messagesRef
        .orderByChild("chatId")
        .equalTo(chatId)
        .limitToLast(limitToLast || INITIAL_PAGE_SIZE)
        .on("value", (snap) => {
          const data = toArrWithId(snap.val());
          setMessages(data);

          if (shouldScrollToBottom(node)) {
            node.scrollTop = node.scrollHeight;
          }
        });

      setLimit((current) => current + INITIAL_PAGE_SIZE);
    },
    [chatId]
  );

  const loadMoreMessages = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;

    loadMessages(limit);

    setTimeout(() => {
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight - oldHeight;
    }, 250);
  }, [loadMessages, limit]);

  useEffect(() => {
    const node = selfRef.current;

    loadMessages();

    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 250);

    return () => {
      messagesRef.off("value");
    };
  }, [loadMessages]);

  const handleDelete = useCallback(
    async (msgId) => {
      if (!window.confirm("Delete this message?")) {
        return;
      }
      const isLast = messages[messages.length - 1].id === msgId;
      const updates = {};
      updates[`/messages/${msgId}`] = null;
      if (isLast && messages.length > 1) {
        updates[`/chats/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }
      if (isLast && messages.length === 1) {
        updates[`/chats/${chatId}/lastMessage`] = null;
      }
      try {
        await database.ref().update(updates);
        Alert.info("Message deleted");
      } catch (err) {
        Alert.error(err.message);
      }
    },
    [chatId, messages]
  );

  const displayMessages = () => {
    const groups = groupByDate(messages, (msg) =>
      new Date(msg.createdAt).toDateString()
    );

    const groupedMessages = [];

    Object.keys(groups).forEach((date) => {
      groupedMessages.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );

      const msgs = groups[date].map((msg) => (
        <MessageItem key={msg.id} message={msg} handleDelete={handleDelete} />
      ));

      groupedMessages.push(...msgs);
    });

    return groupedMessages;
  };

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {messages && messages.length >= INITIAL_PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={loadMoreMessages} color="green">
            Load more
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages && displayMessages()}
    </ul>
  );
};

export default Messages;
