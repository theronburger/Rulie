import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const SEEN_MESSAGES_PATH = path.join(process.cwd(), 'seen_messages.json');

async function loadSavedCredentialsIfExist(): Promise<google.auth.OAuth2Credentials> {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client: google.auth.OAuth2Credentials) {
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

async function saveSeenMessages(seenMessages: string[]) {
  await fs.writeFile(SEEN_MESSAGES_PATH, JSON.stringify(seenMessages));
}

async function fetchUnseenMail(auth: google.auth.OAuth2Credentials) {
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

    const subject = messageDetails.data.payload.headers.find(header => header.name === 'Subject');
    console.log(`- ${subject ? subject.value : 'No Subject'}`);
  }

  await saveSeenMessages([...seenMessages, ...newUnseenMessages.map(msg => msg.id)]);
}

(async () => {
  const auth = await authorize();
  await fetchUnseenMail(auth);
})();
