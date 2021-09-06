import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message } from "discord.js";

export = {
  data: new SlashCommandBuilder()
    .setName("dogs")
    .setDescription("Replies with Dog emoji reactions!"),
  async execute(interaction: CommandInteraction) {
    let dogs = ["🐶", "🐕", "🐩", "🐕‍🦺", "🐺"];
    const msg = (await interaction.reply({
      content: "Dogs 👀",
      fetchReply: true,
    })) as Message;

    for (let i = 0; i < 3; i++) {
      msg.react(dogs.splice(Math.floor(Math.random() * dogs.length), 1)[0]);
    }
  },
};
