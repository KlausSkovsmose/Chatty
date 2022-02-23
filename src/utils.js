export const getNameInitials = (name) => {
  const splitName = name.toUpperCase().split(" ");

  if (splitName.length > 1) {
    return splitName[0][0] + splitName[1][0];
  }

  return splitName[0][0];
};

export function transformToArrWithId(snapVal) {
  return snapVal
    ? Object.keys(snapVal).map((contactId) => {
        return {
          ...snapVal[contactId],
          id: contactId,
          label: snapVal[contactId].name + " - " + snapVal[contactId].email,
          value: snapVal[contactId].email,
        };
      })
    : [];
}

export function toArrWithId(snapVal) {
  return snapVal
    ? Object.keys(snapVal).map((id) => {
        return {
          ...snapVal[id],
          id: id,
        };
      })
    : [];
}

export async function getUserUpdates(userId, keyToUpdate, value, db) {
  const updates = {};

  updates[`/profiles/${userId}/${keyToUpdate}`] = value;

  const getMsgs = db
    .ref("/messages")
    .orderByChild("author/uid")
    .equalTo(userId)
    .once("value");

  const getChat = db
    .ref("/chats")
    .orderByChild("lastMessage/author/uid")
    .equalTo(userId)
    .once("value");

  const [messagesSnap, chatsSnap] = await Promise.all([getMsgs, getChat]);

  messagesSnap.forEach((msgSnap) => {
    updates[`/messages/${msgSnap.key}/author/${keyToUpdate}`] = value;
  });

  chatsSnap.forEach((chatSnap) => {
    updates[`/chats/${chatSnap.key}/lastMessage/author/${keyToUpdate}`] = value;
  });

  return updates;
}

export function groupByDate(array, groupingCallback) {
  return array.reduce((result, item) => {
    const key = groupingCallback(item);

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(item);

    return result;
  }, {});
}
