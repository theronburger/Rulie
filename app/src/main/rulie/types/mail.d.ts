export interface ICredentials {
  installed: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

export interface IToken {
  type: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
}

export interface IMailAccount {
  id: string;
  type: 'imap' | 'gmail';
  token?: IToken;
  email?: string;
  username?: string;
  password?: string;
  host?: string;
  port?: number;
  tls?: boolean;
  enabled: boolean;
}

export interface IMail {
  // id: string;
  // uid: number | string;
  // handled: boolean;
  // accountId: string;
  // data: {
  //   snippet: string;
  //   subject: string;
  //   from: string;
  //   to: string;
  //   date: string;
  //   body: string;
  // };
  id: string;
  handled: boolean;
  date: number;
  snippet: string | null | undefined;
  from: string | null | undefined;
  to: string | null | undefined;
  subject: string | null | undefined;
  body: string | null | undefined;
}

export interface IMailStore {
  [accountId: string]: IMail[];
}

export interface MailEngineOptions {
  // Add any additional options here
}
