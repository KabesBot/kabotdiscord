const Discord = require('discord.js')
const Command = require('./command')

module.exports = class Sondage extends Command {
    static match(message) {
        if(message.content.startsWith('K!sondage')) {
            return true
        }
    }
    static action (message) {
        let msg = message.content.split(' ')
        msg.shift()
        let question = msg.join(' ')

        if (message.content === 'K!sondage') {
            message.reply('Précise ton sondage après la commande.')
        }
        else {
        var sondage = new Discord.RichEmbed()
            .setTitle('SONDAGE')
            .addField(question, '✅ pour oui | ❌ pour non')
            .setColor('0xB20000')

        message.channel.send(sondage)
        .then(function(message) {
            message.react('✅')
            message.react('❌')
        })
        message.delete()
    }
    }
}