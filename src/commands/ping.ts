import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction: CommandInteraction) {
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Yes')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('nodary')
					.setLabel('No')
					.setStyle('DANGER'),
			);

      const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Answer Now')
			.setURL('https://www.youtube.com/watch?v=sy_yQHN2K6g')
			.setDescription('Here\'s a random dog 👅');

		await interaction.reply({  embeds: [embed], components: [row] });
  },
};
