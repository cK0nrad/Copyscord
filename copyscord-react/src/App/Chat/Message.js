import React, { useContext, useState } from "react";
import UserLogo from "../UserLogo/UserLogo";
import style from "./Message.module.css";
import Tippy from "@tippyjs/react/headless";
import Popup from "../Popup/Popup";
import UserContext from "../ContextProvider/CurrentUser";
import ServerContext from "../ContextProvider/CurrentServer";
import UserTippyProfile from "../UserTippyProfile/UserTippyProfile";
import PopupUserProfile from "../PopupUserProfile/PopupUserProfile";
import UsersListContext from "../ContextProvider/Server/UsersList";

const Message = ({ messageID, logo, author, authorId, date, content, setEdit, deleteMsg, userCode }) => {
  const [popup, setPopup] = useState(false);
  const [instance, setInstance] = useState();
  const [instanceProfile, setInstanceProfile] = useState();
  const { currentUser } = useContext(UserContext);
  const { activeServer } = useContext(ServerContext);
  const [userProfile, setUserProfile] = useState("");
  const { usersList } = useContext(UsersListContext);

  const editMessage = () => {
    instance.hide();
    setEdit({ id: messageID, content });
  };

  const hidePopup = () => {
    setPopup(false);
  };

  const deletePopup = () => {
    instance.hide();
    setPopup(true);
  };
  const deleteMessage = () => {
    deleteMsg(messageID);
    setPopup(false);
  };

  return (
    <>
      {userProfile ? (
        <PopupUserProfile
          username={author}
          logoUrl={logo}
          userCode={userCode}
          id={userProfile}
          outside={() => setUserProfile(false)}
        />
      ) : null}
      <div>
        {popup ? (
          <Popup
            top={<p style={{ color: "#FFFFFF", fontSize: "15px", fontWeight: 600 }}>Delete message ?</p>}
            bottom={
              <>
                <button className={style.leaveButton} onClick={deleteMessage}>
                  <p>Delete</p>
                </button>
                <button className={style.cancelButton} onClick={hidePopup}>
                  <p>Cancel</p>
                </button>
              </>
            }
            outside={hidePopup}
          />
        ) : null}

        <Tippy
          trigger={"contextmenu"}
          placement={"auto"}
          arrow={false}
          interactive={true}
          hideOnClick={true}
          onTrigger={(instance, event) => {
            setInstance(instance);
            instance.setProps({
              getReferenceClientRect: () => ({
                width: 0,
                height: 0,
                top: event.clientY,
                bottom: event.clientY,
                left: event.clientX,
                right: event.clientX,
              }),
            });
            instance.show();
          }}
          render={(attrs, content) => {
            if (currentUser.id === authorId || activeServer.isAdmin) {
              return (
                <div className={style.contextMenu}>
                  {currentUser.id !== authorId ? null : (
                    <button className={`${style.edit} ${style.contextButton}`} onClick={editMessage}>
                      Edit message
                    </button>
                  )}
                  <button className={`${style.delete} ${style.contextButton}`} onClick={deletePopup}>
                    Delete message
                  </button>
                </div>
              );
            } else {
              return <></>;
            }
          }}
        >
          <div className={style.message}>
            <Tippy
              appendTo={() => document.getElementById("root")}
              interactive={true}
              onTrigger={(i) => {
                setInstanceProfile(i);
              }}
              render={() => {
                if (activeServer.id !== "@me") {
                  let role;
                  //Got some problems without any real reason, so i check if there's members before search the user
                  let user = usersList ? usersList.find((x) => x.id === authorId) : { role: 0 };
                  if (user) role = user.role;
                  else role = "none";
                  return (
                    <UserTippyProfile
                      showProfile={(id) => {
                        instanceProfile.hide();
                        setUserProfile(id);
                      }}
                      id={authorId}
                      userCode={userCode}
                      name={author}
                      logo={logo}
                      bot={
                        <p className={style.profileRank}>
                          Rank: {role === "none" ? "No more member" : role === 0 ? "User" : role === 1 ? "Admin" : "Owner"}
                        </p>
                      }
                    />
                  );
                } else {
                  return (
                    <UserTippyProfile
                      showProfile={(id) => {
                        instanceProfile.hide();
                        setUserProfile(id);
                      }}
                      id={authorId}
                      userCode={userCode}
                      name={author}
                      logo={logo}
                    />
                  );
                }
              }}
              trigger={"click"}
              placement={"right"}
            >
              <div className={style.logo}>
                <UserLogo width={40} src={logo} />
              </div>
            </Tippy>
            <div className={style.content}>
              <div>
                <div className={style.author}>{author.length > 30 ? `${author.substr(0, 30)}...` : author}</div>
                <p className={style.date}>{date}</p>
              </div>

              <div className={style.messageContent}>{content}</div>
            </div>
          </div>
        </Tippy>
      </div>
    </>
  );
};

export default Message;
