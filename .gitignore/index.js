const Discord = require('discord.js');
const bot = new Discord.Client();
const YoutubeStream = require ('youtube-audio-stream');
const date = new Date();
const hour = date.getHours();
const Command = require('./command/command');
const Clear = require('./command/clear');
const Help = require('./command/help');
const Sondage = require('./command/sondage');
var prefix = "k!";
var Attente = [];
const fs = require('fs');
const warns = JSON.parse(fs.readFileSync('./warns.json'));
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapters = new FileSync('database.json');
const db = low(adapters);





 //xp
 db.defaults({ histoires : [], xp: []}).write()

 bot.on('message', message => {
    
   var msgauthor = message.author.id
 
   if(message.author.bot)return;
 
   if(!db.get("xp").find({user : msgauthor}).value()){
       db.get("xp").push({user : msgauthor, xp: 1}).write();
   }else{
       var userxpdb = db.get("xp").filter({user : msgauthor}).find("xp").value();
       console.log(userxpdb)
       var userxp = Object.values(userxpdb)
       console.log(userxp)
       console.log(`Nombre d'xp: ${userxp[1]}`)
 
       db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1}).write();
 
       if(message.content === "K!xp"){
           var xp = db.get("xp").filter({user: msgauthor}).find('xp').value()
           var xpfinal = Object.values(xp);
           var xp_embed = new Discord.RichEmbed()
               .setTitle(`Stat des XP de : ${message.author.username}`)
               .setColor('#F4D03F')
               .addField("XP", `${xpfinal[1]} xp`)
               .setFooter("Enjoy :p")
           message.channel.send({embed : xp_embed})
       }
   }
 })
 //fin xp


//bye
bot.on('guildMemberRemove', function (member) {
  let embed = new Discord.RichEmbed()
      .setDescription(':cry: **' + member.user.username + '** a quitté ' + member.guild.name)
      .setFooter('Nous sommes désormais ' + member.guild.memberCount)
  member.guild.channels.get('608615465576693762').send(embed)
})


bot.on("message", function (message) {
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g)

  //unmute
  if (args[0].toLowerCase() === "k!unmute") {
      if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
      let member = message.mentions.members.first()
      if(!member) return message.channel.send("Membre introuvable.")
      if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unmute ce membre.")
      if(!member.manageable) return message.channel.send("Je ne pas unmute ce membre.")
      let muterole = message.guild.roles.find(role => role.name === 'Mute')
      if(muterole && member.roles.has(muterole.id)) {
        member.removeRole(muterole)
      message.channel.send(member + ' a été unmute :white_check_mark:.')
      } else {
        message.channel.send("Ce membre n'est pas mute.")
      }
  }

  //unwarn
  if (args[0].toLowerCase() === "k!unwarn") {
      let member = message.mentions.members.first()
      if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
      if(!member) return message.channel.send("Membre introuvable.")
      if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unwarn ce membre.")
      if(!member.manageable) return message.channel.send("Je ne pas unwarn ce membre.")
      if(!warns[member.id] || !warns[member.id].length) return message.channel.send("Ce membre n'a actuellement aucun warns.")
      warns[member.id].shift()
      fs.writeFileSync('./warns.json', JSON.stringify(warns))
      message.channel.send("Le dernier warn de " + member + " a été retiré :white_check_mark:.")
  }
})

//8ball
bot.on('message', function (message) {
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g)

  if (args[0].toLowerCase() === "k!8ball") {
      if (!args[1]) return message.channel.send("Veuillez **poser une question** :x:")
      let answers = ["Non :x:", "J'ai envie de dormir :zzz:", "Balec :face_palm:", "Peut être... :thinking:", "Absolument :white_check_mark:"]
      let question = args.slice(1).join(" ")
      let embed = new Discord.RichEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .setColor("ORANGE")
      .addField("Question :", question)
      .addField("Réponse :", answers[Math.floor(Math.random() * answers.length)])
  message.channel.send(embed)
}
})


//warn
bot.on("message", function (message) {
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g)

  if (args[0].toLowerCase() === "k!warn") {
      if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
      let member = message.mentions.members.first()
      if (!member) return message.channel.send("Veuillez mentionner un membre")
      if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas warn ce membre.")
      let reason = args.slice(2).join(' ')
      if (!reason) return message.channel.send("Veuillez indiquer une raison")
      if (!warns[member.id]) {
          warns[member.id] = []
      }
      warns[member.id].unshift({
          reason: reason,
          date: Date.now(),
          mod: message.author.id
      })
      fs.writeFileSync('./warns.json', JSON.stringify(warns))
      message.channel.send(member + " a été warn pour " + reason + " :white_check_mark:")
  }
//infractions
  if (args[0].toLowerCase() === "k!infractions") {
      if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
      let member = message.mentions.members.first()
      if (!member) return message.channel.send("Veuillez mentionner un membre")

      let embed = new Discord.RichEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .addField('10 derniers warns', ((warns[member.id] && warns[member.id].length) ? warns[member.id].slice(0, 10).map(e => e.reason) : "Ce membre n'a aucun warns"))
            .setTimestamp()
        message.channel.send(embed)
  }
})


