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
    .setDescription("Get a random bbs post from a fellow NGer 🆖"),
  async execute(interaction: CommandInteraction) {
    const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('ng-post-select')
					.setPlaceholder('Select a User')
					.addOptions([
						{
							label: 'Chdonga 🦶',
							description: 'Feet Scuker 🐾',
							value: 'Chdonga',
						},
						{
              label: 'MemeFiend ♿',
							description: '🥥',
							value: 'MemeFiend',
						},
						{
              label: 'MykeiXWolfe 🐺',
							description: 'Who?',
							value: 'MykeiXWolfe',
						},
            {
              label: 'HeatherAran ‼',
              description: '🐟',
              value: 'HeatherAran',
            },
            {
              label: 'Homicide 🔪',
              description: 'The living legend 🌆',
              value: 'Homicide',
            },
					]),
			);

		await interaction.reply({ content: 'Choose someone to fetch a post from...', components: [row] });
  },
};
