import { Client, Collection, ClientOptions, ActivityType, Presence, Events } from 'discord.js';
import { errorEmbed } from './utils/embeds';
import { readdirSync, statSync } from 'fs';
import { CustomError } from './errors';
import config from './config';
import { join } from 'path';

function getPaths(dir: string): string[] {
    const paths = readdirSync(dir);
    const filePaths: string[] = [];

    function recursiveLoop(paths: string[]) {
        for (let path of paths) {
            const fileStat = statSync(path);

            if (fileStat.isFile()) {
                filePaths.push(path);
            } else if (fileStat.isDirectory()) {
                recursiveLoop(readdirSync(path).map((subPath) => join(path, subPath)));
            }
        }
    }

    recursiveLoop(paths.map((path) => join(dir, path)));

    return filePaths;
}

export class CustomClient extends Client {
    private readonly commands: Collection<unknown, any>;
    public readonly token: string;

    constructor(clientOptions: ClientOptions) {
        super(clientOptions);

        this.token = config.discordToken;
        this.commands = new Collection();

        this.login(this.token).then(async () => {
            this.loadEventListeners();
            this.loadCommands();
        });
    }

    private async loadCommands() {
        const commandsPaths: string[] = getPaths(join(__dirname, 'commands')).filter((file) =>
            file.endsWith('.js')
        );
        const commands = [];

        for (const path of commandsPaths) {
            const command = require(path)?.default;

            if (!command?.data || !command?.execute) {
                console.log(`malformed command file: ${path}`);
                continue;
            }

            commands.push(command.data.toJSON());
            this.commands.set(command.data.name, command);
        }

        console.log(`loaded ${commands.length} commands...`);

        this.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isCommand()) return;

            const command = this.commands.get(interaction.commandName);

            command.execute(interaction).catch((err: Error) => {
                if (!(err instanceof CustomError)) console.log(err);

                const embed =
                    err instanceof CustomError ? errorEmbed(err.message, err.statusCode) : errorEmbed();

                if (interaction.replied || interaction.deferred) {
                    interaction.followUp({ embeds: [embed], ephemeral: true });
                } else {
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }
            });
        });
    }

    private async loadEventListeners() {
        const eventsPaths = getPaths(join(__dirname, 'events')).filter((file) => file.endsWith('.js'));

        for (const path of eventsPaths) {
            const event = require(path)?.default;

            if (!event?.name || !event.execute || typeof event?.once !== 'boolean' || !event.check) {
                console.log(`malformed event file: ${path}`);
                continue;
            }

            // Check is run first, then if res is not undefined, you log and execute.
            // Check is supposed to verify that this is the correct file.
            this.on(event.name, (...args) => {
                event.check(...args).then((res: any) => {
                    if (!res) return;

                    event.execute(res).catch((err: Error) => {
                        if (event.name !== Events.InteractionCreate) return;

                        const embed =
                            err instanceof CustomError
                                ? errorEmbed(err.message, err.statusCode)
                                : errorEmbed();
                        const interaction = args[0];

                        if (interaction.replied || interaction.deferred) {
                            interaction.followUp({ embeds: [embed], ephemeral: true });
                        } else {
                            interaction.reply({ embeds: [embed], ephemeral: true });
                        }
                    });
                });
            });
        }

        console.log(`loaded ${eventsPaths.length} event listeners...`);
    }

    public setPresence(
        type: Exclude<ActivityType, ActivityType.Custom>,
        name: string,
        url?: string
    ): Presence | undefined {
        return this.user?.setPresence({
            activities: [
                {
                    type,
                    name,
                    url,
                },
            ],
        });
    }
}
