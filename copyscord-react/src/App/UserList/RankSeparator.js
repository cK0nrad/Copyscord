import React from 'react';
import style from "./UserList.module.css";
import MemberButton from "./MemberButton";

const RankSeparator = ({name, users}) => {
    return (
        <div className={style.userList}>
            <div className={style.rankSeparator}>
                <p className={style.rankName}>{name}</p>
            </div>
            {(users[0]) ? users.map((user,i) => (
                <MemberButton status={user.status} userId={user.id} rank={user.role} key={i} name={user.username} userCode={user.userCode} logo={user.logoUrl}/>
            )): null
            }
        </div>
    );
}

export default RankSeparator;