import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react-lite";
import { types, flow, applySnapshot } from "mobx-state-tree";

function fetchContacts() {
  return new Promise(resolve => {
    setTimeout(() => resolve(["Jane", "Lisa", "John"]), 1500);
  });
}

const ContactList = types
  .model("ContactList", {
    contacts: types.array(types.string)
  })
  .actions(self => ({
    load: flow(function*() {
      const response = yield fetchContacts();
      applySnapshot(self, { contacts: response });
    })
  }));

const ContactListView = observer(({ contactList }) => {
  useEffect(() => {
    contactList.load();
  }, [contactList]);

  return (
    <ul>
      {contactList.contacts.map((contact, index) => (
        <li key={index}>{contact}</li>
      ))}
    </ul>
  );
});

ReactDOM.render(
  <ContactListView contactList={ContactList.create()} />,
  document.getElementById("app")
);
