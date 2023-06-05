import { EmbedBuilder } from "discord.js";

function errorEmbed(description: string | null = null, statusCode: number | null = null): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle("There's been an error!")
        .setDescription(`${description ?? ''}\nStatus Code: ${statusCode ?? 'Unknown'}`)
        .setColor('#FF0000') // Red
}

function infoEmbed(title: string, description: null | string = null, footer: null | string = null): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(title)
        .setColor('#8F00FF') // Purple
        .setDescription(description)
        .setFooter(footer ? { text: footer } : null)
}

export {
    errorEmbed,
    infoEmbed,
}