import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import FollowersWidget from "scenes/widgets/FollowersWidget";
import FollowingWidget from "scenes/widgets/FollowingWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && _id !== "66c0b6345a1509f6c87f8b46" && (
          <Box flexBasis="26%">
            <Box m="2rem 0" />
            <FollowersWidget userId={_id} /> {/* Display Followers */}
            <Box m="2rem 0" />
            <FollowingWidget userId={_id} /> {/* Display Following */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
