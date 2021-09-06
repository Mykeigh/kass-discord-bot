import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("server")
    .setDescription("Replies with server info!"),
  new SlashCommandBuilder()
    .setName("user")
    .setDescription("Replies with user info!"),
  new SlashCommandBuilder()
    .setName("dogs")
    .setDescription("Replies with Dog emoji reactions!"),
  new SlashCommandBuilder()
    .setName("random-dog")
    .setDescription("Responds with a random dog pic 🐶!"),
  new SlashCommandBuilder()
    .setName("donate")
    .setDescription("Make a donation!"),
  new SlashCommandBuilder()
    .setName("random-ngbbs-from")
    .setDescription("Get a random bbs post from a fellow NGer 🆖")
    .addStringOption((option) =>
      option
        .setRequired(true)
        .setName("nger-user")
        .setDescription("Provide a valid NGer username to fetch posts for.")
    ),
  new SlashCommandBuilder()
    .setName("ngbbs")
    .setDescription("Get a random bbs post from a fellow NGer 🆖"),
].map((command) => command.toJSON());

(async () => {
  (await import("dotenv")).config();
  const applicationId = "883155165060948048";
  const guildID = "280587460159733760";
  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN!);

  try {
    await rest.put(Routes.applicationGuildCommands(applicationId, guildID), {
      body: commands,
    });

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
})();
