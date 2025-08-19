// Likes Model
class LikeModel {
    constructor(postId, userId) {
        this.postId = postId;
        this.userId = userId;
    }

    // Static methods to interact with the database

    static async create(like) {
        const { postId, userId } = like;
        await db.query('INSERT INTO Likes VALUES (?, ?)', [postId, userId]);
    }

    static async remove(postId, userId) {
        await db.query('DELETE FROM Likes WHERE postId = ? AND userId = ?', [postId, userId]);
    }

    static async getByPostId(postId) {
        const [rows] = await db.query('SELECT * FROM Likes WHERE postId = ?', [postId]);
        return rows;
    }
}
module.exports =  LikeModel
