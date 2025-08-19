
// Posts Model
class PostModel {
    constructor(postId, userId, content, timestamp) {
        this.postId = postId;
        this.userId = userId;
        this.content = content;
        this.timestamp = timestamp;
    }

    // Static methods to interact with the database

    static async getById(postId) {
        const [rows] = await db.query('SELECT * FROM Posts WHERE postId = ?', [postId]);
        return rows[0];
    }

    static async create(post) {
        const { postId, userId, content, timestamp } = post;
        await db.query('INSERT INTO Posts VALUES (?, ?, ?, ?)', [postId, userId, content, timestamp]);
    }
}

module.exports =  PostModel
