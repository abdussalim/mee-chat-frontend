/* eslint-disable react/prop-types */
import React, { useState } from "react";
import moment from "moment";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

export default function Chat({
  activeReceiver,
  detailReceiver,
  listChat,
  onSendMessage,
  message,
  setMessage,
  onDeleteMessage,
  onEditMessage,
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const [editChat, setEditChat] = useState("");
  const [editChatData, setEditChatData] = useState(null);

  return (
    <>
      {activeReceiver ? (
        <div className="chat-menu col-8 col-md-9 p-0 m-0 d-flex flex-column justify-content-between">
          <div className="chat-menu-header bg-white py-3 px-5">
            <div className="d-flex">
              {detailReceiver.isLoading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <>
                  {detailReceiver.data.photo ? (
                    <img
                      className="profile-rounded pointer"
                      src={`https://drive.google.com/uc?export=view&id=${detailReceiver.data.photo}`}
                      alt="Gambar Profile"
                      onClick={toggleDrawer}
                    />
                  ) : (
                    <img
                      className="profile-rounded pointer"
                      src="https://images227.netlify.app/mernuas/default.jpg"
                      alt="Gambar Profile"
                      onClick={toggleDrawer}
                    />
                  )}
                  <div className="ms-3 pointer" onClick={toggleDrawer}>
                    <p className="fw-bold m-0 p-0">
                      {detailReceiver.data.username}
                    </p>
                    <p className="fw-bold color-blue m-0 p-0">
                      <small>Online</small>
                    </p>
                  </div>
                  <Drawer
                    open={isOpen}
                    onClose={toggleDrawer}
                    direction="right"
                    className="bla bla bla"
                    size={300}
                  >
                    <div className="p-3">
                      <div className="profile mt-4 profile">
                        <div className="position-relative">
                          {detailReceiver.data.photo ? (
                            <img
                              className="profile-rounded"
                              src={`https://drive.google.com/uc?export=view&id=${detailReceiver.data.photo}`}
                              alt="Gambar Profile"
                            />
                          ) : (
                            <img
                              className="profile-rounded"
                              src="https://images227.netlify.app/mernuas/default.jpg"
                              alt="Gambar Profile"
                            />
                          )}
                        </div>
                        <h5 className="fw-bold mt-3">
                          {detailReceiver.data.username}
                        </h5>
                        <p>{detailReceiver.data.email}</p>
                        <div className="w-100 mt-3">
                          {detailReceiver.data.phone && (
                            <p>
                              <b>Phone:</b> {detailReceiver.data.phone}
                            </p>
                          )}
                          {detailReceiver.data.bio && (
                            <p>
                              <b>Bio:</b> {detailReceiver.data.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Drawer>
                </>
              )}
            </div>
          </div>
          <div className="chat-menu-message p-4" id="chatMenuMessage">
            {detailReceiver.isLoading ? (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <>
                {listChat.length ? (
                  <>
                    {listChat.map((chat) => (
                      <div key={chat.id}>
                        {chat.sender_id === localStorage.getItem("id") ? (
                          <div>
                            <div className="d-flex justify-content-end align-items-end mt-4">
                              <div className="ballon-right me-2">
                                {chat.is_deleted ? (
                                  <>
                                    <p className="p-0 m-0 text-secondary">
                                      <i>This message has been deleted</i>
                                    </p>
                                    <small
                                      className="text-secondary float-end mt-2"
                                      style={{ fontSize: "9px" }}
                                    ></small>
                                  </>
                                ) : (
                                  <>
                                    <p className="p-0 m-0">{chat.chat}</p>
                                    <small
                                      className="text-secondary float-end mt-2"
                                      style={{ fontSize: "9px" }}
                                    >
                                      {moment(chat.date).format("LLL")}
                                    </small>
                                  </>
                                )}
                              </div>
                              {chat.photo ? (
                                <img
                                  className="align-self-start profile-rounded"
                                  src={`https://drive.google.com/uc?export=view&id=${chat.photo}`}
                                  alt="Gambar Profile"
                                />
                              ) : (
                                <img
                                  className="align-self-start profile-rounded"
                                  src="https://images227.netlify.app/mernuas/default.jpg"
                                  alt="Gambar Profile"
                                />
                              )}
                            </div>
                            {!chat.is_deleted && (
                              <div
                                className="d-flex justify-content-end w-100"
                                style={{ marginTop: "-12px" }}
                              >
                                <span
                                  className="text-primary pointer mt-3 me-2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#editChat"
                                  onClick={() => {
                                    setEditChat(chat.chat);
                                    setEditChatData(chat);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    class="bi bi-pencil"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                  </svg>
                                  {/* Edit */}
                                </span>

                                <div
                                  className="modal fade"
                                  id="editChat"
                                  tabIndex="-1"
                                  aria-labelledby="editChatLabel"
                                  aria-hidden="true"
                                >
                                  <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5
                                          className="modal-title"
                                          id="editChatLabel"
                                        >
                                          Edit Chat
                                        </h5>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                        />
                                      </div>
                                      <div className="modal-body">
                                        <input
                                          className="form-control"
                                          type="text"
                                          value={editChat}
                                          onChange={(e) =>
                                            setEditChat(e.target.value)
                                          }
                                        />
                                      </div>
                                      <div className="modal-footer">
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          data-bs-dismiss="modal"
                                          id="close"
                                        >
                                          Close
                                        </button>
                                        <button
                                          type="button"
                                          className="btn bg-blue text-white"
                                          onClick={() =>
                                            onEditMessage(
                                              editChat,
                                              editChatData
                                            )
                                          }
                                        >
                                          Save changes
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <span
                                  className="text-danger pointer mt-3"
                                  onClick={() => onDeleteMessage(chat)}
                                  style={{ marginRight: "65px" }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    class="bi bi-trash"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                    <path
                                      fill-rule="evenodd"
                                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                    />
                                  </svg>
                                  {/* Delete */}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="d-flex justify-content-start align-items-end mt-4">
                            {chat.photo ? (
                              <img
                                className="profile-rounded"
                                src={`https://drive.google.com/uc?export=view&id=${chat.photo}`}
                                alt="Gambar Profile"
                              />
                            ) : (
                              <img
                                className="profile-rounded"
                                src="https://images227.netlify.app/mernuas/default.jpg"
                                alt="Gambar Profile"
                              />
                            )}
                            <div className="ballon-left ms-2">
                              {chat.is_deleted ? (
                                <>
                                  <p className="p-0 m-0 text-light">
                                    <i>This message has been deleted</i>
                                  </p>

                                  <small
                                    className="text-light float-start mt-2"
                                    style={{ fontSize: "9px" }}
                                  ></small>
                                </>
                              ) : (
                                <>
                                  <p className="p-0 m-0">{chat.chat}</p>
                                  <small
                                    className="text-light float-start mt-2"
                                    style={{ fontSize: "9px" }}
                                  >
                                    {moment(chat.date).format("LLL")}
                                  </small>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="fs-5">No message yet</p>
                )}
              </>
            )}
          </div>
          <div className="chat-menu-form bg-white py-3 px-5 ">
            <form
              onSubmit={onSendMessage}
              className="d-flex justify-content-center"
            >
              <div className="input-group input-group-lg w-75">
                <input
                  className="form-control bg-light border-0"
                  id="message"
                  placeholder="Type your message"
                  value={message}
                  autoComplete="off"
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="btn text-white bg-blue">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="chat-menu col-8 col-md-9 d-flex flex-column">
          <div className="chat-menu-blank p-4">
            <h5 className="text-secondary">
              Please select a chat to start messaging
            </h5>
          </div>
        </div>
      )}
    </>
  );
}
