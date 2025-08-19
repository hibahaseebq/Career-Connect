const JWT_SECRET='e67e1b471d09e2ce28955d6cf510fa3c10115079dbf51d945a21cbdfce271552';
// const db = require('../models');
// const {models: {User}} = require('../models');
const {models: {ForumPost, ForumReply}} = require('../models');
const jwt = require('jsonwebtoken');
const {sequelize} = require('../models');


// Get the list of forum questions
exports.getQuestionsList = async (req, res) => {
  try {
    const questions = await sequelize.query(`
      SELECT 
        fp.post_id, fp.title, fp.content, fp.timestamp,
        u.userId AS post_user_id, u.fullName AS user_name, p.first_name AS user_first_name, p.last_name AS user_last_name, p.avatarURL AS user_avatar, r.role_name AS user_role,
        fr.reply_id, fr.content AS reply_content, fr.timestamp AS reply_timestamp, 
        ru.userId AS reply_user_id, ru.fullName AS reply_user_name, rp.first_name AS reply_user_first_name, rp.last_name AS reply_user_last_name, rp.avatarURL AS reply_user_avatar, rr.role_name AS reply_user_role
      FROM forum_posts fp
      LEFT JOIN users u ON fp.userId = u.userId
      LEFT JOIN profiles p ON u.userId = p.userId
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN forum_replies fr ON fp.post_id = fr.post_id
      LEFT JOIN users ru ON fr.userId = ru.userId
      LEFT JOIN profiles rp ON ru.userId = rp.userId
      LEFT JOIN roles rr ON ru.role_id = rr.id
      ORDER BY fp.timestamp DESC, fr.timestamp DESC
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    // Transform the result into the desired structure
    const formattedQuestions = questions.reduce((acc, row) => {
      const post = acc.find(p => p.post_id === row.post_id);
      const reply = {
        reply_id: row.reply_id,
        content: row.reply_content,
        timestamp: row.reply_timestamp,
        user: {
          userId: row.reply_user_id,
          name: row.reply_user_name,
          avatarURL: row.reply_user_avatar,
          role: row.reply_user_role,
          first_name: row.reply_user_first_name,
          last_name: row.reply_user_last_name
        }
      };

      if (post) {
        if (row.reply_id) {
          post.replies.push(reply);
        }
      } else {
        const newPost = {
          post_id: row.post_id,
          title: row.title,
          content: row.content,
          timestamp: row.timestamp,
          user: {
            userId: row.post_user_id,
            name: row.user_name,
            avatarURL: row.user_avatar,
            role: row.user_role,
            first_name: row.user_first_name,
            last_name: row.user_last_name
          },
          replies: row.reply_id ? [reply] : []
        };
        acc.push(newPost);
      }

      return acc;
    }, []);

    res.json(formattedQuestions);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching Questions List' });
  }
};













// Post a new question
exports.postQuestion = async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('Unauthorized - No token provided');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    if (!userId) {
      return res.status(404).json({message: 'Sorry, Please login again, you have not logged in correctly.'});
    }

    const {title, content} = req.body;
    if (!title || !content) {
      return res.status(400).json({message: 'Title and content are required'});
    }

    const newQuestion = await ForumPost.create({
      userId: userId,
      title,
      content,
      timestamp: new Date(),
      created_at: new Date()
    });
     

    res.status(200).json({message: 'Question posted successfully', question: newQuestion});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error posting the question'});
  }
};

// Post a reply to a question
exports.postReplyToQuestion = async (req, res) => {
  const {post_id} = req.params;
  console.log('🚀 ~ exports.postReplyToQuestion= ~ post_id:', post_id);
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('Unauthorized - No token provided');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    if (!userId) {
      return res.status(404).json({message: 'Sorry, Please login again, you have not logged in correctly.'});
    }

    const {content} = req.body;
    if (!content) {
      return res.status(400).json({message: 'Content is required'});
    }

    const newReply = await ForumReply.create({
      post_id,
      userId: userId,
      content: content,
      timestamp: new Date(),
      created_at: new Date()
    });
    console.log('🚀 ~ exports.postReplyToQuestion= ~ post_id:', post_id);

    res.status(200).json({message: 'Replied successfully', reply: newReply});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error posting the reply'});
  }
};


// Controller for deleting a post and its replies
exports.deletePost = async (req, res) => { 
  const {post_id} = req.params;
  let transaction;

  try {
    // Start a transaction
    transaction = await sequelize.transaction();

    // Delete all replies related to the post
    await sequelize.query(
      'DELETE FROM forum_replies WHERE post_id = ?',
      {replacements: [post_id], type: sequelize.QueryTypes.DELETE, transaction}
    );

    // Delete the post
    await sequelize.query(
      'DELETE FROM forum_posts WHERE post_id = ?',
      {replacements: [post_id], type: sequelize.QueryTypes.DELETE, transaction}
    );

    // Commit the transaction
    await transaction.commit();

    res.status(200).json({message: 'Post and its replies deleted successfully'});
  } catch (error) {
    // If any error occurs, rollback the transaction
    if (transaction) {await transaction.rollback()}
    console.error('Error deleting post and its replies:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

// Controller for deleting a reply
exports.deleteReply = async (req, res) => { 
  const {reply_id} = req.params;
  let transaction;

  try {
    // Start a transaction
    transaction = await sequelize.transaction();

    // Delete the reply
    await sequelize.query(
      'DELETE FROM forum_replies WHERE reply_id = ?',
      {replacements: [reply_id], type: sequelize.QueryTypes.DELETE, transaction}
    );

    // Commit the transaction
    await transaction.commit();

    res.status(200).json({message: 'Reply deleted successfully'});
  } catch (error) {
    // If any error occurs, rollback the transaction
    if (transaction) {await transaction.rollback()}
    console.error('Error deleting reply:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};