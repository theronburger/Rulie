export interface IMailAccount {
  id: string;
  email: string;
  username: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
  enabled: boolean;
}

export interface IMail {
  id: string;
  uid: number | string;
  handled: boolean;
  account: IMailAccount;
  data: {
    snippet: string;
    subject: string;
    from: string;
    to: string;
    date: string;
    body: string;
  };
}

export interface MailEngineOptions {
  // Add any additional options here
}
