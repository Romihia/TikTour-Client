import { Box, Typography, useTheme, useMediaQuery, Grid, Button } from "@mui/material";
import Form from "./Form";
import LoginImage from "./TiktourLogo.png"; 

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          TikTour
        </Typography>
      </Box>

      <Grid container style={{ height: 'calc(100vh - 64px)' }}>
        <Grid 
          item 
          xs={12} 
          md={8} 
          style={{ 
            backgroundImage: `url(${LoginImage})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
          }}
        >
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            width="100%"
            p="2rem"
            m="2rem auto"
            borderRadius="1.5rem"
            backgroundColor={theme.palette.background.alt}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            style={{ height: '100%' }}
          >
            <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
              Welcome to TikTour, the social media for tours and travel ! 
            </Typography>
            <Form />
            <Box display="flex" justifyContent="center" mt="2rem">
              <Button variant="contained" color="primary" sx={{ mr: "1rem" }}>Login</Button>
              <Button variant="outlined" color="primary">Register</Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
