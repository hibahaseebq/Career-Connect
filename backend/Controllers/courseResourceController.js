const {models: {CourseResourceModel}} = require('../models');

exports.getResources = async (req, res) => {
  const {career_id} = req.params;
  try {
    const resources = await CourseResourceModel.findAll({where: {career_id}});
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

exports.getResourceById = async (req, res) => {
  const {career_id, resource_id} = req.params;
  try {
    const resource = await CourseResourceModel.findOne({where: {career_id, resource_id}});
    if (!resource) {
      return res.status(404).json({message: 'Resource not found'});
    }
    res.status(200).json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

exports.addCourseResource = async (req, res) => {
  const {career_id} = req.params;
  const {resource_name, resource_link, description} = req.body;
  try {
    const newResource = await CourseResourceModel.create({career_id, resource_name, resource_link, description});
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error adding course resource:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

exports.updateCourseResource = async (req, res) => {
  const {career_id, resource_id} = req.params;
  const {resource_name, resource_link, description} = req.body;
  try {
    const resource = await CourseResourceModel.findOne({where: {career_id, resource_id}});
    if (!resource) {
      return res.status(404).json({message: 'Resource not found'});
    }
    resource.resource_name = resource_name;
    resource.resource_link = resource_link;
    resource.description = description;
    await resource.save();
    res.status(200).json({message: 'Course resource updated successfully'});
  } catch (error) {
    console.error('Error updating course resource:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

exports.deleteCourseResource = async (req, res) => {
  const {career_id, resource_id} = req.params;
  try {
    const resource = await CourseResourceModel.findOne({where: {career_id, resource_id}});
    if (!resource) {
      return res.status(404).json({message: 'Resource not found'});
    }
    await resource.destroy();
    res.status(200).json({message: 'Course resource deleted successfully'});
  } catch (error) {
    console.error('Error deleting course resource:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};
