import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadStoredAuth, logout } from "../features/auth/authSlice";
import { useGetUserProfileQuery } from "../features/auth/authSlice";
import { setUser } from "../store/userSlice";

export const useAuthInit = () => {
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(loadStoredAuth());
    }, [dispatch]);


    const { data, error, isSuccess } = useGetUserProfileQuery(undefined, {
        refetchOnMountOrArgChange: false,
        refetchOnReconnect: false,
    });

    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(setUser(data.data));
        }
    }, [isSuccess, data?.data, dispatch]);



    useEffect(() => {
        if (error) {
            console.warn("Session invalid or expired:", error);
            dispatch(logout()); // clears invalid token
        }
    }, [error, dispatch]);
};
