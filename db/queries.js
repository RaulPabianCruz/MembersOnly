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

async function updateMemberStatus(id, value) {
    await pool.query('UPDATE users SET member = $1 WHERE id = $2', [value, id]);
}

module.exports = { getUserByUsername, getUserById, insertUser, updateMemberStatus };