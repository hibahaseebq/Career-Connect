
// Shares Model
class ShareModel {
    constructor(postId, userId) {
        this.postId = postId;
        this.userId = userId;
    }

    // Static methods to interact with the database

    static async create(share) {
        const { postId, userId } = share;
        await db.query('INSERT INTO Shares VALUES (?, ?)', [postId, userId]);
    }

    static async remove(postId, userId) {
        await db.query('DELETE FROM Shares WHERE postId = ? AND userId = ?', [postId, userId]);
    }

    static async getByPostId(postId) {
        const [rows] = await db.query('SELECT * FROM Shares WHERE postId = ?', [postId]);
        return rows;
    }
}
module.exports =  ShareModel
