// controllers/messageController.js
const {models: {User, Conversation, Message}} = require('../models');
const jwt = require('jsonwebtoken');
const { sequelize, Op } = require('../models');

const JWT_SECRET = 'e67e1b471d09e2ce28955d6cf510fa3c10115079dbf51d945a21cbdfce271552';

module.exports = {
    getConversations: async (req, res) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'No token provided, authorization denied' });
        }
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          const userId = decoded.userId;
          const conversations = await sequelize.query(`
          SELECT 
      c.conversation_id, 
      c.participant1_id, 
      c.participant2_id, 
      u1.userId AS participant1_userId,
      u1.fullName AS participant1_fullName,
      p1.avatarURL AS participant1_avatarURL,
      p1.first_name AS participant1_first_name,
      p1.last_name AS participant1_last_name,
      p1.headline AS participant1_headline,
      r1.role_name AS participant1_roleName,
      u2.userId AS participant2_userId,
      u2.fullName AS participant2_fullName,
      p2.avatarURL AS participant2_avatarURL,
      p2.first_name AS participant2_first_name,
      p2.last_name AS participant2_last_name,
      p2.headline AS participant2_headline,
      r2.role_name AS participant2_roleName,
      (
        SELECT COUNT(*)
        FROM messages AS m
        WHERE m.conversation_id = c.conversation_id
        AND m.receiver_id = :userId
        AND m.readAt IS NULL
      ) AS unreadMessagesCount,
      (
        SELECT m.sender_id
        FROM messages AS m
        WHERE m.conversation_id = c.conversation_id
        ORDER BY m.createdAt DESC
        LIMIT 1
      ) AS lastMessageSenderId,
      (
        SELECT m.receiver_id
        FROM messages AS m
        WHERE m.conversation_id = c.conversation_id
        ORDER BY m.createdAt DESC
        LIMIT 1
      ) AS lastReceiverId,
      (
        SELECT MAX(m.createdAt)
        FROM messages AS m
        WHERE m.conversation_id = c.conversation_id
      ) AS createdAt,
      CASE 
        WHEN c.participant1_id = :userId THEN u2.userId
        WHEN c.participant2_id = :userId THEN u1.userId
      END AS other_participant_id, 
      CASE 
        WHEN c.participant1_id = :userId THEN u2.fullName
        WHEN c.participant2_id = :userId THEN u1.fullName
      END AS other_participant_fullName,
      CASE 
        WHEN c.participant1_id = :userId THEN p2.avatarURL
        WHEN c.participant2_id = :userId THEN p1.avatarURL
      END AS other_participant_avatarURL,
      CASE 
        WHEN c.participant1_id = :userId THEN p2.first_name
        WHEN c.participant2_id = :userId THEN p1.first_name
      END AS other_participant_first_name,
      CASE 
        WHEN c.participant1_id = :userId THEN p2.last_name
        WHEN c.participant2_id = :userId THEN p1.last_name
      END AS other_participant_last_name,
      CASE 
        WHEN c.participant1_id = :userId THEN p2.headline
        WHEN c.participant2_id = :userId THEN p1.headline
      END AS other_participant_headline,
      CASE 
        WHEN c.participant1_id = :userId THEN r2.role_name
        WHEN c.participant2_id = :userId THEN r1.role_name
      END AS other_participant_roleName
    FROM 
      conversations AS c
    LEFT JOIN 
      users AS u1 ON c.participant1_id = u1.userId
    LEFT JOIN 
      profiles AS p1 ON u1.userId = p1.userId
    LEFT JOIN 
      roles AS r1 ON u1.role_id = r1.id
    LEFT JOIN 
      users AS u2 ON c.participant2_id = u2.userId
    LEFT JOIN 
      profiles AS p2 ON u2.userId = p2.userId
    LEFT JOIN 
      roles AS r2 ON u2.role_id = r2.id
    WHERE 
      c.participant1_id = :userId OR c.participant2_id = :userId
`, {
  replacements: { userId }, // Replace with actual userId
  type: sequelize.QueryTypes.SELECT
});
            // console.log("conversations is", conversations, "conversations")
        
        if (!conversations || conversations.length === 0) {
          return res.status(404).json({ message: 'No conversations found for this user.' });
        }
        

        console.log("🚀 ~ getConversations: ~ conversations:", conversations)
    
          res.json(conversations);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    
      getConversationsById: async (req, res) => {
        const { conversation_id } = req.params;
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token provided, authorization denied' });
            }
            
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                const userId = decoded.userId;

                const conversation = await sequelize.query(`
                SELECT 
                c.conversation_id, 
                c.participant1_id, 
                c.participant2_id, 
                u1.userId AS participant1_userId,
                u1.fullName AS participant1_fullName,
                p1.avatarURL AS participant1_avatarURL,
                p1.first_name AS participant1_first_name,
                p1.last_name AS participant1_last_name,
                p1.headline AS participant1_headline,
                r1.role_name AS participant1_roleName,
                u2.userId AS participant2_userId,
                u2.fullName AS participant2_fullName,
                p2.avatarURL AS participant2_avatarURL,
                p2.first_name AS participant2_first_name,
                p2.last_name AS participant2_last_name,
                p2.headline AS participant2_headline,
                r2.role_name AS participant2_roleName,
                CASE 
                    WHEN c.participant1_id = :userId THEN u2.userId
                    WHEN c.participant2_id = :userId THEN u1.userId
                END AS other_participant_id, 
                CASE 
                    WHEN c.participant1_id = :userId THEN u2.fullName
                    WHEN c.participant2_id = :userId THEN u1.fullName
                END AS other_participant_fullName,
                CASE 
                    WHEN c.participant1_id = :userId THEN p2.avatarURL
                    WHEN c.participant2_id = :userId THEN p1.avatarURL
                END AS other_participant_avatarURL,
                CASE 
                    WHEN c.participant1_id = :userId THEN p2.first_name
                    WHEN c.participant2_id = :userId THEN p1.first_name
                END AS other_participant_first_name,
                CASE 
                    WHEN c.participant1_id = :userId THEN p2.last_name
                    WHEN c.participant2_id = :userId THEN p1.last_name
                END AS other_participant_last_name,
                CASE 
                    WHEN c.participant1_id = :userId THEN p2.headline
                    WHEN c.participant2_id = :userId THEN p1.headline
                END AS other_participant_headline,
                CASE 
                    WHEN c.participant1_id = :userId THEN r2.role_name
                    WHEN c.participant2_id = :userId THEN r1.role_name
                END AS other_participant_roleName
                FROM 
                conversations AS c
                LEFT JOIN 
                users AS u1 ON c.participant1_id = u1.userId
                LEFT JOIN 
                profiles AS p1 ON u1.userId = p1.userId
                LEFT JOIN 
                roles AS r1 ON u1.role_id = r1.id
                LEFT JOIN 
                users AS u2 ON c.participant2_id = u2.userId
                LEFT JOIN 
                profiles AS p2 ON u2.userId = p2.userId
                LEFT JOIN 
                roles AS r2 ON u2.role_id = r2.id
                WHERE 
                c.conversation_id = :conversation_id
                AND (c.participant1_id = :userId OR c.participant2_id = :userId)
                `, {
                replacements: { userId, conversation_id },
                type: sequelize.QueryTypes.SELECT
                });

                if (!conversation || conversation.length === 0) {
                return res.status(404).json({ message: 'Conversation not found.' });
                }

                // console.log("conversation[0]", conversation[0], "conversation[0]")
                res.json(conversation[0]);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
      
    
      createConversation: async (req, res) => {
        const { participant2_id } = req.body;
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'No token provided, authorization denied' });
        }
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          const participant1_id = decoded.userId;
    
          // Ensure participant1_id is always less than participant2_id
          const [user1, user2] = participant1_id < participant2_id 
                                  ? [participant1_id, participant2_id]
                                  : [participant2_id, participant1_id];
    
          // Check if a conversation already exists between these two users
          const existingConversation = await Conversation.findOne({
            where: {
              participant1_id: user1,
              participant2_id: user2,
            },
          });
    
          if (existingConversation) {
            return res.status(400).json({ message: 'Conversation already exists between these users' });
          }
    
          // Create a new conversation
          const conversation = await Conversation.create({
            participant1_id: user1,
            participant2_id: user2,
          });
    

          // Fetch the detailed information of the newly created conversation
    const detailedConversation = await sequelize.query(`
    SELECT 
      c.conversation_id, 
      c.participant1_id, 
      c.participant2_id, 
      u1.userId AS participant1_userId,
      u1.fullName AS participant1_fullName,
      p1.avatarURL AS participant1_avatarURL,
      p1.first_name AS participant1_first_name,
      p1.last_name AS participant1_last_name,
      p1.headline AS participant1_headline,
      r1.role_name AS participant1_roleName,
      u2.userId AS participant2_userId,
      u2.fullName AS participant2_fullName,
      p2.avatarURL AS participant2_avatarURL,
      p2.first_name AS participant2_first_name,
      p2.last_name AS participant2_last_name,
      p2.headline AS participant2_headline,
      r2.role_name AS participant2_roleName,
      CASE 
        WHEN c.participant1_id = :userId THEN u2.userId
        WHEN c.participant2_id = :userId THEN u1.userId
      END AS other_participant_id, 
      CASE 
        WHEN c.participant1_id = :userId THEN u2.fullName
        WHEN c.participant2_id = :userId THEN u1.fullName
      END AS other_participant_fullName,
      CASE 
        WHEN c.participant1_id = :userId THEN p2.avatarURL
        WHEN c.participant2_id = :userId THEN p1.avatarURL
      END AS other_participant_avatarURL,
      CASE 
        WHEN c.participant1_id = :userId THEN p2.first_name
        WHEN c.participant2_id = :userId THEN p1.first_name
      END AS other_participant_first_name,
      CASE 
        WHEN c.participant1_id = :userId THEN p2.last_name
        WHEN c.participant2_id = :userId THEN p1.last_name
      END AS other_participant_last_name,
      CASE 
        WHEN c.participant1_id = :userId THEN p2.headline
        WHEN c.participant2_id = :userId THEN p1.headline
      END AS other_participant_headline,
      CASE 
        WHEN c.participant1_id = :userId THEN r2.role_name
        WHEN c.participant2_id = :userId THEN r1.role_name
      END AS other_participant_roleName
    FROM 
      conversations AS c
    LEFT JOIN 
      users AS u1 ON c.participant1_id = u1.userId
    LEFT JOIN 
      profiles AS p1 ON u1.userId = p1.userId
    LEFT JOIN 
      roles AS r1 ON u1.role_id = r1.id
    LEFT JOIN 
      users AS u2 ON c.participant2_id = u2.userId
    LEFT JOIN 
      profiles AS p2 ON u2.userId = p2.userId
    LEFT JOIN 
      roles AS r2 ON u2.role_id = r2.id
    WHERE 
      c.conversation_id = :conversation_id
  `, {
    replacements: { conversation_id: conversation.conversation_id, userId: participant1_id },
    type: sequelize.QueryTypes.SELECT
  });

