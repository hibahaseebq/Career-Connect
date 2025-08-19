import React from 'react';
import {
  Box,
  // Grid,
  // Paper,
  Typography,
  Card,
  // CardContent,
  // Avatar,
  // Tooltip,
} from '@mui/material';
// import { styled } from '@mui/system';
// import PeopleIcon from '@mui/icons-material/People';
// import WorkIcon from '@mui/icons-material/Work';
// import SchoolIcon from '@mui/icons-material/School';
// import ForumIcon from '@mui/icons-material/Forum';
// import AssessmentIcon from '@mui/icons-material/Assessment';

const sampleData = {
  totalUsers: 150,
  usersByRole: [
    { role: 'Student', count: 100 },
    { role: 'Counselor', count: 30 },
    { role: 'Admin', count: 20 },
  ],
  newUsers: 10,
  totalCareerRecommendations: 25,
  recentCareerRecommendations: [
    { name: 'Software Engineer', createdAt: '2024-07-01' },
    { name: 'Data Scientist', createdAt: '2024-06-25' },
  ],
  totalJobListings: 40,
  recentJobListings: [
    { title: 'Frontend Developer', createdAt: '2024-07-02' },
    { title: 'Backend Developer', createdAt: '2024-06-28' },
  ],
  totalConsultations: 15,
  upcomingConsultations: [
    { date: '2024-07-05', student: 'John Doe' },
    { date: '2024-07-06', student: 'Jane Smith' },
  ],
  totalForumPosts: 50,
  recentForumPosts: [
    { title: 'How to learn React?', createdAt: '2024-07-03' },
    { title: 'Best practices for Node.js', createdAt: '2024-06-30' },
  ],
  totalForumReplies: 150,
  popularForumPosts: [
    { title: 'JavaScript tips', replies: 20 },
    { title: 'CSS tricks', replies: 15 },
  ],
  totalAssessmentsTaken: 120,
  recentAssessmentResults: [
    { user: 'Alice', score: 85, createdAt: '2024-07-01' },
    { user: 'Bob', score: 90, createdAt: '2024-06-29' },
  ],
};

// const CardContainer = styled(Card)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(2),
//   margin: theme.spacing(1),
//   transition: 'transform 0.2s',
//   '&:hover': {
//     transform: 'scale(1.05)',
//   },
// }));

const Overview = () => {
  return (
    <Box sx={{ display:"flex", justifyContent:"center", alignItems:"center", maxHeight:"100vh", minHeight:"70vh"}}>
      {/* <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Admin Dashboard Overview
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="Total registered users">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <PeopleIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h5">{sampleData.totalUsers}</Typography>
                <Typography color="text.secondary">Total Users</Typography>
              </CardContent>
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="Breakdown of users by role">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <PeopleIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h5">Users by Role</Typography>
                {sampleData.usersByRole.map((role) => (
                  <Typography key={role.role} color="text.secondary">
                    {role.role}: {role.count}
                  </Typography>
                ))}
              </CardContent>
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="New users registered in the past month">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <PeopleIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h5">{sampleData.newUsers}</Typography>
                <Typography color="text.secondary">New Users</Typography>
              </CardContent>
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="Total career recommendations provided">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <WorkIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h5">{sampleData.totalCareerRecommendations}</Typography>
                <Typography color="text.secondary">Career Recommendations</Typography>
              </CardContent>
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="List of recent career recommendations">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Typography variant="h5">Recent Career Recommendations</Typography>
              {sampleData.recentCareerRecommendations.map((rec) => (
                <Typography key={rec.name} color="text.secondary">
                  {rec.name} - {rec.createdAt}
                </Typography>
              ))}
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="Total job listings available">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <WorkIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h5">{sampleData.totalJobListings}</Typography>
                <Typography color="text.secondary">Job Listings</Typography>
              </CardContent>
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="List of recent job listings">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Typography variant="h5">Recent Job Listings</Typography>
              {sampleData.recentJobListings.map((job) => (
                <Typography key={job.title} color="text.secondary">
                  {job.title} - {job.createdAt}
                </Typography>
              ))}
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="Total number of consultations">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <SchoolIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h5">{sampleData.totalConsultations}</Typography>
                <Typography color="text.secondary">Consultations</Typography>
              </CardContent>
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="Upcoming consultations">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Typography variant="h5">Upcoming Consultations</Typography>
              {sampleData.upcomingConsultations.map((consult) => (
                <Typography key={consult.date} color="text.secondary">
                  {consult.date} - {consult.student}
                </Typography>
              ))}
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="Total number of forum posts">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <ForumIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h5">{sampleData.totalForumPosts}</Typography>
                <Typography color="text.secondary">Forum Posts</Typography>
              </CardContent>
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="List of recent forum posts">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Typography variant="h5">Recent Forum Posts</Typography>
              {sampleData.recentForumPosts.map((post) => (
                <Typography key={post.title} color="text.secondary">
                  {post.title} - {post.createdAt}
                </Typography>
              ))}
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="Total number of forum replies">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <ForumIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h5">{sampleData.totalForumReplies}</Typography>
                <Typography color="text.secondary">Forum Replies</Typography>
              </CardContent>
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="Popular forum posts with the most replies">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Typography variant="h5">Popular Forum Posts</Typography>
              {sampleData.popularForumPosts.map((post) => (
                <Typography key={post.title} color="text.secondary">
                  {post.title} - {post.replies} replies
                </Typography>
              ))}
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="Total number of assessments taken">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <AssessmentIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h5">{sampleData.totalAssessmentsTaken}</Typography>
                <Typography color="text.secondary">Assessments Taken</Typography>
              </CardContent>
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Tooltip title="Recent assessment results">
            <CardContainer  whileHover={{ scale: 1.05 }}>
              <Typography variant="h5">Recent Assessment Results</Typography>
              {sampleData.recentAssessmentResults.map((result) => (
                <Typography key={result.user} color="text.secondary">
                  {result.user} - {result.score} - {result.createdAt}
                </Typography>
              ))}
            </CardContainer>
          </Tooltip>
        </Grid>
      </Grid> */}

<Typography variant="h3" sx={{ mb: 3, textAlign:"center", lineHeight:"3.5rem" }}>
  Overview Section <br />
Comming soon!
          </Typography>
      
    </Box>
  );
};

export default Overview;