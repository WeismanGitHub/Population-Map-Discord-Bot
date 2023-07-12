require("dotenv").config();

interface Configuration {
    discordToken: string
    mainAccountID: string
    appPort: number
    limiterWindowMs: number
    botID: string
    botInvite: string
    buyMeACoffeeURL: string
    githubURL: string
    limiterMax: number
    limiterMessage: string
    limiterStandardHeaders: boolean
    limiterLegacyHeaders: boolean
    botSecret: string
    supportServerInvite: string
    redirectURI: string
    sessionSecret: string
    mode: 'prod' | 'dev'
    websiteURL: string
    supportServerID: string
    personalServerIDs: string[]
}

const config: Configuration = {
    // Discord
    discordToken: process.env.DISCORD_TOKEN!,
    botID: process.env.BOT_ID!,
    mainAccountID: process.env.MAIN_ACCOUNT_ID!,
    botInvite: process.env.BOT_INVITE!,
    botSecret: process.env.BOT_SECRET!,
    redirectURI: process.env.REDIRECT_URI!,
    supportServerInvite: process.env.SUPPORT_SERVER_INVITE!,

    // Rate Limiter
    limiterWindowMs: 2000,
    limiterMax: 30,
    limiterMessage: 'Rate Limit: 30 requests per two seconds.',
    limiterStandardHeaders: true,
    limiterLegacyHeaders: false,
    
    // Other
    buyMeACoffeeURL: process.env.BUY_ME_A_COFFEE_URL!,
    githubURL: 'https://github.com/WeismanGitHub/Population-Density-Map-Discord-Bot',
    appPort: 5001,
    sessionSecret: process.env.JWT_SECRET!,
    mode: process.env.MODE as 'prod' | 'dev',
    websiteURL: process.env.WEBSITE_URL!, // Example: http://localhost:5001
    supportServerID: process.env.SUPPORT_SERVER_ID!,
    personalServerIDs: [process.env.PERSONAL_SERVER_ID!, process.env.TEST_SERVER_ID!],
}

export default config