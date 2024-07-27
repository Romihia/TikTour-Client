import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFollowing } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Following = ({ followingId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const following = useSelector((state) => state.following || []);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFollowing = Array.isArray(following) ? following.find((user) => user._id === followingId) : false;

  const toggleFollowing = async () => {
    try {
      const method = isFollowing ? "DELETE" : "POST";
      console.log(`Sending ${method} request to ${process.env.REACT_APP_URL_BACKEND}/users/${_id}/follow/${followingId}`);
      const response = await fetch(
        `${process.env.REACT_APP_URL_BACKEND}/users/${_id}/follow/${followingId}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Response data:', data);

      dispatch(setFollowing({ following: data }));
    } catch (error) {
      console.error('Error during toggleFollowing:', error);
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${followingId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={toggleFollowing}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFollowing ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Following;
