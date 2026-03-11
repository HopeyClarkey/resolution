import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Mail = ({ senderId, mail, createdAt, users }) => {
  // Find the sender's username based on senderId
  const sender = users.find((user) => user.id === senderId);

  // Calculate the relative time
  const relativeTimestamp = dayjs(createdAt).fromNow();

  return (
    <div className="mail-item">
      <p>
        <strong>{sender ? sender.username : "Unknown User"}:</strong> {mail}
      </p>
      <p className="timestamp">{relativeTimestamp}</p>
    </div>
  );
};

Mail.propTypes = {
  senderId: PropTypes.number.isRequired,
  mail: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
};

export default Mail;
