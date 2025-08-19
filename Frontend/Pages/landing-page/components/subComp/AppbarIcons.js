import * as React from 'react';
import { Avatar, Badge, IconButton, Tooltip } from '@mui/material';
import { Home, Work, People, Message, NotificationsNone, NotificationsActive, Notifications, PostAddRounded, Forum, AssessmentSharp } from '@mui/icons-material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import School from '@mui/icons-material/School';


const LightHomeIcon = () => <Home  />;
const DarkHomeIcon = () => <Home />;

const LightWorkIcon = () => <BusinessCenterIcon />;
const DarkWorkIcon = () => <BusinessCenterIcon />;

const LightForumIcon = () => <Forum />;
const DarkForumIcon = () => <Forum />;

const LightPostIcon = () => <PostAddRounded />;
const DarkPostIcon = () => <PostAddRounded />;

const LightPeopleIcon = () => <People />;
const DarkPeopleIcon = () => <People />;

const LightMessageIcon = () => <Message />;
const DarkMessageIcon = () => <Message />;

const LightCareerIcon = () => <School />;
const DarkCareerIcon = () => <School />;


const LightAssessmentIcon = () => <AssessmentSharp />;
const DarkAssessmentIcon = () => <AssessmentSharp />;



// const LightNotificationsIcon = ({notificationData }) => (
//     <Badge badgeContent={notificationData?.length} color="error">
//       <Notifications />
//     </Badge>
// );
// const DarkNotificationsIcon = ({notificationData }) => (
//     <Badge badgeContent={notificationData?.length} color="error">
//       <NotificationsActive />
//     </Badge>
// );

const ProfileAvatar = ({ profilePic, userProfile }) => {
  let avatarSrc = profilePic || userProfile || '';

  if(userProfile==='noProfilePicture'){
    avatarSrc=null
  }

  return (
  <Tooltip title="Your profile" placement="bottom">
    <Avatar style={{ width: "35px", height: "35px", borderRadius: "50%" }} alt="Profile" src={avatarSrc} />
    </Tooltip>
    )};

export default ProfileAvatar;

export {LightCareerIcon, DarkCareerIcon, LightAssessmentIcon, DarkAssessmentIcon, LightHomeIcon, DarkHomeIcon, LightWorkIcon, DarkWorkIcon, LightPeopleIcon, DarkPeopleIcon, LightMessageIcon, DarkMessageIcon, 
   ProfileAvatar, LightPostIcon, DarkPostIcon, LightForumIcon, DarkForumIcon };