//mute
bot.on("message", message => {
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g);

  if (args[0].toLowerCase() === "k!mute") {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
    let member = message.mentions.members.first()
    if (!member) return message.channel.send("Membre introuvable.")
    if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guilf.ownerID) return message.channel.send("Vous ne pouvez pas mute ce membre")
    if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne peux pas mute ce membre.")
    let muterole = message.guild.roles.find(role => role.name === 'Mute')
    if (muterole) {
      member.addRole(muterole)
      message.channel.send(member + ' a été mute avec succès :white_check_mark:.')
    }
    else {
      message.guild.createRole({name: 'Mute', permissions: 0}).then((role) => {
        message.guild.channels.filter(channel => channel.type === 'text').forEach(channel => {
          channel.overwritePermissions(role, {
            SEND_MESSAGES: false
          })
        })
        member.addRole(role)
      message.channel.send(member + ' a été mute avec succès :white_check_mark:.')
      })
    }
  }
})



//stats
bot.on('message', message => {
  if (message.member.content === "K!stats") {
const membre = message.mentions.members.first() || message.member;
    return message.channel.send('Veuillez mentionner un utilisateur !'); }
    if (message.content.startsWith('K!stats')) {
    message.channel.send({
        embed: {
            color: 0xe43333,
            title: `Statistiques du l'utilisateur **${membre.user.username}**`,
            thumbnail: {
                url: membre.user.displayAvatarURL
            },
            fields: [
                {
                    name: 'ID :',
                    value: membre.id 
                },
                {
                    name: 'Jeu :',
                    value: membre.user.presence.game ? membre.user.presence.game.name : 'Aucun jeu'
                },
            ],
            footer: {
                text: `Informations de l'utilisateur ${membre.user.username}`
            }
        }
    })
    }
});



//kick
bot.on('message', function (message) {
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g)
 
  if (args[0].toLowerCase() === 'k!kick') {
     if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
     let member = message.mentions.members.first()
     if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
     if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas kick cet utilisateur :x:")
     if (!member.kickable) return message.channel.send("Je ne peux pas exclure cet utilisateur :sunglass:")
     member.kick()
     message.channel.send('**' + member.user.username + '** a été exclu :white_check_mark:')
  }
})

//ban
bot.on('message', function (message) {
  if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLowerCase() === 'k!ban') {
       if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
       let member = message.mentions.members.first()
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas bannir cet utilisateur :x:")
       if (!member.bannable) return message.channel.send("Je ne peux pas bannir cet utilisateur :sunglass:")
       message.guild.ban(member, {days: 7})
       message.channel.send('**' + member.user.username + '** a été banni :white_check_mark:')
    }
})
//bienvenue
bot.on('guildMemberAdd', function (member) {
  let embed = new Discord.RichEmbed()
      .setDescription(':tada: **' + member.user.username + '** a rejoint ' + member.guild.name)
      .setFooter('Nous sommes désormais ' + member.guild.memberCount)
  member.guild.channels.get('607156424858140672').send(embed)
  member.addRole('607648621084540933')
})

bot.on('ready', function() {
  bot.user.setPresence({game: { name: 'Commandes : K!help'}});
  console.log("Bot Connecté")
});
//role
bot.on('message', message => {
  if (!message.guild) return
  if (!message.member.hasPermission('MANAGE_ROLES')) return ("Vous n'avez pas la permission d'utiliser cette commande ;(")
  const args = message.content.split(' ');
  const channel = bot.channels.find(r => r.name === "logs");
  if (message.content === 'K!role') {
    message.channel.send("Précise le role a ajouter/supprimer.");
  } else {
    if (message.content.startsWith('K!role')) {
      const role = message.guild.roles.find(r => r.name === args[1]);
      let member = message.mentions.members.first()
      if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
     if (message.member.roles.find(r => r.name === args[1])) {
      member.removeRole(role);
      channel.send(`J'ai supprimé le role ${role} à **${member}**.`);
      } else {
        member.addRole(role);
        channel.send(`J'ai ajouté le role ${role} à **${member}**`);
      }
    }
  }
});

//help,Sondage
  bot.on('message', message => {
    Help.parse(message)
    Sondage.parse(message)
})
//clear
bot.on('message', message => {
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g);

  if (args[0].toLowerCase() === "k!clear")
   if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
  Clear.parse(message)
})
  
//token
bot.login(process.env.TOKEN)
