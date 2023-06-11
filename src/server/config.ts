import { InternalServerError } from "./errors";
require("dotenv").config();

interface Configuration {
    discordToken: string
    mainAccountID: string
    appPort: number
    limiterWindowMs: number
    botID: string
    inviteURL: string
    buyMeACoffeeURL: string
    githubURL: string
    limiterMax: number
    limiterMessage: string
    limiterStandardHeaders: boolean
    limiterLegacyHeaders: boolean
}

const config: Configuration = {
    // Discord
    discordToken: process.env.DISCORD_TOKEN!,
    botID: process.env.BOT_ID!,
    mainAccountID: process.env.MAIN_ACCOUNT_ID!,
    inviteURL: process.env.INVITE_URL!,

    // Rate Limiter
    limiterWindowMs: 2000,
    limiterMax: 30,
    limiterMessage: 'Rate Limit: 30 requests per two seconds.',
    limiterStandardHeaders: true,
    limiterLegacyHeaders: false,
    
    // Other
    buyMeACoffeeURL: process.env.BUY_ME_A_COFFEE_URL!,
    githubURL: process.env.GITHUB_URL!,
    appPort: 5001,
}

for (const entry of Object.entries(config)) {
    const [key, value] = entry

    if (Number.isNaN(value) || value === undefined) {
        throw new InternalServerError(`${key} is missing.`)
    }
}

export default config