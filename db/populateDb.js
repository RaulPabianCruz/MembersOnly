require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const SQL = `
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    firstName VARCHAR(15),
    lastName VARCHAR(20),
    username VARCHAR(15),
    password VARCHAR(60),
    member BOOLEAN,
    admin BOOLEAN
    );

    CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(20),
    text VARCHAR(250),
    timestamp TIMESTAMP,
    authorId INTEGER REFERENCES users (id)
    );
`;

const user1 = {
    firstName: 'John',
    lastName: 'Messager',
    username: 'JohnMessager',
    password: 'Messager4',
    member: true,
    admin: true
};
const user2 = {
    firstName: 'Lily',
    lastName: 'Lilington',
    username: 'LilyPop',
    password: 'Yummy7',
    member: true,
    admin: false
};
const user3 = {
    firstName: 'Ricky',
    lastName: 'Smith',
    username: 'LordDegenerate',
    password: 'Trustno1',
    member: false,
    admin: false
};
const user4 = {
    firstName: 'Reno',
    lastName: 'Cruz',
    username: 'Riggity',
    password: 'Buttah98',
    member: true,
    admin: true
};

const titles = [
    "Ignore Prev Mssg",
    "What's up, I'm new",
    "Member Secret?",
    "Don't Leak Secret",
    "Transformers One",
    "Feeling Down",
    "Is Terry Top Tier?",
    "Can't see users",
    "Geeking out"
];

const texts = [
    "Disregard That Last Message, My Little Brother Got Ahold Of My Phone.",
    "Hey guys, just joined this board. What are the vibes like?, I see this secret thing what's that about?",
    "Idgi are we just supposed to be in the know to be a member? I think it should be a paid membership instead.",
    "Don't Leak The Secret Passwords To Anyone Or Your Membership Will Be Revoked.",
    "Going to see Transformers One later, will keep yall posted on my recommendation.",
    "We were soup together, but now its cold.... We were glue together, but it weren't to hold...",
    "Just trying out Terry and so far I don't know what to think about his standing in the tiers.",
    "I can't see the user behind the post, is this a bug?",
    "Just got a Geek Bar and let me tell ya, I am tweaking out like sheesh."
];

async function insertUser(client, user) {
    let hashedPassword = await bcrypt.hash(user.password, 10).catch((err) => {console.error(err)});

    await client.query(`INSERT INTO users (firstName, lastName, username, password, member, admin)
        VALUES ($1, $2, $3, $4, $5, $6);`, [
        user.firstName, 
        user.lastName,
        user.username,
        hashedPassword,
        user.member,
        user.admin
    ]);
}

async function insertMessage(client, username, title, text) {
    const { rows } = await client.query('SELECT id FROM users WHERE username = $1', [username]);
    await client.query(`INSERT INTO messages (title, text, timestamp, authorId)
        VALUES ($1, $2, 'now', $3);`, 
        [title, text, rows[0].id]
    );
}

async function main() {
    console.log('Seeding.......');
    let connectionString;
    if(process.env.ENV === 'PROD')
        connectionString = process.env.DATABASE_URL;
    else
        connectionString = process.env.CONNECTION_STRING;

    const client = new Client({connectionString: connectionString});
    try{
        await client.connect();
        await client.query(SQL);

        await insertUser(client, user1);
        await insertUser(client, user2);
        await insertUser(client, user3);
        await insertUser(client, user4);
        await insertMessage(client, 'Riggity', titles[8], texts[8]);
        await insertMessage(client, 'LordDegenerate', titles[7], texts[7]);
        await insertMessage(client, 'LilyPop', titles[6], texts[6]);
        await insertMessage(client, 'Riggity', titles[5], texts[5]);
        await insertMessage(client, 'LilyPop', titles[4], texts[4]);
        await insertMessage(client, 'JohnMessager', titles[3], texts[3]);
        await insertMessage(client, 'LordDegenerate', titles[2], texts[2]);
        await insertMessage(client, 'JohnMessager', titles[1], texts[1]);
        await insertMessage(client, 'JohnMessager', titles[0], texts[0]);
    } catch(err) {
        console.error(err);
    } finally {
        await client.end();
        console.log('Done.');
    }
}

main();