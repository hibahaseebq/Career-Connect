// src/Components/RequestHandling.js
import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Box, Button, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import api from '../Api/Api.js'
import { Link } from 'react-router-dom';

const RequestHandling = ({activeButton, request, onAccept, onReject, mode }) => {
  
  function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const secondsPast = (now - past) / 1000;
  
    if (secondsPast < 60) {
      return `${Math.floor(secondsPast)} sec ago`;
    }
    if (secondsPast < 3600) {
      return `${Math.floor(secondsPast / 60)} minut ago`;
    }
    if (secondsPast < 86400) {
      return `${Math.floor(secondsPast / 3600)} hrs ago`;
    }
    if (secondsPast < 2592000) {
      return `${Math.floor(secondsPast / 86400)} days ago`;
    }
    if (secondsPast < 31536000) {
      return `${Math.floor(secondsPast / 2592000)} months ago`;
    }
    return `${Math.floor(secondsPast / 31536000)} years ago`;
  }


  const createdAt = request.createdAt;
  const timeAgoText = timeAgo(createdAt);


  return (
   
      <ListItem  key={request.senderId} className={`${mode === "light" ? 'light-m-bg-prime-color light-m-border-prime-color' : 'dark-m-bg-second-color dark-m-border-prime-color'} `} borderRadius={'6px'} padding={'20px'} style={{display:"flex", justifyContent:"space-between", position:"relative"}} gap={1.5}>

    <Link  to={`/profile/${request.senderId}`} style={{ textDecoration: 'none', color: 'inherit', display:"flex", alignItems:"center", flex:"2" }}>

    <ListItemAvatar style={{height:"50px", width:"50px", marginRight:"10px"}}>
        <Avatar style={{height:"50px", width:"50px"}} src={request.senderAvatarUrl} alt={request.senderFullName} />

        <Badge
                sx={{
                backgroundColor: "#4CAF50",
                bottom: "12px",
                left: "10px",
                position:"relative",
                borderRadius: "15px",
                padding:"1px 6px",
                fontSize:"9px",
                color:"white",
                border:"2px solid white",
                textWrap:"nowrap"
                }} 
                overlap="circular"
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
                }}
                >
                {`${request.senderUserType}`}
                </Badge>

                
    </ListItemAvatar>
    <ListItemText
        primary={
            <>
            <Typography
                variant="body1"
                color={mode === 'light' ? 'text.primary' : 'white'}
                component="span"
                style={{ fontWeight: 'bold' }}
            >
                {request.senderFullName}
                
            </Typography>

               
               </>
        }
        secondary={
            <>
                <Typography
                    variant="body2"
                    color={mode === 'light' ? 'text.secondary' : '#cfcfcf'}
                    component="span"
                >
                    {request.senderHeadline? `${request.senderHeadline}`: 'headline is not setup yet! by this user'}
                </Typography>
                <br />
                <Typography
                    variant="caption"
                    color={mode === 'light' ? 'text.secondary' : '#cfcfcf'}
                    component="span"
                >
                    {request.senderDistrict}, {request.senderRegion},  {request.senderCountry}
                </Typography>
            </>
        }
        primaryTypographyProps={{ className: mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color' }}
        secondaryTypographyProps={{ className: mode === 'light' ? 'light-m-text-secondary-color' : 'dark-m-text-secondary-color' }}
    />

    </Link>

      
      <span className={`${mode  === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`}  style={{marginLeft:"20px", fontWeight:"lighter", fontSize:"12px", position:"absolute", bottom:"5px", right:"5px"}}>{timeAgoText}</span>

      <Box display={'flex'} gap={2}>
        <Button onClick={onReject} sx={{ border: `2px solid ${mode === "light" ? "primary.main" : "primary.light"}`, borderRadius: "20px", borderWidth:"2px" }} variant="outlined" color="secondary" >
          Reject
        </Button>
        <Button  onClick={onAccept}
           variant={"contained"}
           size="small"
          color="primary"
          sx={{ border: `2px solid ${mode === "light" ? "primary.main" : "primary.light"}`, borderRadius: "20px", borderWidth:"2px" }}
        >
          Accept
        </Button>
      </Box>
  </ListItem>
  );
};

export default RequestHandling;
