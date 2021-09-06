import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import fetch from "node-fetch";

import { DogAPIResponse } from "../models/dog-api";
export = {
  data: new SlashCommandBuilder()
    .setName("random-dog")
    .setDescription("Responds with a random dog pic 🐶!"),
  async execute(interaction: CommandInteraction) {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = (await response.json()) as DogAPIResponse;
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Woof")
      .setURL(data.message)
      .setImage(data.message)
      .setDescription("Here's a random Dog 👅");

    const msg = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    }) as Message;

    msg.react("🐶");
  },
};
