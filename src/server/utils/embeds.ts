import { EmbedBuilder, Guild } from "discord.js";

function errorEmbed(description: string | null = null, statusCode: number | null = null): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle("There's been an error!")
        .setDescription(description)
        .setColor('#FF0000') // Red
        .setFooter({ text: `Status Code: ${statusCode ?? 'Unknown'}` })
}

function infoEmbed(title: string | null, description: null | string = null, footer: null | string = null): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(title)
        .setColor('#8F00FF') // Purple
        .setDescription(description)
        .setFooter(footer ? { text: footer } : null)
}

function guildEmbed(guild: Guild) {
    const joinedDate = new Date(guild.joinedTimestamp).toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    
    return new EmbedBuilder()
        .setTitle(guild.name)
        .setColor('#8F00FF') // Purple
        .setImage(guild.iconURL())
        .setFooter({ text: `Joined: ${joinedDate}` })
}

export {
    errorEmbed,
    infoEmbed,
    guildEmbed
}