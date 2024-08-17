import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  FilterList,
  HistoryOutlined,
  Message,
  DarkMode,
  LightMode,
  Help,
  Menu,
  Close,
  DeleteOutline,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import FontSizeSelector from 'components/FontSizeSelector'; // Import FontSizeSelector 
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import SearchResult from "./SearchResult";
import SearchAttributesDialog from "./SearchAttributesDialog";
import Notifications from "scenes/widgets/Notifications";

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
  const [searchingFiltersHistory, setSearchingFiltersHistory] = useState([]);
  const [showSearchingFiltersHistory, setShowSearchingFiltersHistory] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const loggedInUserId = useSelector((state) => state.user._id);
  const [reloader, setReloader] = useState(true);

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
    setSearchContent([]);
    setShowSearchedUsers(false);
    setShowSearchAttributes(false);
    setShowSearchingFiltersHistory(false);
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

  useEffect(() => {
    initializeSavedPosts();
  }, []);

  const initializeSavedPosts = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_URL_BACKEND}/save/${loggedInUserId}/getSavedPosts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    const savedPosts = data.savedPosts;
    setSavedPosts(savedPosts);
  };

  

  const fullName = `${user.firstName} ${user.lastName}`;
  const searchForUser = async (username) => {
    if (username === "") {
      toast.error("User not found!", {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${username}/getByUsername`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data._id !== "UsernameNotFound") {
      navigate(`/profile/${data._id}`);
      navigate(0);
      } else {
      toast.error("User not found!", {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      }
  };

  const getSearchingFiltersHistory = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/search/${userId}/getUserSearchingFiltersHistory`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to update search filters history');
      }
      
      const data = await response.json();
      setSearchingFiltersHistory(data.result);
      // Optionally, handle the result here
    } catch (error) {
      console.error("Error updating search filters history:", error);
    }
  };

  const updateSearchingFiltersHistory = async (newFilterQuery) => {
    const queryToSend = {...newFilterQuery, _id: user._id};
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/search/updateUserSearchingFiltersHistory`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( queryToSend ), // Assuming you're sending the queryString as the body
      });
      
      if (!response.ok) {
        throw new Error('Failed to update search filters history');
      }
      
      const result = await response.json();
      
      // Optionally, handle the result here
      console.log("Search filters history updated successfully:", result);
      
    } catch (error) {
      console.error("Error updating search filters history:", error);
    }
  };

  const searchUsersByAttributes = async (query) => {
    try {
      
      // Create query string from the query object
      const queryString = new URLSearchParams(query).toString();
      
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
        console.log(1);
        setSearchContent(data);
        console.log("\n\nData: ", JSON.stringify(data));
        console.log("\n\nSearchContent: ", JSON.stringify(searchContent));
        return true;
      } else {
        toast.error("Users not found!", {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return false;
      }
    } catch (err) {
      console.error("Error searching users:", err);
      toast.error("An error occurred while searching for users.", {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return false;
    }
  };

  const searchPostsByAttributes = async (query) => {
    try {
      
      // Create query string from the query object
      const queryString = new URLSearchParams(query).toString();
      
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
        return true;
      } else {
        toast.error("Posts not found!", {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return false;
      }
    } catch (err) {
      console.error("Error searching posts:", err);
      toast.error("An error occurred while searching for posts.", {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return false;
    }
  };

  const advancedSearchOnClick = async () => {
    if (showSearchedUsers) {
      setSearchContent([]);
      setShowSearchedUsers(false);
    }
    else {
      let success;
      setSearchType(chosenAttributes.searchType);
      if (searchType !== undefined) {
        setSearchType(chosenAttributes.searchType);
        if (searchType === "users")
          success = await searchUsersByAttributes(chosenAttributes);
        else if (searchType === "posts")
          success = await searchPostsByAttributes(chosenAttributes);
        updateSearchingFiltersHistory(chosenAttributes);
        console.log("searchContent: " + searchContent);
        console.log("success: " + success);
        if (!success) {
          return;
        }
        setShowSearchedUsers(true);
      }
    }
    setShowSearchAttributes(false);
    setShowSearchingFiltersHistory(false);
  };
  
  const searchByFreeText = async (freeText) => {
    try {
      const query = {"freeText": freeText};
      // Create query string from the query object
      const queryString = new URLSearchParams(query).toString();
      
      // Make the GET request with query parameters
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/search/getContentByFreeTextSearch?${queryString}`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Get a list of users&posts as data.
      const data = await response.json();
      
      if (data._id !== "ContentNotFound") {
        console.log("\n\nFoundData: " + JSON.stringify(data));
        setSearchContent(data);
        return true;
      } else {
        toast.error("Content not found!", {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return false;
      }
    } catch (err) {
      console.error("Error searching posts:", err);
      toast.error("An error occurred while searching for posts.", {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return false;
    }
  };
  
  const removeFilterFromHistory = async (index) => {
    const queryToSend = { _id: user._id, indexToRemove: index };
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/search/removeSearchFilterFromHistory`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryToSend), // Sending the updated filters as the body
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove search filter from history');
      }
  
      const result = await response.json();
      
      // Optionally, handle the result here
      console.log("Search filters history updated successfully:", result);
      toast.success("Filter removed successfully!", {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  
    } catch (error) {
      console.error("Error updating search filters history:", error);
    }
  };
  
  const reloadSearch = async () => {
    searchByFreeText(searchUsername);
    window.location.reload();
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
              placeholder="Search by free text..."
              onChange={(event) => {
                setSearchUsername(event.target.value);
              }}
              />
            <IconButton title="Search" onClick={() => { 
                searchByFreeText(searchUsername);
                setShowSearchingFiltersHistory(false);
                setShowSearchAttributes(false);
                setShowSearchedUsers(!showSearchedUsers);
                
              }}>
              <Search />
            </IconButton>
            <IconButton title="Search user/post" onClick={() => {
                setSearchContent([]);
                setShowSearchAttributes(!showSearchAttributes);
                setShowSearchedUsers(false);
                setSearchingFiltersHistory(false);
                setShowSearchingFiltersHistory(false);
                }}>
              <FilterList />
            </IconButton>
            <IconButton title="Recent Searches" onClick={() => {
                getSearchingFiltersHistory(user._id);
                setShowSearchAttributes(false);
                setShowSearchedUsers(false);
                setShowSearchingFiltersHistory(!showSearchingFiltersHistory);
              }}>
              <HistoryOutlined />
            </IconButton>
          </div>
          
          <div style={{
            display: showSearchingFiltersHistory ? 'flex' : 'none',  // Show or hide the list based on the flag
            flexDirection: 'column',
            width: '40vw',  // Adjust the width as needed
            backgroundColor: 'snow',
            border: '1px solid gray',
            borderRadius: '5px',
            margin: '0',
            padding: '10px',
            macHeight: '55vh',  // Ensure the list has a minimum height
            height: 'fit-content',
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ textAlign: 'center', color: dark }}>Searching Filters History</h2>
            <IconButton onClick={() => setShowSearchingFiltersHistory(false)} title="Close">
              <Close />
            </IconButton>
          </div>

          <ul
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
              width: '100%',
              backgroundColor: 'snow',
              border: '1px solid gray',
              borderRadius: '5px',
              listStyle: 'none',
              margin: '0',
              padding: '10px',
              maxHeight: '40vh',
              overflowY: 'scroll',
              overflowX: 'hidden',
            }}
          >
          {searchingFiltersHistory.length > 0 && searchingFiltersHistory.map((data, index) => (
            <li 
              key={index} 
              style={{
                position: 'relative',
                backgroundColor: 'lightpink',
                border: '1px solid black',
                borderRadius: '5px',
                margin: '0.5rem 0',
                padding: '0.5rem',
                cursor: 'pointer',
                wordWrap: 'break-word',
              }}
              onClick={async () => {
                let success;
                const data = searchingFiltersHistory[index];
                setSearchContent(data);

                if (data.searchType === "users")
                  success = await searchUsersByAttributes(data);
                else if (data.searchType === "posts")
                  success = await searchPostsByAttributes(data);

                if (!success) return;

                setShowSearchingFiltersHistory(false);
                setShowSearchedUsers(true);
              }}
            >
              
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                <IconButton onClick={(e) => {
                  e.stopPropagation();
                  removeFilterFromHistory(index);
                }}>
                  <DeleteOutline />
                </IconButton>
              </div>
              <div style={{ marginTop: '2rem' }}>
                {Object.entries(data).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '0.25rem' }}>
                    <strong>{key}:</strong> {String(value)}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

          
          <ul
            style={{
              display: showSearchedUsers ? 'block' : 'none',  // Show or hide the list based on the flag
              width: '100%',  // Adjust the width as needed
              backgroundColor: 'snow',
              border: '1px solid gray',
              borderRadius: '5px',
              listStyle: 'none',  // Remove bullet points
              margin: '0',
              padding: '0',
              height: 'fit-content',  // Adjust the height based on content
              minHeight: '50vh',  // Ensure the list has a minimum height
              overflowY: 'scroll',  // Enable vertical scrolling
              overflowX: 'hidden',  // Prevent horizontal scrolling
            }}
          >
            <div style={{ position: 'relative' }}>
              <IconButton 
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }} 
                onClick={() => setShowSearchedUsers(false)}
                title="Close"
              >
                <Close />
              </IconButton>
            </div>
            { reloader &&
              searchContent?.length > 0 && searchContent.map((data, index) => {
              console.log(`data[${index}]`, data);
              return <li key={index}>
                {
                  data.email ? // user
                  <SearchResult savedPosts={savedPosts} isPost={false} data={data} /> : 
                  <SearchResult savedPosts={savedPosts} isPost={true} data={data} />
                }
              </li>;
            })}
          </ul>

          { showSearchAttributes && 
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              position: 'relative', // Add this to position the close button
            }}>
              {/* Close Button */}
              <IconButton 
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }} 
                onClick={() => setShowSearchAttributes(false)}
                title="Close"
              >
                <Close />
              </IconButton>
              
              {/* Search Attributes Dialog */}
              <SearchAttributesDialog 
                chosenAttributes={chosenAttributes} 
                setChosenAttributes={setChosenAttributes}
                advancedSearchOnClick={advancedSearchOnClick} 
              />
            </div>
          }
            
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton title="DarkMode/LightMode" onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          {/* <Message sx={{ fontSize: "25px" }} /> */}
          <IconButton title="Notifications">
            <Notifications userId={user._id} />
          </IconButton>
          <IconButton title="About" onClick={() => navigate("/about")}>
          <Help sx={{ fontSize: "25px" }} />
          </IconButton>
          <FormControl variant="standard" value={fullName !== " " ? (fullName):(user.username)}>
            <Select
              value={fullName !== " " ? (fullName):(user.username)}
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
                {fullName !== " " ? (
                  <MenuItem value={fullName}>
                    <Typography>{fullName}</Typography>
                  </MenuItem>
                  ):(
                    <MenuItem value={user.username}>
                    <Typography>{user.username}</Typography>
                  </MenuItem>
                  )}
              {/* Add the font size selector here */}
                <MenuItem value={"set font size"}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" color="textPrimary">
                      Font Size
                    </Typography>
                  <FontSizeSelector /> {/* This will render the font size options */}
                </Box>
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
                {fullName !== " " ? (
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                ):(
                  <MenuItem value={user.username}>
                  <Typography>{user.username}</Typography>
                </MenuItem>
                )}
                {/* Add the font size selector here */}
                <MenuItem value={"set font size"}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" color="textPrimary">
                      Font Size
                    </Typography>
                    <FontSizeSelector /> {/* This will render the font size options */}
                  </Box>
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
