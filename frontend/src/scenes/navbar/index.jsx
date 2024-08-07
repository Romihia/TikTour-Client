import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Settings,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import SearchResult from "./SearchResult";
import SearchAttributesDialog from "./SearchAttributesDialog";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 900px)");
  const [searchContent, setSearchContent] = useState([]);
  const [showSearchedUsers, setShowSearchedUsers] = useState(false);
  const [showSearchAttributes, setShowSearchAttributes] = useState(false);
  const [chosenAttributes, setChosenAttributes] = useState([]);



  const token = useSelector((state) => state.token);

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const [searchUsername, setSearchUsername] = useState("");
  const [searchType, setSearchType] = useState("users");

  useEffect(() => {
    console.log("Reload");
    setSearchContent([]);
    setShowSearchedUsers(false);
    setShowSearchAttributes(false);
    setChosenAttributes([]);
    setSearchType(searchType || undefined);
    setSearchUsername("");
  }, []);
  
  // Log the updated searchUsername whenever it changes
  useEffect(() => {
    console.log(searchUsername);
  }, [searchUsername]);

  useEffect(() => {
    setSearchType(chosenAttributes.searchType);
  }, [chosenAttributes]);

  const fullName = `${user.firstName} ${user.lastName}`;

  const searchForUser = async (username) => {
    console.log("searchForUser: ", username);
    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${username}/getByUsername`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("data: ", JSON.stringify(data));
      if (data._id !== "UsernameNotFound") {
      navigate(`/profile/${data._id}`);
      navigate(0);
      } else {
      alert("User not found!");
      }
  };

  const searchUsersByAttributes = async (query) => {
    try {
      console.log("\n\n\n searchForQuery: ", JSON.stringify(query) +"\n\n\n");
      
      // Create query string from the query object
      const queryString = new URLSearchParams(query).toString();
      console.log("\n\n\n queryString: ", `${process.env.REACT_APP_URL_BACKEND}/search/getUsers?${queryString}`);
      
      // Make the GET request with query parameters
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/search/getUsers?${queryString}`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Get a list of users as data.
      const data = await response.json();
      
      if (data._id !== "UsersNotFound") {
        setSearchContent(data);
      } else {
        alert("Users not found!");
      }
    } catch (err) {
      console.error("Error searching users:", err);
      alert("An error occurred while searching for users.");
    }
  };

  const searchPostsByAttributes = async (query) => {
    try {
      console.log("\n\n\n searchForQuery: ", JSON.stringify(query) +"\n\n\n");
      
      // Create query string from the query object
      const queryString = new URLSearchParams(query).toString();
      console.log("\n\n\n queryString: ", `${process.env.REACT_APP_URL_BACKEND}/search/getPosts?${queryString}`);
      
      // Make the GET request with query parameters
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/search/getPosts?${queryString}`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Get a list of users as data.
      const data = await response.json();
      
      if (data._id !== "PostsNotFound") {
        setSearchContent(data);
      } else {
        alert("Posts not found!");
      }
    } catch (err) {
      console.error("Error searching posts:", err);
      alert("An error occurred while searching for posts.");
    }
  };
  

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          TikTour
        </Typography>

        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: "space-between",
              alignItems: "center",
              height: "3rem",
              borderRadius: "9px",
              zIndex: '1'
            }}
          >
          <div style={{width: 'fit-content'}}>
              <InputBase 
              placeholder="Search by query..."
              onChange={(event) => {
                setSearchUsername(event.target.value);
              }}
              />
            <IconButton>
              <Search onClick={async () => {
                if (showSearchedUsers) {
                  setSearchContent([]);
                  setShowSearchedUsers(false);
                }
                else {
                  setSearchType(chosenAttributes.searchType);
                  if (searchType !== undefined) {
                    setSearchType(chosenAttributes.searchType);
                    const { ["searchType"]: _, ...rest } = chosenAttributes;
                    if (searchType === "users")
                      await searchUsersByAttributes(rest);
                    else if (searchType === "posts")
                      await searchPostsByAttributes(rest);
                    setShowSearchedUsers(true);
                  }
                }
                setShowSearchAttributes(false);
              }
               } />
            </IconButton>
            <IconButton>
              <Settings onClick={() => {
                setSearchContent([]);
                setShowSearchAttributes(!showSearchAttributes);
                setShowSearchedUsers(false);
                }}/>
            </IconButton>
          </div>
          <ul
            style={{
              display: showSearchedUsers ? 'block' : 'none',  // Show or hide the list based on the flag
              width: '150%',  // Adjust the width as needed
              borderRadius: '20px',
              backgroundColor: 'white',
              listStyle: 'none',  // Remove bullet points
              margin: '0',
              padding: '0',
              height: 'fit-content',  // Adjust the height based on content
              minHeight: '50vh',  // Ensure the list has a minimum height
              overflowY: 'scroll',  // Enable vertical scrolling
              overflowX: 'hidden',  // Prevent horizontal scrolling
              border: '2px solid black',
            }}
          >
            {searchContent.map((data, index) => (
              <li key={index} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {
                  searchType === "users" ? 
                  <SearchResult isPost={false} data={data} /> : 
                  searchType === "posts" ? 
                  <SearchResult isPost={true} data={data} /> : 
                  null
                }
              </li>
            ))}
          </ul>

            { showSearchAttributes && 
            <div>
             <SearchAttributesDialog chosenAttributes={chosenAttributes} setChosenAttributes={setChosenAttributes}/>
            </div>
            }
            
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          {/* <Message sx={{ fontSize: "25px" }} /> */}
          <Notifications sx={{ fontSize: "25px" }} />
          <IconButton onClick={() => navigate("/about")}>
          <Help sx={{ fontSize: "25px" }} />
          </IconButton>
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
