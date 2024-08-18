import { Box, useMediaQuery, Button, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "scenes/navbar";
import FollowersWidget from "scenes/widgets/FollowersWidget";
import FollowingWidget from "scenes/widgets/FollowingWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import TotalLikesWidget from "scenes/widgets/TotalLikesWidget";
import TopLikerWidget from "scenes/widgets/TopLikerWidget";
import { setFollowers } from "state";
import ChangePasswordDialog from 'scenes/profilePage/ChangePassword';
import ProfileEdit from 'scenes/profilePage/ProfileEdit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setLogout } from "state";
import DeleteModal from "components/DeleteConfirmation";


const ProfilePage = ({showOnlySaved, setShowOnlySaved}) => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const followers = useSelector((state) => state.followers || []);
  const [isFollowing, setIsFollowing] = useState(null);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const loggedInUserId = useSelector((state) => state.user._id);
  const dispatch = useDispatch();
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const primaryDark = theme.palette.primary.dark;
  const navigate = useNavigate();
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [openProfileEdit, setOpenProfileEdit] = useState(false);
  const { palette } = useTheme();



  const buttonStyle = {
    width: '60%',
    margin: '5px',
    border: '2px groove black',
    backgroundColor: '#f8f8f8', // Change to desired hover background color
    borderRadius: '50px',
    transition: 'all 0.2s ease-in-out', // Adds transition effect
    '&:hover': {
      backgroundColor: palette.primary.main, // Change to desired hover background color
      color: 'white',
      scale: '1.1'
    },
  };

  const [showModal, setShowModal] = useState(false);

  const handleDeleteAccount = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const getUser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const toggleFollowing = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_BACKEND}/users/${loggedInUserId}/${userId}`,
        {
          method:"PATCH",
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
      if(loggedInUserId===userId){
        dispatch(setFollowers({ followers: data }));
      }else{
        window.location.reload();
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error during toggleFollowing:', error);
    }
  };

  const deleteAccount = async () => {
      try {
        dispatch(setLogout());
        const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${loggedInUserId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        toast.success("Account deleted successfully!", {
          position: 'top-center',
          autoClose: 1000, // Toast duration set to 1 second
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });


      } catch (error) {
        console.error('Error during account deletion:', error);
      }

  };
  const editAccount = async () => {
      setOpenProfileEdit(true);

  };
  const passwordChange = async (oldPassword, newPassword) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${loggedInUserId}/password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Old password is incorrect');
      }else{
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        toast.success("Password changed successfully!", {
          position: 'top-center',
          autoClose: 1000, // Toast duration set to 1 second
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setOpenPasswordDialog(false);
      }
    } catch (error) {
      console.error('Error during password change:',error);
      toast.error("Error during password change", {
        position: 'top-center',
        autoClose: 1500, // Toast duration set to 1 second
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    getUser();
    console.log("+++++++++++++++++++++++");
    const getIsFollowing = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_URL_BACKEND}/users/${loggedInUserId}/following`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      const following = data.some((user) => user._id === userId);
      console.log("data",data,"\n","\n","\n","following:" ,following);
      setIsFollowing(following);
    };
    getIsFollowing();
  }, [userId, loggedInUserId, token]);

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          {loggedInUserId !== userId && !user.isDeleted && (
            <Button
            variant="contained"
            color={isFollowing ? "secondary" : "primary"}
            onClick={toggleFollowing}
            sx={{ mt: "1rem", backgroundColor: primaryLight, color: primaryDark }}
            startIcon={isFollowing ? <PersonRemoveOutlined /> : <PersonAddOutlined />}
          >
            {isFollowing ? "Unfollow" : "Follow"}
           </Button>
          
          )}
          <Box m="2rem 0" />
          {loggedInUserId === userId && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                margin: '20px 0'
              }}>
                {
                showOnlySaved ?

                <Button
                  sx={buttonStyle}
                  onClick={() => {
                    setShowOnlySaved(false);
                  }
                  }
                >
                  Watch My Posts
                </Button>
                :
                <Button
                  sx={buttonStyle}
                  onClick={() => {
                    setShowOnlySaved(true);
                  }
                  }
                >
                  Watch Saved & Liked
                </Button>
                }
                <Button
                  sx={buttonStyle}
                  onClick={() => {
                    handleDeleteAccount();
                  }
                  }
                >
                Delete My Account
                </Button>
                <DeleteModal
                  show={showModal}
                  handleClose={handleCloseModal}
                  handleConfirm={deleteAccount}
                />
                <Button
                  onClick={() => setOpenPasswordDialog(true)}
                  sx={buttonStyle}
                >
                  Change Password
                </Button>
                <Button
                  onClick={editAccount}
                  sx={buttonStyle}
                >
                  Edit Account
                </Button>

              </div>
            )}
          {user._id!=="66c0f78bd42d8e672a238f35"&&(
            <div>
              <FollowersWidget userId={userId} showIcons={userId===loggedInUserId}/>
              <Box m="2rem 0" />
              <FollowingWidget userId={userId} showIcons={userId===loggedInUserId}/>
              <Box m="2rem 0" /></div>
          )}
          <TotalLikesWidget userId={userId} />
          <Box m="2rem 0" />
          <TopLikerWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {/* Display MyPostWidget only if the logged-in user is viewing their own profile */}
          {loggedInUserId === userId && (
            <>
              <MyPostWidget picturePath={user.picturePath} />
              <Box m="2rem 0" />
            </>
          )}
          <PostsWidget userId={userId} isProfile={true} onlySaved={showOnlySaved}/>
        </Box>
      </Box>
      <ChangePasswordDialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        onChangePassword={passwordChange}
        oldPassword={oldPassword}
        setOldPassword={setOldPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmNewPassword={confirmNewPassword}
        setConfirmNewPassword={setConfirmNewPassword}
      />
      {openProfileEdit && (
        <ProfileEdit
          open={openProfileEdit}
          onClose={() => setOpenProfileEdit(false)}
        />
      )}
    </Box>
  );
};

export default ProfilePage;
