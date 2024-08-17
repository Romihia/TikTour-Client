import { Box, Typography, useTheme } from "@mui/material";
import Following from "components/Following";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFollowing } from "state";

const FollowingListWidget = ({ userId , showIcons = true}) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const following = useSelector((state) => state.user.following) || [];

  const getFollowing = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_URL_BACKEND}/users/${userId}/following`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFollowing({ following: data }));
  };

  useEffect(() => {
    getFollowing();
  }, [userId, token, dispatch]);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Following List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {following.length > 0 ? (
          following.map((user) => (
            <Following
              key={user._id}
              userId={user._id}
              username={user.username}
              name={`${user.firstName} ${user.lastName}`}
              subtitle={user.rank}
              userPicturePath={user.picturePath}
              showIcons = {showIcons}
            />
          ))
        ) : (
          <Typography variant="h6" color={palette.neutral.medium}>
            Not following anyone.
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FollowingListWidget;
