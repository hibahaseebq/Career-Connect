import { Box, Typography, LinearProgress, List, ListItem, ListItemText, Divider, Grid, Stack, Avatar, CardContent, Card, CardActions, Button, CardHeader } from '@mui/material';
import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import BarChartIcon from '@mui/icons-material/BarChart';

// Subcomponent to display individual statistics
const StatisticBox = ({ title, value, icon: Icon, iconBgColor, trend, diff, mode }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography style={{textWrap:"nowrap"}} color="text.secondary" variant="overline">
                {title}
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar style={{color:`${mode==='light'? 'white':'white'}`}} sx={{ backgroundColor: iconBgColor, height: '56px', width: '56px' }}>
              <Icon  style={{ fontSize:"25px"}}/>
            </Avatar>
          </Stack>
          {diff ? (
            <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
              <Stack sx={{ alignItems: 'center' }} direction="row" spacing={0.5}>
                {trend && <trend.icon color={trend.color} fontSize="var(--icon-fontSize-md)" />}
                <Typography color={trend.color} variant="body2">
                  {diff}%
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="caption">
                Since last month
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );

// Subcomponent to display the score with progress
const ScoreProgress = ({ score }) => (
  <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
    <Typography  variant="h5" gutterBottom>
      Score: {score}%
    </Typography>
    <LinearProgress variant="determinate" value={score} sx={{ height: 10, borderRadius: 5 }} />
  </Box>
);

// Subcomponent to display the bar chart
const BarChart = ({ data }) => (


  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        action={
          <Button color="inherit" size="small" 
          // startIcon={
          // <ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}
          >
            Sync
          </Button>
        }
        title="Answers to questions"
      />
      <CardContent sx={{ flexGrow: 1 }}>
      <Bar
      data={data}
      options={{
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: (value) => (value ? 'Correct' : 'Incorrect'),
            },
          },
        },
        plugins: {
          legend: { display: false },
        },
      }}
    />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="inherit" 
        // endIcon={
        // <ArrowRightIcon fontSize="var(--icon-fontSize-md)" />} size="small"
        >
          Overview
        </Button>
      </CardActions>
    </Card>
);

// Subcomponent to display the doughnut chart
const DoughnutChart = ({ data }) => (

  <Card className='donut-card' sx={{ height: '100%'}}>
      <CardHeader title="Traffic source" />
      <CardContent className='dounut-card-content' style={{marginTop:"50px"}}>
        <Doughnut
              data={data}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
      </CardContent>
    </Card>
);

// Subcomponent to display the list of questions and answers
const QuestionsList = ({ questions, selectedOptions, selectedOptionTexts }) => {
  
  return <List >
    	{questions.map((question, index) => {
      	const selectedOptionId = selectedOptions[question.question_id];
      	const selectedOptionText = selectedOptionTexts[selectedOptionId] || 'No answer selected';
      	const correctOption = question.options.find(option => option.is_correct);
        const correctOptionText = correctOption ? correctOption.option_text : 'No correct answer provided';
        
        const isCorrect =  selectedOptionId==correctOption?.option_id;
	
      	return (
        	<React.Fragment key={index}>
          	<ListItem>
            	<ListItemText
              	primary={`Q${index + 1}: ${question.question_text}`}
              	secondary={
                	<Box>
                    <Typography
                    	sx={{
                      	padding: '2px 6px',
                      	borderRadius: '4px',
                      	display: 'inline-block',
                      	marginBottom: '4px',
                        fontSize: "0.8rem"
                    	}}
                  	>
                    	{`Your answer:`}
                  	</Typography>
                  	<Typography
                    	sx={{
                      	backgroundColor: isCorrect ? 'success.main' : 'error.main',
                      	color: 'white',
                      	padding: '2px 6px',
                      	borderRadius: '4px',
                      	display: 'inline-block',
                      	marginBottom: '4px',
                        fontSize: "0.8rem"
                    	}}
                  	>
                    	{`${selectedOptionText}`}
                  	</Typography>
                  	{!isCorrect && (
                    	<Typography
                      	sx={{
                        	backgroundColor: 'success.main',
                        	color: 'white',
                        	padding: '2px 6px',
                        	borderRadius: '4px',
                        	display: 'inline-block',
                        fontSize: "0.8rem",
                        marginLeft:"10px"

                      	}}
                    	>
                      	{`Correct answer: ${correctOptionText}`}
                    	</Typography>
                  	)}
                	</Box>
              	}
            	/>
          	</ListItem>
          	{index < questions.length - 1 && <Divider />}
        	</React.Fragment>
      	);
    	})}
  	</List>
};


