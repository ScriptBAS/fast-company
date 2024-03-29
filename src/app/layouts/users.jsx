import React from "react";
import { useSelector } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import EditUserPage from "../components/page/editUserPage";
import UserPage from "../components/page/userPage";
import UsersListPage from "../components/page/usersListPage";
import UsersLoader from "../components/ui/hoc/usersLoader";
import { getCurrentUserId } from "../store/users";
export const Users = () => {
    const params = useParams();
    const { userId, edit } = params;
    const currentUserid = useSelector(getCurrentUserId());

    return (
        <UsersLoader>
                {userId ? (
                    edit ? (
                        userId === currentUserid ? (
                            <EditUserPage />
                        ) : (
                            <Redirect to={`/users/${currentUserid}/edit`} />
                        )
                    ) : (
                        <UserPage userId={userId} />
                    )
                ) : (
                    <UsersListPage />
                )}
        </UsersLoader>
    );
};

export default Users;
