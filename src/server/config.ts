require('dotenv').config();

interface Configuration {
    discordToken: string;
    mainAccountID: string;
    appPort: number;
    limiterWindowMs: number;
    botID: string;
    botInvite: string;
    githubURL: string;
    limiterMax: number;
    limiterMessage: string;
    limiterStandardHeaders: boolean;
    limiterLegacyHeaders: boolean;
    botSecret: string;
    serverInvite: string;
    redirectURI: string;
    sessionSecret: string;
    mode: 'prod' | 'dev';
    websiteURL: string;
    supportServerID: string;
    personalServerIDs: string[];

    pgHost: string;
    pgPort: number;
    pgUsername: string;
    pgPassword: string;
    pgDatabase: string;
}

const config: Configuration = {
    // Discord
    discordToken: process.env.DISCORD_TOKEN!,
    botID: process.env.BOT_ID!,
    mainAccountID: process.env.MAIN_ACCOUNT_ID!,
    botInvite: process.env.VITE_BOT_INVITE!,
    botSecret: process.env.BOT_SECRET!,
    redirectURI: process.env.REDIRECT_URI!,
    serverInvite: process.env.VITE_SUPPORT_SERVER_INVITE!,

    // Rate Limiter
    limiterWindowMs: 2000,
    limiterMax: 30,
    limiterMessage: 'Rate Limit: 30 requests per two seconds.',
    limiterStandardHeaders: true,
    limiterLegacyHeaders: false,

    // Other
    githubURL: 'https://github.com/WeismanGitHub/Population-Density-Map-Discord-Bot',
    appPort: 5001,
    sessionSecret: process.env.SESSION_SECRET!,
    mode: process.env.MODE as 'prod' | 'dev',
    websiteURL: process.env.WEBSITE_URL!, // Example: http://localhost:5001
    supportServerID: process.env.SUPPORT_SERVER_ID!,
    personalServerIDs: [process.env.PERSONAL_SERVER_ID!, process.env.TEST_SERVER_ID!],

    // Postgres
    pgHost: process.env.PG_HOST!,
    pgPort: Number(process.env.PG_PORT!),
    pgUsername: process.env.PG_USERNAME!,
    pgPassword: process.env.PG_PASSWORD!,
    pgDatabase: process.env.PG_DATABASE!,
};

export default config;
