import { Box, Typography, useTheme } from "@mui/material";
import Followers from "components/Followers";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFollowers } from "state";

const FollowerListWidget = ({ userId , showIcons = true}) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const followers = useSelector((state) => state.followers) || [];

  const getFollowers = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_URL_BACKEND}/users/${userId}/followers`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFollowers({ followers: data }));
  };

  useEffect(() => {
    getFollowers();
  }, [userId, token, dispatch]);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Followers List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {followers.length > 0 ? (
          followers.map((user) => (
            <Followers
              key={user._id}
              userId={user._id}
              username={user.username}
              name={`${user.firstName} ${user.lastName}`}
              subtitle={user.rank}
              userPicturePath={user.picturePath}
              isDeleted={user.isDeleted}
              showIcons = {showIcons}
            />
          ))
        ) : (
          <Typography variant="h6" color={palette.neutral.medium}>
            No followers found.
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FollowerListWidget;
