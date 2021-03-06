import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";

export = {
  data: new SlashCommandBuilder()
    .setName("ngbbs")
    .setDescription("Get a random bbs post from a fellow NGer ๐"),
  async execute(interaction: CommandInteraction) {
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("ng-post-select")
        .setPlaceholder("Select a User")
        .addOptions([
          {
            label: "Chdonga ๐ฆถ",
            description: "Feet Scuker ๐พ",
            value: "Chdonga",
          },
          {
            label: "MemeFiend โฟ",
            description: "๐ฅฅ",
            value: "MemeFiend",
          },
          {
            label: "Omega ๐งบ",
            description: "What a little bitch ๐",
            value: "Alpha",
          },
          {
            label: "HeatherAran โผ",
            description: "๐",
            value: "HeatherAran",
          },
          {
            label: "Homicide ๐ช",
            description: "The living legend ๐",
            value: "Homicide",
          },
        ])
    );

    await interaction.reply({
      content: "Choose someone to fetch a post from...",
      components: [row],
    });
  },
};
