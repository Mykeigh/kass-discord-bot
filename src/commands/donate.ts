import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";

export = {
  data: new SlashCommandBuilder()
    .setName("donate")
    .setDescription("Make a donation!"),
  async execute(interaction: CommandInteraction) {
    const donationEmbed = new MessageEmbed()
      .setColor("#248a4f")
      .setTitle("Make a Donation!")
      .setURL("https://www.savethechildren.org/us/where-we-work/afghanistan")
      .setAuthor(
        "Me, Mykei",
        "https://media.discordapp.net/attachments/280587460159733760/874501495809245204/unknown.png",
        "http://www.oldskies.com/"
      )
      .setDescription(
        "Hosting a readily available bot isn't free.  Consider making a donation so that you, your friends and your family can enjoy your bot experience without incedent 🙂"
      )
      .setThumbnail(
        "https://www.thewrap.com/wp-content/uploads/2016/04/puss-in-boots-.jpg"
      )
      .setTimestamp()
      .setFooter(
        "Do it bitch",
        "https://www.thewrap.com/wp-content/uploads/2016/04/puss-in-boots-.jpg"
      );

    await interaction.reply({ embeds: [donationEmbed] });
  },
};
