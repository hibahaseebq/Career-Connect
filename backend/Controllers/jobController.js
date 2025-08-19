const {models: {Job}} = require('../models');
const {Op, Sequelize} = require('sequelize');
const JWT_SECRET='e67e1b471d09e2ce28955d6cf510fa3c10115079dbf51d945a21cbdfce271552';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const parseSalary = (selectedSalaryOption) => {
  switch (selectedSalaryOption) {
    case 'lt50k':
      return [null, 50000]; // Less than $50k
    case '50k-100k':
      return [50000, 100000]; // $50k - $100k
    case '100k-150k':
      return [100000, 150000]; // $100k - $150k
    case '150k-200k':
      return [150000, 200000]; // $150k - $200k
    case 'gt200k':
      return [200000, null]; // More than $200k
    default:
      return [null, null]; // Any or invalid option
  }
};



module.exports = {
  createJob: async (req, res) => {
    try {
      const {title, careerName, companyId, description, salaryMin, salaryMax, deadline, applicationLink, hiringMultipleCandidate, jobType, jobLocation, jobLanguages, skillsRequired} = req.body;

      const career_id = careerName;

      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).send('Unauthorized - No token provided');
      }
      const decoded = jwt.verify(token, JWT_SECRET); 
      const userId = decoded.userId;
            
      const newJob = await Job.create({
        title,
        companyId,
        description,
        salaryMin,
        salaryMax,
        deadline,
        applicationLink,
        hiringMultipleCandidate,
        jobType,
        jobLocation,
        jobLanguages,
        skillsRequired,
        career_id: career_id,
        userId: userId
      });
      res.status(201).json({message: 'Job created successfully', job: newJob});
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },
  // update the job function--
  updateJob: async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send('Unauthorized - No token provided');
    }
    const decoded = jwt.verify(token, JWT_SECRET); 
    const userId = decoded.userId;
    try {
      const {jobId} = req.params;
      const {title, description, salaryMin, salaryMax, deadline, applicationLink, hiringMultipleCandidate, jobType, jobLocation,  skillsRequired} = req.body;
      const hiringMultipleCandidateValue = hiringMultipleCandidate === 'on' || hiringMultipleCandidate === true ? true : false;

      const job = await Job.findOne({where: {id: jobId, userId: userId}});

      if (!job) {
        return res.status(404).json({message: 'Job not found or you are not authorized to update this job'});
      }
      await job.update({
        title,
        description,
        salaryMin,
        salaryMax,
        deadline,
        applicationLink,
        hiringMultipleCandidate: hiringMultipleCandidateValue,
        jobType,
        jobLocation,
        skillsRequired,
        isApproved: false
      });

      res.status(200).json({message: 'Job updated successfully', job});
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },
  deleteJob: async (req, res) => {
    try {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({message: 'Unauthorized - No token provided'});
      }
  
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
      const role = decoded.role;
      console.log('🚀 ~ deleteJob: ~ role:', role);
      const {jobId} = req.params;
      
      let deletedJob;
      if (role === 'admin') {
        // Admin can delete any job
        deletedJob = await Job.destroy({where: {id: jobId}});
      } else {
        // Regular user can only delete their own jobs
        deletedJob = await Job.destroy({where: {id: jobId, userId: userId}});
      }


      if (deletedJob === 0) {
        return res.status(404).json({message: 'Job not found or you are not authorized to delete this job'});
      }
  
      res.status(200).json({message: 'Job deleted successfully'});
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },
  getJob: async (req, res) => {
    try {
      const {jobId} = req.params;
      const id = jobId;
      const job = await Job.findByPk(id);

      if (!job) {
        res.status(404).json({message: 'Job not found'});
      } else {
        res.status(200).json({job});
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },



 
  // get job by serarch filter
  getAllJobs: async (req, res) => {
    try {
      const {searchQuery, keywords, Locations, datePosted, Companies, Types, Languages, selectedSalaryOption} = req.query;

      const query = {};

      const filter = {};

      if (searchQuery) {
        filter.title = {[Op.like]: `%${searchQuery}%`};
      }

      if (Locations) {
        filter.jobLocation = Locations;
      }

      if (datePosted) {
        filter.createdAt = {[Op.gte]: getDateThreshold(datePosted)};
      }

      if (Companies) {
        filter.companyId  = Companies;
      }

      if (selectedSalaryOption) {
        const [minSalary, maxSalary] = parseSalary(selectedSalaryOption);
        if (minSalary !== null && maxSalary !== null) {
          filter.salaryMin = {[Op.gte]: minSalary};
          filter.salaryMax = {[Op.lte]: maxSalary};
        } else if (minSalary !== null) {
          filter.salaryMin = {[Op.gte]: minSalary};
        } else if (maxSalary !== null) {
          filter.salaryMax = {[Op.lte]: maxSalary};
        }
      }
      if (keywords) {
        filter.description = {[Op.like]: `%${keywords}%`};
      }

      if (Types) {
        filter.jobType  = Types;
      }

      if (Languages) {
        filter.jobLanguages = {
          [Sequelize.Op.like]: [Languages]
        };
      }

      const allJobs = await Job.findAll({where: filter});

      if (!allJobs || allJobs.length === 0) {
        return res.status(404).json({message: 'No jobs found'});
      }

      res.status(200).json({jobs: allJobs});
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },

  getJobOptions: async (req, res) => {
    try {
      const Locations = await Job.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('jobLocation')), 'jobLocation']]
      });
      const Companies = await Job.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('companyId')), 'companyId']]
      });
      const Types = await Job.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('jobType')), 'jobType']]
      });
      const Languages = await Job.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('jobLanguages')), 'jobLanguages']]
      });
      
  
      res.json({
        Locations: Locations.map(item => item.dataValues.jobLocation),
        Companies: Companies.map(item => item.dataValues.companyId),
        Types: Types.map(item => item.dataValues.jobType),
        Languages: Languages.map(item => item.dataValues.jobLanguages)
      });
    } catch (error) {
      res.status(500).json({message: 'Error fetching options', error});
    }
  },

  getUserJobPosts: async (req, res) => {
    try {
      const {userId} = req.params;
      const allJobs = await Job.findAll({where: {userId}});

      if (!allJobs || allJobs.length === 0) {
        return res.status(404).json({message: 'No jobs found'});
      }

      res.status(200).json({jobs: allJobs});
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },

  // admin functions 

  getAdminAllAcceptedJobs: async (req, res) => {
    try {
      const allJobs = await Job.findAll({where: {isApproved: true}});
      if (!allJobs || allJobs.length === 0) {
        return res.status(404).json({message: 'No jobs found'});
      }
      res.status(200).json({jobs: allJobs});
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },


  getAllJobsRequests: async (req, res) => {
    try {
      const allJobs = await Job.findAll({where: {isApproved: false}});

      if (!allJobs || allJobs.length === 0) {
        return res.status(404).json({message: 'No jobs found'});
      }
      res.status(200).json({jobs: allJobs});
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },

  adminActionOnJobs: async (req, res) => {
    try {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
     
      if (!token) {
        return res.status(401).json({message: 'Unauthorized - No token provided'});
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const role = decoded.role;
     

      if (role !== 'admin') {
        return res.status(403).json({message: 'Forbidden - You are not authorized to perform this action'});
      }

      const {jobId} = req.params;
      const {action} = req.body; // Expecting { action: 'approve' } or { action: 'reject' }

      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({message: 'Invalid action. Use "approve" or "reject"'});
      }

      const job = await Job.findOne({where: {id: jobId}});
      if (!job) {
        return res.status(404).json({message: 'Job not found'});
      }

      if (action === 'approve') {
        await Job.update({isApproved: true}, {where: {id: jobId}});
      } else if (action === 'reject') {
        await Job.update({isApproved: false}, {where: {id: jobId}});
      }

      res.status(200).json({message: `Job ${action}d successfully`});
    } catch (error) {
      console.error('Error processing admin action on job:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  }

};

const getDateThreshold = (datePosted) => {
  const dateThreshold = new Date(); // Initialize with current date

  switch (datePosted) {
    case 'today':
      dateThreshold.setHours(0, 0, 0, 0);
      break;
    case 'last7days':
      dateThreshold.setDate(dateThreshold.getDate() - 7);
      break;
    case 'lastMonth':
      dateThreshold.setMonth(dateThreshold.getMonth() - 1);
      break;
    case 'lastYear':
      dateThreshold.setFullYear(dateThreshold.getFullYear() - 1);
      break;
    default:
      dateThreshold.setFullYear(2000);
      break;
  }

  return dateThreshold;
};

