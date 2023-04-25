const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const htmlparser =  require('htmlparser2');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const SEEN_MESSAGES_PATH = path.join(process.cwd(), 'seen_messages.json');

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}


async function loadSeenMessages() {
  try {
    const content = await fs.readFile(SEEN_MESSAGES_PATH);
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}

async function saveSeenMessages(seenMessages) {
  // await fs.writeFile(SEEN_MESSAGES_PATH, JSON.stringify(seenMessages));
}

async function fetchUnseenMail(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  const query = 'is:unread';
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: query,
  });

  const messages = res.data.messages;
  if (!messages || messages.length === 0) {
    console.log('No unread messages found.');
    return;
  }

  const seenMessages = await loadSeenMessages();
  const newUnseenMessages = messages.filter(message => !seenMessages.includes(message.id));

  if (newUnseenMessages.length === 0) {
    console.log('No new unread messages found.');
    return;
  }

  console.log('New unread messages:');
  for (const message of newUnseenMessages) {
    const messageDetails = await gmail.users.messages.get({
      userId: 'me',
      id: message.id,
    });


    //Don't assume stuff exists! Pretty much everything is optional
    console.log('ID             :', message.id);
    console.log('Snippet        :',  messageDetails.data.snippet);
    console.log('Date           :', messageDetails.data.payload.headers.find(header => header.name === 'Date').value);
    console.log('From           :', messageDetails.data.payload.headers.find(header => header.name === 'From').value);
    console.log('To             :', messageDetails.data.payload.headers.find(header => header.name === 'To').value);
    console.log('Subject        :', messageDetails.data.payload.headers.find(header => header.name === 'Subject').value);
    // console.log('Raw Body Parts :', messageDetails.data.payload.parts);
    //The Body is harder to get
    let body = ''
    messageDetails.data.payload.parts.forEach(part => {
     // parts can come in different mimeTypes
     // we will ony use 'text/plain' for now
     if(part.mimeType === 'text/plain'){
      // decode the Base64 encoded body part
      body += Buffer.from(part.body.data, 'base64').toString();
     }
    })
    console.log('Body           :\n', body);

  }

  await saveSeenMessages([...seenMessages, ...newUnseenMessages.map(msg => msg.id)]);
}

authorize().then(fetchUnseenMail).catch(console.error);
