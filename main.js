const Discord = require("discord.js");
const Client = new Discord.Client();
const token = "ODEzNDk4MjQwNDc3NTYwODM0.YDQLRg.HWazpSiHPteddOx1VRPiHFSFDNc"
const fs = require("fs")
const warnFile = require("./warns.json");
const serverstats = require("./servers.json");


Client.on("guildMemberAdd", async member =>{
    let channel = member.guild.channels.cache.find(ch => ch.id === serverstats[member.guild.id].welcomechannel);
    if(!channel || channel.id === "nowelcome") return;
    channel.send(`<:member_join:846729870964949002> <@!${member.id}> is just joining **${member.guild.name}**\n**Welcome!** <a:flyingironman:842294044393996328>\nCurrent Members -> **${member.guild.memberCount}**`);

})

Client.on("guildMemberRemove", async member =>{
    let channel = member.guild.channels.cache.find(ch => ch.id === serverstats[member.guild.id].leavechannel);
    if(!channel || channel.id === "noleave") return;
    channel.send(`<:RedArrow:846744117844377600> **${member.user.username}** are left **${member.guild.name}**\n**Goodbye!** <a:flyingironman:842294044393996328>\nCurrent Members -> **${member.guild.memberCount}**`);

})




Client.on("message", async message =>{
    // WarnFile -> warns.json
    if(!warnFile[message.author.id+message.guild.id]){
        warnFile[message.author.id+message.guild.id] = {
            warns:0,
            maxwarn:3
        }
    }

    fs.writeFile("./warns.json", JSON.stringify(warnFile), function(err){
        if(err) console.log(err)
    })

    // Serverstats -> servers.json
    if(!serverstats[message.guild.id]){
        serverstats[message.guild.id] = {
            prefix:"a!",
            welcomechannel:"nowelcome",
            welcomemsg:"nomessage",
            leavechannel :"noleave",
            globalchat:"noID"
        }
    }

    fs.writeFile("./servers.json", JSON.stringify(serverstats), err =>{
        if(err){
            console.log(err);
        }
    })

    let prefix = serverstats[message.guild.id].prefix;

    if(message.content === "nowprefix?"){
        message.channel.send("Fettching Data [**10/10]**...").then(msg1=>{
            msg1.edit("<a:Loading:800341232870096938> Loading...").then(msg=>{
                msg.edit('The current prefix is **'+serverstats[message.guild.id].prefix+'** . <a:flyingironman:842294044393996328>')

            })
        })
    }

    if(message.content.startsWith(prefix+"setprefix")){
        let newprefix = message.content.split(" ").slice(1).join("");

        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You need **ADMINISTRATPR** rights.");

        serverstats[message.guild.id].prefix = newprefix;

        message.channel.send("<a:Loading:800341232870096938> Updateing ... Fettching Data [10/10]").then(msg=>{
            msg.edit('Updated the prefix to **'+newprefix+'**. <a:flyingironman:842294044393996328>')
        })

        fs.writeFile("./servers.json",JSON.stringify(serverstats),function(err){
            if(err) console.log(err);
        })
    }

    // Set Welcome und Leave 

    if(message.content.startsWith(prefix+"setwelcome")){
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You need **ADMINISTRATPR** rights.");

        if(!serverstats[message.guild.id].welcomechannel){
            serverstats[message.guild.id].welcomechannel = "nowelcome"
        }

        let newcwelcome = message.mentions.channels.first();

        if(!newcwelcome) return message.reply("Du hast keinen Kanal angegeben!").then(msg=>msg.delete({timeout:"5000"}));
    
        serverstats[message.guild.id].welcomechannel = newcwelcome.id;

        message.channel.send("<a:Loading:800341232870096938> Updateing ...").then(msg=>{
            msg.edit("Updatet the welcome channel to <#"+newcwelcome.id+"> <a:flyingironman:842294044393996328>")
        })

        fs.writeFile("./servers.json", JSON.stringify(serverstats), function(err){
            if(err) console.log(err);
        })
    }

    if(message.content.startsWith(prefix+"setleave")){
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You need **ADMINISTRATPR** rights.");

        if(!serverstats[message.guild.id].leavechannel){
            serverstats[message.guild.id].leavechannel = "noleave"
        }

        let newleave = message.mentions.channels.first();

        if(!newleave) return message.reply("Du hast keinen Kanal angegeben!").then(msg=>msg.delete({timeout:"5000"}));
    
        serverstats[message.guild.id].leavechannel = newleave.id;

        message.channel.send("<a:Loading:800341232870096938> Updateing ...").then(msg=>{
            msg.edit("Updatet the welcome channel to <#"+newleave.id+"> <a:flyingironman:842294044393996328>")
        })
        

        fs.writeFile("./servers.json", JSON.stringify(serverstats), function(err){
            if(err) console.log(err);
        })
    }

    if(message.content.startsWith(prefix+"delleave")){
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You need **ADMINISTRATPR** rights.");
        
        serverstats[message.guild.id].leavechannel = "noleave"

        message.channel.send("<a:Loading:800341232870096938> Deleting ...").then(msg=>{
            msg.edit("Removed the leave channel. <a:flyingironman:842294044393996328>")
        })
    }

    if(message.content.startsWith(prefix+"delwelcome")){
        serverstats[message.guild.id].welcomechannel = "nowelcome"

        message.channel.send("<a:Loading:800341232870096938> Deleting ...").then(msg=>{
            msg.edit("Removed the welcome channel. <a:flyingironman:842294044393996328>")
        })
    }
        

    



    // Warn System
    if(message.content.startsWith(prefix+"warn")){
        let user = message.mentions.users.first();
        let grund = message.content.split(" ").slice(2).join(" ");
        if(message.author == user) return message.reply("**TF..?** you can't warn yourself")
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You need **KICK_MEMBERS** rights.");

        if(!user) return message.channel.send("Mention a User!")
       
    
        if(!grund) grund = "No Reason given"



        let embed = new Discord.MessageEmbed()
        .setTitle("WARN!")
        .setDescription(`**Attention** <@!${user.id}>, you've been **warned** <a:flyingironman:842294044393996328>!\n**Reason** -> ${grund}`)
        .setThumbnail(user.displayAvatarURL({dynamic: true}))
        .setFooter(`${message.guild.name} | ${message.guild.id} | ${message.id}`, message.guild.iconURL({dynamic: true}))
        .setColor("GOLD")

        message.channel.send(embed)

        if(!warnFile[user.id+message.guild.id]){
            warnFile[user.id+message.guild.id] = {
                warns:0,
                maxwarn:3
            }
        }
    
        warnFile[user.id+message.guild.id].warns += 1

        if(warnFile[user.id+message.guild.id].warns > warnFile[user.id+message.guild.id].maxwarn){
            if(message.guild.member(user).kickable == true){
                message.channel.send(`<@!${user.id}> was kicked beacause of **4 Warns**! <a:flyingironman:842294044393996328>`)
                message.guild.member(user).kick(grund)
            }
        
            delete warnFile[user.id+message.guild.id]
        }

        fs.writeFile("./warns.json", JSON.stringify(warnFile), function(err){
            if(err) console.log(err)
        })
    
    }

    if(message.content.startsWith(prefix+"delwarns")){
        let user = message.mentions.users.first();
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You need **KICK_MEMBERS** rights.");

        if(!user) return message.channel.send("Mention a User!")

        delete warnFile[user.id+message.guild.id]

        message.channel.send("Deleting Warns... <a:Loading:800341232870096938> ").then(msg=>{
            msg.edit(`<@!${user.id}> has now **0** warns, at **${msg.guild.name}** <a:flyingironman:842294044393996328>`)
        })



    }

    if(message.content.startsWith(prefix+"nowwarn")){
        let user = message.mentions.users.first();
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You need **KICK_MEMBERS** rights.");

        if(!user) return message.channel.send("Mention a User!")

        message.channel.send(`<@!${user.id}> has  **${warnFile[user.id+message.guild.id].warns}** warns, at **${message.guild.name}** ! <a:flyingironman:842294044393996328>`)

    }

    // Clear 

    

    if(message.content.startsWith(prefix+"clear")){
     if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(':x: You need ``manage messages`` for that!')
      const args = message.content.split(' ').slice(1); 
      const amount = args.join(' '); 
        
       if (!amount) return message.channel.send(' :x: You havent given an amount of messages which should be deleted!'); 
       if (isNaN(amount)) return message.channel.send(' :x: The amount parameter isnt a number!'); 
       if (amount > 100) return message.channel.send(' :x: You cant delete more than 100 messages at once!');
       if (amount < 1) return message.channel.send(':x: You have to delete at least 1 message!');
                
       message.channel.messages.fetch({ limit: amount }).then(messages => { 
       message.channel.bulkDelete(messages)});

       message.channel.send("Deleting Messages... <a:Loading:800341232870096938> ").then(msg=>{
       msg.edit(`Deleted messages, at **${msg.guild.name}** <a:flyingironman:842294044393996328>`)
    })

}
         

    // Help

    if(message.content.startsWith(`${prefix}help`)){
        let helpembed = new Discord.MessageEmbed()
        .setThumbnail(message.guild.iconURL({dynamic: true}))
        .setTitle(`<a:flyingironman:842294044393996328> The Avengers Help Desk`)
        .setDescription(`<:verify_bot:856172918928965632> Bot-Prefix: **${prefix}**`)
        .setColor("GOLD")
        .setFooter(`${message.guild.name} | ${message.guild.id} | ${message.id}`, message.guild.iconURL({dynamic: true}))
        .addField("-> <a:S3_Loki:854479997607084032> Marvel\nLeaks and **News**.", "> Soon... Version 1.1")
        .addField("-> <a:Ban:798619812283940885> **Moderation**\nModerate your **Server**.", "> ``setwelcome/leave <#channel>``\n> ``delwelcome/leave``\n> ``warn <@user> <reason>``\n-> *From the fourth warning the he gets kicked*\n> ``clear <ammount>``\n-> *Messages over 14 Days can't deleted.*")
        .addField("-> :map: **Global Chat**", "> Soon... Version 1.1")
        .addField("-> <a:PE_PandaFire:851569870234452019> **Main/Fun**", "> Soon... Version 1.1")
        .addField("-> <a:config:846451153411637328> **Prefix** \nPrefix **things**.", "> ``nowprefix?``\n> ``setprefix <newprefix>``")

        message.channel.send(`I hope I’m helping you...`, helpembed).then(msg=>{
            msg.channel.send("<a:Loading:800341232870096938> **Important Infortmation**\nThe bot owner has to ``re-establish`` me, based on a data loss...\n**John Walker#1234** takes the trouble to bring me back to **Version 1.6** as soon as possible.")
        })

    }










})



Client.on("ready", () =>{
    console.log(`ONLINE!`);

    let statuse = [
      "a!help | "+Client.guilds.cache.size+" servers",
      `nowprefix?`,
      "with John Walker😏"
      ]
  
      let number = 0;
  
      Client.user.setActivity(statuse[statuse.length]);
  
      setInterval(()=>{
          let rstatus = statuse[number];
  
          Client.user.setActivity(rstatus, {
            type: "PLAYING"
            });
          number++;
       if(number >= statuse.length){
       number = 0;
     }
   },5000) 
})

Client.login(token)