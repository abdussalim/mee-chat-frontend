import Swal from "sweetalert2";
import io from "socket.io-client";
import "../assets/styles/home.css";
import Chat from "../components/Chat";
import Profile from "../components/Profile";
import ListUser from "../components/ListUser";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getDetailReceiver, getDetailUser } from "../redux/actions/user";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { detailUser, detailReceiver } = useSelector((state) => state);
  const [queryParams] = useSearchParams();
  const [tab, setTab] = useState("");

  const [socketio, setSocketio] = useState(null);
  const [message, setMessage] = useState("");
  const [listChat, setListChat] = useState([]);
  const [activeReceiver, setActiveReceiver] = useState("");

  useEffect(() => {
    document.title = `${process.env.REACT_APP_APP_NAME} - Home`;
    dispatch(getDetailUser(localStorage.getItem("id"), navigate));
  }, []);

  useEffect(() => {
    setTab("");
    if (queryParams.get("tab")) {
      setTab(queryParams.get("tab"));
    }
  }, [queryParams]);

  useEffect(() => {
    const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

    const alert = (accountName, messageContent, alertType) => {
      const maxLength = 15;
      let contentLength =
        messageContent.length < maxLength ? messageContent.length : maxLength;

      // const messageContentNotification = () => {
      let messageContentNotification = "";
      for (let i = 0; i < contentLength; i++) {
        messageContentNotification += messageContent[i];
      }
      if (contentLength < maxLength) {
        messageContentNotification = messageContentNotification;
      } else {
        messageContentNotification = messageContentNotification + ". . .";
      }
      // };

      const wrapper = document.createElement("div");
      wrapper.innerHTML = [
        `<div class="alert alert-${alertType} position-absolute w-25 start-50 content-alert" id="note">`,
        `   <div class="text-white"><span><b>${accountName}:</b> ${messageContentNotification} </span></div>`,
        "</div>",
      ].join("");

      alertPlaceholder.append(wrapper);
    };

    const ENDPOINT = process.env.REACT_APP_API_URL;

    const socket = io(ENDPOINT, {
      cors: {
        origin: "*",
        credentials: true,
      },
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: 10,
      transports: ["websocket", "polling"],
    });

    socket.on("send-message-response", (response) => {
      const receiver = localStorage.getItem("receiver");

      if (response.length) {
        if (
          receiver === response[0].sender_id ||
          receiver === response[0].receiver_id
        ) {
          const dateNow = new Date()
            .getTime()
            .toLocaleString("en-US", "Asia/Jakarta")
            .split(",")
            .slice(3, 4)
            .toString();
          const dateChat = new Date(response[response.length - 1].date)
            .getTime()
            .toLocaleString("en-US", "Asia/Jakarta")
            .split(",")
            .slice(3, 4)
            .toString();
          if (dateChat === (dateNow || dateNow + 1 || dateNow - 1)) {
            localStorage.setItem("notification", true);
            if (localStorage.getItem("notification") === "true") {
              alert(
                response[response.length - 1].username,
                response[response.length - 1].chat,
                "success"
              );
              setTimeout(() => {
                const closeNotificationBar = document.querySelector("#note");
                closeNotificationBar.remove();
              }, 5000);
            }
            localStorage.removeItem("notification");
          }

          setListChat(response);

          setTimeout(() => {
            const elem = document.getElementById("chatMenuMessage");
            elem.scrollTop = elem.scrollHeight;
          }, 500);
        }
      }
    });
    setSocketio(socket);
  }, []);

  const selectReceiver = (receiverId) => {
    setListChat([]);
    dispatch(getDetailReceiver(receiverId));
    setActiveReceiver(receiverId);
    localStorage.setItem("receiver", receiverId);
    socketio.emit("join-room", localStorage.getItem("id"));
    socketio.emit("chat-history", {
      sender: localStorage.getItem("id"),
      receiver: receiverId,
    });
  };

  const onSendMessage = (e) => {
    e.preventDefault();

    if (!message) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Message empty!",
      });
      return;
    }

    const data = {
      sender: localStorage.getItem("id"),
      receiver: activeReceiver,
      date: new Date(),
      chat: message,
    };

    socketio.emit("send-message", data);

    const payload = {
      sender_id: localStorage.getItem("id"),
      receiver_id: activeReceiver,
      photo: detailUser.data.photo,
      date: new Date(),
      chat: message,
      id: new Date(),
    };
    setListChat([...listChat, payload]);

    setMessage("");

    setTimeout(() => {
      const element = document.getElementById("chatMenuMessage");
      element.scrollTop = element.scrollHeight;
    }, 100);
  };

  const onDeleteMessage = (chat) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          sender: chat.sender_id,
          receiver: chat.receiver_id,
          chatId: chat.id,
        };
        socketio.emit("delete-message", data);
      }
    });
  };

  const onEditMessage = (newChat, chat) => {
    if (!newChat) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Message empty!",
      });
      return;
    }

    const data = {
      sender: chat.sender_id,
      receiver: chat.receiver_id,
      chatId: chat.id,
      chat: newChat,
    };
    socketio.emit("edit-message", data);

    document.getElementById("close").click();
  };

  return (
    <div className="container-fluid">
      <div
        id="liveAlertPlaceholder"
        className="me-3 w-100 bg-primary position-absolute top-0 start-50 translate-middle container-alert"
      >
        {" "}
      </div>
      <div className="row">
        {tab === "profile" ? (
          <Profile />
        ) : (
          <ListUser
            setTab={setTab}
            selectReceiver={selectReceiver}
            listChat={listChat}
          />
        )}
        <Chat
          detailReceiver={detailReceiver}
          activeReceiver={activeReceiver}
          listChat={listChat}
          message={message}
          setMessage={setMessage}
          onSendMessage={onSendMessage}
          onDeleteMessage={onDeleteMessage}
          onEditMessage={onEditMessage}
        />
      </div>
    </div>
  );
}
