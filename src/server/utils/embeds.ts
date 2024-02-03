import { EmbedBuilder, Guild } from 'discord.js';

class CustomEmbed extends EmbedBuilder {
    constructor() {
        super()

        this.setColor('#2d7dbc') // Bluey
    }
}

class ErrorEmbed extends CustomEmbed {
    constructor(description: string | null = null, statusCode: number | null = null) {
        super();

        this.setTitle("There's been an error!")
            .setDescription(description)
            .setColor('#FF0000') // Red
            .setFooter({ text: `Status Code: ${statusCode ?? 'Unknown'}` });
    }
}

class InfoEmbed extends CustomEmbed {
    constructor(title: string | null, description: null | string = null, footer: null | string = null) {
        super();

        this.setTitle(title)
            .setDescription(description)
            .setFooter(footer ? { text: footer } : null);
    }
}

class GuildEmbed extends CustomEmbed {
    constructor(guild: Guild) {
        super();

        const joinedDate = new Date(guild.joinedTimestamp).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        this.setTitle(guild.name)
            .setImage(guild.iconURL())
            .setFooter({ text: `Joined: ${joinedDate}` });
    }
}

export { ErrorEmbed, InfoEmbed, GuildEmbed };
