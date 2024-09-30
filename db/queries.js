const pool = require('./pool');

async function getUserByUsername(username) {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0];
}

async function getUserById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
}

async function insertUser(firstName, lastName, username, password) {
    await pool.query('INSERT INTO users (firstname, lastname, username, password, member, admin) VALUES ($1, $2, $3, $4, false, false);', [ firstName, lastName, username, password ]);
}

async function grantMemberStatus(id) {
    await pool.query('UPDATE users SET member = true WHERE id = $1', [id]);
}

async function grantAdminStatus(id) {
    await pool.query('UPDATE users SET member = true, admin = true WHERE id = $1', [id])
}

async function insertUserMessage(authorId, title, text) {
    await pool.query("INSERT INTO messages (authorId, title, text, timestamp) VALUES ($1, $2, $3, 'now')", [authorId, title, text]);
}

async function deleteMessage(mssgId) {
    await pool.query('DELETE FROM messages WHERE id = $1', [mssgId]);
}

async function getAllMessages() {
    const { rows } = await pool.query(`SELECT title, text, timestamp, username, messages.id AS mssgId 
                                        FROM messages INNER JOIN users 
                                        ON messages.authorId = users.id;`);
    return rows;
}

module.exports = { 
    getUserByUsername, 
    getUserById, 
    insertUser, 
    grantMemberStatus, 
    grantAdminStatus, 
    insertUserMessage, 
    deleteMessage,
    getAllMessages 
};