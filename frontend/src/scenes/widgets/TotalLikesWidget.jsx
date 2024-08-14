import {Typography, useTheme } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector

const TotalLikesWidget = ({ userId }) => {
  const [totalLikes, setTotalLikes] = useState(0);
  const token = useSelector((state) => state.token); // Get token from state
  const { palette } = useTheme();

  const getTotalLikes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${userId}/totalLikes`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }, // Include token in headers
      });
      const data = await response.json();
      setTotalLikes(data.totalLikes);
    } catch (error) {
      console.error("Failed to fetch total likes:", error);
    }
  };

  useEffect(() => {
    getTotalLikes();
  }, [userId, token]); // Include token in dependency array

  return (
    <WidgetWrapper>
      <Typography color={palette.neutral.dark} variant="h5" fontWeight="500" sx={{ mb: "1.5rem" }}>
        Total Likes
      </Typography>
      <Typography variant="h6" color={palette.neutral.medium}>
        {totalLikes} Likes
      </Typography>
    </WidgetWrapper>
  );
};

export default TotalLikesWidget;
