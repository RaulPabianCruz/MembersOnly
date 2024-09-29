const pool = require('./pool');

async function getAllMessages() {
    
}

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

module.exports = { getUserByUsername, getUserById, insertUser, grantMemberStatus, grantAdminStatus };