import { Box, Typography, useTheme } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector

const TopLikerWidget = ({ userId }) => {
  const [topLiker, setTopLiker] = useState(null);
  const token = useSelector((state) => state.token); // Get token from state
  const { palette } = useTheme();

  const getTopLiker = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${userId}/topLiker`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }, // Include token in headers
      });
      const data = await response.json();
      setTopLiker(data.topLiker);
    } catch (error) {
      console.error("Failed to fetch top liker:", error);
    }
  };

  useEffect(() => {
    getTopLiker();
  }, [userId, token]); // Include token in dependency array

  return (
    <WidgetWrapper>
      <Typography color={palette.neutral.dark} variant="h5" fontWeight="500" sx={{ mb: "1.5rem" }}>
        Top Liker
      </Typography>
      {topLiker ? (
        <Box>
          <Typography variant="h6" color={palette.neutral.medium}>
            {topLiker.username} with {topLiker.likeCount} Likes
          </Typography>
        </Box>
      ) : (
        <Typography variant="h6" color={palette.neutral.medium}>
          No likers found
        </Typography>
      )}
    </WidgetWrapper>
  );
};

export default TopLikerWidget;
