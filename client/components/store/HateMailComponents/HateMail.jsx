import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// import Mail from "./Mail.jsx";

const socket = io();

const HateMail = ({ user }) => {
  dayjs.extend(relativeTime);

  const [text, setText] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [mail, setMail] = useState([]);

  const [recipientUsername, setRecipientUsername] = useState("")
  // const [mailboxUsernames, setMailboxUsernames] = useState([]);
  useEffect(() => {
    axios.get("/hatemail/api/recipients").then((response) => {
      // console.log(response.data);
      setRecipients(response.data);
    });

    axios.get(`/hatemail/api/hatemail${user.id}`)
      .then((response) => {
        console.log(response.data);
        setMail(response.data);
      });


    // Listen for a "newHatemail" event from the server
    socket.on("newHatemail", (response) => {
      console.log("Received new hatemail from socket:", response.data);
      // update UI or take any other action here
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection
    };
  }, []);

  const handleRecipientChange = (e) => {
    setSelectedRecipient(e.target.value);
  };

  // const handleSetUsername = () => {
  //   setRecipientUsername
  // }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);
    axios
      .post("/hatemail/api/hatemail", { senderId: user.id, mail: text, recipientId: selectedRecipient })
      .then((response) => {
        console.log("Hatemail sent successfully!");

        // Emit a "newHatemail" event to the server
        socket.emit("newHatemail", {
          recipientId: selectedRecipient,
          mail: text,
        });

        setText("");
        setSelectedRecipient("");
      })
      .catch((error) => {
        console.error("Error sending hatemail:", error);
      });
  };

  const postConflict = () => {
    axios.post('/conflict/api/createConflict', {
      conflictType: "HateMail",
      positiveOrNegativeMeme: 'negative',
      hateSpeech: text,
      opponentYouWacked: recipientUsername,
      conflictStatus: 'open'
    })
    .then(() => {
    })
  }

  return (
    <div>
      <div className="centered-container">
        <h2>Send Hatemail</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="recipient">Select a Recipient:</label>
            <select
              id="recipient"
              name="recipient"
              value={selectedRecipient}
              onChange={handleRecipientChange}
            >
              <option value="">Select a recipient</option>
              {recipients.map((recipient) => (
                <option key={recipient.id} value={recipient.id} onChange={() => {
                  setRecipientUsername(recipient.username)
                }}>
                  {recipient.username}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hatemailText">Hatemail Text:</label>
            <textarea
              id="hatemailText"
              name="hatemailText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
          <button type="submit" onClick={() => {
            postConflict()
            console.log('src', recipients)
          }}>Send Hatemail</button>
        </form>
      </div>
      <div className="mail-list">
        {mail.map((item, index) => {
          const recipient = recipients.filter(rec => rec.id === item.senderId );

          return <div className="mail-item" key={item.id}>
            <strong>{ recipient[0].username }: </strong> { item.mail }
            <br/>
            <div className="timestamp">{dayjs(item.createdAt).fromNow()}</div>
          </div>;
        })}
      </div>
    </div>
  );
};

export default HateMail;
