import React, { useState, useEffect } from "react";
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from "../appwriteConfig";
import { ID, Query, Role, Permission } from "appwrite";
import { Trash2 } from "react-feather";
import Header from "../components/Header";

import { useAuth } from "../utils/AuthContext";

const Room = () => {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const {user} = useAuth();

  useEffect(() => {
    getMessages();
    const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, response => {
      // Callback will be executed on changes for documents A and all files.
      
      if(response.events.includes("databases.*.collections.*.documents.*.create")){
        setMessages((prevState) => [...prevState, response.payload]);
      }

      if(response.events.includes("databases.*.collections.*.documents.*.delete")){
        setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id));
      }

    });

    return () => {
      unsubscribe();
    }
  }, [])

  const getMessages = () => {
    const promise = databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [Query.orderAsc("$createdAt")]
    );
    promise.then((res) => setMessages(res.documents));
    console.log(messages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let permissions = [
        Permission.write(Role.user(user.$id))
    ]

    let payload = {
      user_id: user.$id,
      body: messageBody,
      username:user.name,
    };

    let promise = databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload,
    );
    promise.then((res) => {
      // setMessages((prevState) => [...messages, res]);
    });
    setMessageBody("");
  };

  const deleteMessage = (doc_id) => {
    databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, doc_id).then((res) => {
    })
  }

  return (
    <main className="container">
        <Header/>
      <div className="room--container">
        <div>
          {messages.map((msg) => {
            return (
              <div key={msg.$id} className="message--wrapper">
                <div className="message--header">
                  <p>
                    {msg?.username ? (
                      <span>{msg.username}</span>
                    ): <span>Anonymous user</span>
                  }
                  <small className="message-timestamp">{new Date(msg.$createdAt).toLocaleString()}</small>
                  </p>
                  {
                    msg.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                      <Trash2 className="delete--btn" onClick={() => {deleteMessage(msg.$id)}}/>
                    )
                  }
                </div>
                <div className="message--body">
                  <span>{msg.body}</span>
                </div>
              </div>
            );
          })}
        </div>

        <form className="message-form" onSubmit={handleSubmit}>
          <div>
            <textarea
              required
              maxLength="1000"
              placeholder="How you doing !"
              onChange={(e) => setMessageBody(e.target.value)}
              value={messageBody}
            ></textarea>
          </div>
          <div className="send-btn--wrapper">
            <input className="btn btn--secondary" type="submit" value="Send" />
          </div>
        </form>
      </div>
    </main>
  );
};

export default Room;
