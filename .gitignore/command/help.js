const Discord = require('discord.js')
const Command = require('./command')

module.exports = class Help extends Command {
    static match (message) {
        if (message.content === ('K!help')) {
            return true
        }
    }
    static action(message) {
            let help = new Discord.RichEmbed()
             .setTitle('HELP')
             .setDescription('Liste des commandes')
             .addBlankField()
             .addField('K!xp', 'Montre notre xp.')
             .addField('K!unwarn', `UnWarn l'utilisateur mentionné.`)
             .addField('K!unmute', `UnMute l'utilisateur mentionné.`)
             .addField('K!8ball', 'Pose ta question.')
             .addField('K!warn', `Warn l'utilisateur mentionné.`)
             .addField('K!infractions', `Montre les warns de l'utilisateur mentionné.`)
             .addField('K!ban', `Ban l'utilisateur mentionné.`)
             .addField('K!kick', `Kick l'utilisateur mentionné.`)
             .addField('K!mute', `Mute l'utilisateur mentionné.`)
             .addField('K!clear', 'Clear le nombre de message spécifié.')
             .addField('K!sondage', 'Crée un sondage.')
             .addField('K!role', 'Ajoute ou supprime un role.')
             .setColor('0x206694')
             .setAuthor('!𝑲𝒂𝒃𝒆𝒔 | 𝟐𝟏𝟐𝑹𝒐𝒄𝒎𝒂')
             .setFooter('Fin.')

        message.channel.send(help)
    }
}