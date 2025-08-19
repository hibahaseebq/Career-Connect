
// Comments Model
class CommentModel {
    constructor(commentId, postId, userId, commentContent, timestamp) {
        this.commentId = commentId;
        this.postId = postId;
        this.userId = userId;
        this.commentContent = commentContent;
        this.timestamp = timestamp;
    }

    // Static methods to interact with the database

    static async create(comment) {
        const { commentId, postId, userId, commentContent, timestamp } = comment;
        await db.query('INSERT INTO Comments VALUES (?, ?, ?, ?, ?)', [commentId, postId, userId, commentContent, timestamp]);
    }

    static async getByPostId(postId) {
        const [rows] = await db.query('SELECT * FROM Comments WHERE postId = ?', [postId]);
        return rows;
    }
}
module.exports =  CommentModel