console.log("detailedConversation", detailedConversation, "detailedConversation")

          res.status(201).json(detailedConversation[0]);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },

      // not used
      getConversationsByUser: async (req, res) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'No token provided, authorization denied' });
        }
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          const userId = decoded.userId;
          const [conversations] = await sequelize.query(`
          SELECT 
        c.conversation_id, 
        c.participant1_id, 
        c.participant2_id, 
        u1.userId AS participant1_userId, 
        u1.fullName AS participant1_username, 
        p1.avatarURL AS participant1_profilePicture, 
        u2.userId AS participant2_userId, 
        u2.fullName AS participant2_username, 
        p2.avatarURL AS participant2_profilePicture,
        (
          SELECT COUNT(*)
          FROM messages AS m
          WHERE m.conversation_id = c.conversation_id
          AND m.receiver_id = :userId
          AND m.readAt IS NULL
        ) AS unreadMessagesCount
      FROM 
        conversations AS c
      LEFT JOIN 
        users AS u1 
      ON 
        c.participant1_id = u1.userId
      LEFT JOIN 
        profiles AS p1 
      ON 
        u1.userId = p1.userId
      LEFT JOIN 
        users AS u2 
      ON 
        c.participant2_id = u2.userId
      LEFT JOIN 
        profiles AS p2 
      ON 
        u2.userId = p2.userId
      WHERE 
        c.participant1_id = :userId 
      OR 
        c.participant2_id = :userId
        `, {
          replacements: { userId },
          type: sequelize.QueryTypes.SELECT
        });
    
        if (conversations?.length === 0) {
            return res.status(404).json({ message: 'No conversations found for this user.' });
          }
    
        

          res.json(conversations);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },



      getMessages: async (req, res) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'No token provided, authorization denied' });
        }
        try {
          const { conversation_id } = req.params;
          const messages = await sequelize.query(`
          SELECT 
            *
          FROM 
            messages 
          WHERE 
            conversation_id = :conversation_id
          ORDER BY 
            createdAt ASC
          `, {
            replacements: { conversation_id },
            type: sequelize.QueryTypes.SELECT
          });
          
          // console.log("🚀 ~ getMessages: ~ messages:", messages)
          res.json(messages);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    
      createMessage: async (req, res) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'No token provided, authorization denied' });
        }
        try {
          const { content, receiver_id, conversation_id } = req.body;
          const decoded = jwt.verify(token, JWT_SECRET);
          const sender_id = decoded.userId;
      
          const [result] = await sequelize.query(`
            INSERT INTO messages (content, sender_id, receiver_id, conversation_id, createdAt, updatedAt)
            VALUES (:content, :sender_id, :receiver_id, :conversation_id, NOW(), NOW())
          `, {
            replacements: { content, sender_id, receiver_id, conversation_id },
            type: sequelize.QueryTypes.INSERT
          });
      
          const message_id = result; // This gets the ID of the inserted message
      
          const [messageDetails] = await sequelize.query(`
            SELECT * FROM messages WHERE message_id = :message_id
          `, {
            replacements: { message_id },
            type: sequelize.QueryTypes.SELECT
          });
          console.log(messageDetails)
      
          res.status(201).json([messageDetails]);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    
      deleteConversation: async (req, res) => {
        const { conversation_id } = req.params;
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

            if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
            }

            try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const userId = decoded.userId;

            await sequelize.query(`
                DELETE FROM conversations 
                WHERE conversation_id = :conversation_id AND (participant1_id = :userId OR participant2_id = :userId)
            `, {
                replacements: { conversation_id, userId },
                type: sequelize.QueryTypes.DELETE
            });

            return res.json({ message: 'Conversation deleted successfully' });
            } catch (error) {
            console.error('Error:', error);
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({ message: 'Invalid token' });
            }
            res.status(500).json({ error: error.message });
            }
      },
      deleteMessage: async (req, res) => {
        const { message_id } = req.params;
        try {
          await sequelize.query(`
            DELETE FROM messages 
            WHERE message_id = :message_id
          `, {
            replacements: { message_id },
            type: sequelize.QueryTypes.DELETE
          });
          res.json({ message: 'Message deleted successfully' });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },


  getMessagesByUser: async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({message: 'No token provided, authorization denied'});
    }
    const { conversation_id } = req.params;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
      console.log("🚀 ~ getMessagesByUser: ~ userId:", userId)
      const messages = await sequelize.query(
        `SELECT 
          m.message_id,
          m.content,
          m.createdAt,
          m.readAt,
          sender.userId AS sender_id,
          sender.username AS sender_username,
          receiver.userId AS receiver_id,
          receiver.username AS receiver_username
        FROM messages m
        INNER JOIN users sender ON m.sender_id = sender.userId
        INNER JOIN users receiver ON m.receiver_id = receiver.userId
        WHERE m.conversation_id = :conversationId
        ORDER BY m.createdAt ASC`,
        {
          replacements: { conversationId },
          type: sequelize.QueryTypes.SELECT
        }
      );
      res.json(messages);
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  },

  getUnreadMessages: async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({message: 'No token provided, authorization denied'});
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
      const messages = await Message.findAll({
        where: {
          receiver_id: userId,
          readAt: null
        },
        include: [
          {model: User, as: 'sender', attributes: ['userId', 'username', 'profilePicture']}
        ]
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  },

  markMessageAsRead: async (req, res) => {
    const token = req.body.headers.Authorization && req.body.headers.Authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({message: 'No token provided, authorization denied'});
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
      const {conversation_id} = req.params;
    
      const message=  await sequelize.query(`
      UPDATE messages
      SET readAt = NOW()
      WHERE conversation_id = :conversation_id
      AND receiver_id = :user_id
      AND readAt IS NULL
    `, {
      replacements: { conversation_id, user_id: userId },
      type: sequelize.QueryTypes.UPDATE
    });
    console.log("🚀 ~ markMessageAsRead: ~ message:", message)


    res.json({ message: 'Messages marked as read' });
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  },

  markAllMessagesAsRead: async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({message: 'No token provided, authorization denied'});
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
      await Message.update({readAt: new Date()}, {where: {receiver_id: userId}});
      res.json({message: 'All messages marked as read'});
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  },

  getUnreadMessageCount: async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({message: 'No token provided, authorization denied'});
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
      const count = await Message.count({
        where: {
          receiver_id: userId,
          readAt: null
        }
      });
      res.json({count});
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  }
};