const getCorrectOptionText = (question) => {
  const correctOption = question.options.find((option) => option.is_correct);
  return correctOption ? correctOption.option_text : 'No correct option';
};

const getUserAnswerText = (question, selectedOptions) => {
  const userAnswerId = selectedOptions[question.question_id];
  const userAnswer = question.options.find((option) => option.option_id === Number(userAnswerId));
  return userAnswer ? userAnswer.option_text : 'No answer';
};











// main component

const AssessmentResultDisplay = ({ result, mode, questions }) => {
  console.log(questions, "questions")
  const totalQuestions = result?.totalQuestions || 0;
  const correctAnswers = result?.correctAnswers || 0;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const passScore = 50;
  const passed = result?.score >= passScore;
  const averageScore = result?.averageScore || 0;

  const chartData = {
    labels: questions.map((q, i) => `Q${i + 1}`),
    datasets: [
      {
        label: 'Answers',
        backgroundColor: questions.map((q) => {
          console.log(result, 'at CharData')
          const correctOption = q.options.find((option) => option.is_correct);
          const selectedOption = result?.selectedOptions[q.question_id];
          return selectedOption !== correctOption?.option_id ? 'rgba(75,192,192,0.6)' : 'rgba(255,99,132,0.6)';
        }),
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: questions.map((q) => {
          const correctOption = q.options.find((option) => option.is_correct);
          const selectedOption = result.selectedOptions[q.question_id];
          return selectedOption == correctOption?.option_id ? 'rgba(75,192,192,0.8)' : 'rgba(255,99,132,0.8)';
        }),
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: questions.map((q) => {
          const correctOption = q.options.find((option) => option.is_correct);
          const selectedOption = result.selectedOptions[q.question_id];
          return selectedOption == correctOption?.option_id ? 1 : 0;
        }),
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Correct Answers', 'Incorrect Answers'],
    datasets: [
      {
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)'],
        hoverBackgroundColor: ['rgba(75,192,192,0.8)', 'rgba(255,99,132,0.8)'],
      },
    ],
  };

  let aValue = Number(result?.score);

if (typeof aValue !== 'number') {
  Number(aValue); 
}

aValue = aValue.toFixed(2);

  return (
    <Grid container style={{marginTop:"32px"}} spacing={3}>
      <Grid  style={{color:`${mode==='light'? 'black':'white'}`}} item xs={12}>
        <ScoreProgress score={aValue}/>
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <StatisticBox mode={mode} title="Total Questions" iconBgColor="#0d47a1d4" value={totalQuestions} icon={HelpOutlineIcon}  />
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <StatisticBox mode={mode} title="Correct Answers" iconBgColor="#55bbd0cc" value={correctAnswers} icon={CheckCircleOutlineIcon}  />
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <StatisticBox mode={mode} title="Incorrect Answers" iconBgColor="#f1698abf" value={incorrectAnswers} icon={HighlightOffIcon}   />
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <StatisticBox mode={mode} title="Average Score" iconBgColor="#ffa000cf" value={`${aValue}%`} icon={BarChartIcon} />
      </Grid>

      <Grid className="height-reault-chart" container spacing={3} sx={{ justifyContent: "center", alignItems: "center", width: "100%", marginTop: "32px", margin: "0px auto" }}>

        <Grid className='bar-chart' item lg={8} md={12} xs={12} >
          <BarChart data={chartData} />
        </Grid>

        <Grid className='dounut-parent' item lg={4} md={12} xs={12} sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <DoughnutChart data={doughnutChartData} />
        </Grid>
        
      </Grid>

      <Grid className='question-list-result' item xs={12}>
      <Card>
        <QuestionsList questions={questions} selectedOptions={result?.selectedOptions}  selectedOptionTexts={result?.selectedOptionTexts} />
      </Card>
      </Grid>
    </Grid>
  );
};

export default AssessmentResultDisplay;
