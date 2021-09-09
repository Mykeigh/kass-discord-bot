// Require the necessary discord.js functions
import fs from "fs";
import {
  Client,
  Intents,
  Collection,
  Interaction,
  CommandInteraction,
  SelectMenuInteraction,
  MessageSelectMenuOptions,
  MessageSelectMenu,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

/** Currently using this to store all the interaction types I'm using at the time. */
type KnownInteractionTypes = CommandInteraction | SelectMenuInteraction;

interface InteractionExecutable<T extends KnownInteractionTypes> {
  execute: (interaction: T) => Promise<any>;
}

/** The object used to store SlashCommand configurations and the function to execute upon interaction */
export interface CommandInteractionService
  extends InteractionExecutable<CommandInteraction> {
  data: SlashCommandBuilder;
}

interface SelectMenuInteractionService
  extends InteractionExecutable<SelectMenuInteraction> {
  data: MessageSelectMenuOptions;
}

interface CustomClient extends Client {
  commands: Collection<string, InteractionExecutable<CommandInteraction>>;
  selectMenus: Collection<string, InteractionExecutable<SelectMenuInteraction>>;
}

(async () => {
  (await import("dotenv")).config();
  const token = process.env.TOKEN;
  // Create a new client instance
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  }) as CustomClient;

  // When the client is ready, run this code (only once)
  client.once("ready", () => {
    console.log("Ready!");
  });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isSelectMenu()) {
    }

    // if (!interaction.isCommand() && !interaction.isSelectMenu()) return;

    // console.log(client.commands);
    // console.log(command);

    if (interaction.isCommand()) {
      console.log("A command was initiated");
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (e) {
        console.error(e);
        await interaction.reply({
          content:
            "Error processing command.  Whoops aha, maybe you just suck 😂",
        });
      }

      return;
    }

    if (interaction.isSelectMenu()) {
      const selectInteraction = client.selectMenus.get(interaction.customId);

      if (!selectInteraction) return;

      try {
        await selectInteraction.execute(interaction);
      } catch (e) {
        await interaction.reply({ content: "Error! 🔥" });
      }

      return;
    }

    return;
  });

  client.commands = new Collection();
  client.selectMenus = new Collection();

  const commandFiles = fs
    .readdirSync("./src/commands")
    .filter((file) => file.endsWith(".ts"));

  const selectInteractionFiles = fs
    .readdirSync("./src/select-interactions")
    .filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    // console.log(file);
    const command = (await import(
      `./commands/${file}`
    )) as CommandInteractionService;

    // console.log(command);

    client.commands.set(command.data.name, command);
  }

  for (const file of selectInteractionFiles) {
    const selectInteraction = (await import(
      `./select-interactions/${file}`
    )) as SelectMenuInteractionService;
    if (!selectInteraction.data.customId)
      throw new Error(
        "A select interaction file was found, but it's customId was not set."
      );
    console.log(selectInteraction);

    client.selectMenus.set(selectInteraction.data.customId, selectInteraction);
  }

  // Login to Discord with your client's token
  client.login(token).catch((e) => console.log(e));
})();
