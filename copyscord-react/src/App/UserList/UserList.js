import React, {useContext} from 'react';
import RankSeparator from "./RankSeparator";
import {Scrollbars} from "react-custom-scrollbars";
import UsersListContext from "../ContextProvider/Server/UsersList";

const UserList = () => {
    const { usersList } = useContext(UsersListContext);

    return (
        <>
            <Scrollbars autoHide style={{height: "100%"}}>
                <RankSeparator name={"Members"} users={(usersList)?usersList:[]}/>
            </Scrollbars>
        </>
    );
}

export default UserList;