import { Box, Typography, useTheme } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const TopLikerWidget = ({ userId }) => {
  const [topLiker, setTopLiker] = useState(null);
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();

  const getTopLiker = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${userId}/topLiker`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTopLiker(data.topLiker);
    } catch (error) {
      console.error("Failed to fetch top liker:", error);
    }
  };

  useEffect(() => {
    getTopLiker();
  }, [userId, token]);

  return (
    <WidgetWrapper>
      <Typography color={palette.neutral.dark} variant="h5" fontWeight="500" sx={{ mb: "1.5rem" }}>
        Top Liker
      </Typography>
      {topLiker ? (
        <Box>
          <Typography variant="h6" color={palette.neutral.medium}>
            <a
              href={topLiker._id ? `${process.env.REACT_APP_URL_FRONTEND}/profile/${topLiker._id}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: palette.primary.main }}
            >
              {topLiker.username}
            </a>
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
