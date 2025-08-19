
// Media Model
class MediaModel {
    constructor(postId, mediaId, mediaUrl) {
        this.postId = postId;
        this.mediaId = mediaId;
        this.mediaUrl = mediaUrl;
    }

    // Static methods to interact with the database

    static async getByPostId(postId) {
        const [rows] = await db.query('SELECT * FROM Media WHERE postId = ?', [postId]);
        return rows;
    }

    static async create(media) {
        const { postId, mediaId, mediaUrl } = media;
        await db.query('INSERT INTO Media VALUES (?, ?, ?)', [postId, mediaId, mediaUrl]);
    }
}

module.exports =  MediaModel
