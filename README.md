<div align="center">
    
  # Population Map Bot

### [Website](https://population-map-bot.fly.dev/) - [Invite](https://discord.com/api/oauth2/authorize?client_id=1115149738614984764&permissions=268451840&scope=bot)

The Population Map Bot is a dynamic map generator that visualizes your Discord server's population data on a global, continental, or country level. Maps are generated from self-reported locations provided by server members and are anonymous.
<br/>
<br/>
Server members use `/set-location` to set their country and, optionally, a subdivision (state, province, etc.) within that country. Maps are generated through the website, and you can get a link to a server's map with `/map`. Server admins can also make it so only members who share their location can access the server.
<br/>
<br/>

  <div style="display: flex;justify-content: center;overflow-wrap: break-word;text-align: center;flex-wrap: wrap;">
    <img src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/WORLD2-example.jpg" alt="World Example" style="width: 40%;min-width: 350px;height: auto;margin: 5px;"/>
    <img src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/CONTINENTS-example.jpg" alt="Continents Example" style="width: 40%;min-width: 350px;height: auto;margin: 5px;" />
    <img src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/US-example.jpg" alt="USA Example" style="width: 40%;min-width: 350px;height: auto;margin: 5px;" />
    <img src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/IT-example.jpg" alt="USA Example" style="width: 40%;min-width: 350px;height: auto;margin: 5px;" />
  </div>

## User Docs

You can delete your data with `/user-delete`. Your location should be automatically removed from a server map if you leave or are kicked/banned, but this will not work if the bot is offline. Use `/remove-location` if your location is not automatically removed.

#### Location

Add your location to a server map with the `/set-location` command. Use `/remove-location` anywhere to remove your location from a server map. Use `/view-location` to see your location in a server.

## Server Owners Docs

Set a server's settings with `/server-settings`. By default, the roles are set to nothing.

#### Server Roles

The `user role` is assigned to a member when they set their location and is removed when their location is deleted. You can lock your server behind this role, essentially forcing people set their locations. You <strong>must</strong> place the `Population Map Bot` role above the `user role` in your server's settings for it to work.

Server members with the `admin role` can make changes to the server settings (except deleting server data). Only the owner is allowed to change the admin role.

You can make it so only people with the `map role` can see the map, but you also need to set the [map visibility](https://github.com/WeismanGitHub/Population-Map-Discord-Bot?tab=readme-ov-file#map-visibility).

Remove the map, admin, or user role with the `remove-role` option. `remove-role` does not delete the role from the server.

#### Map Visibility

Owners/admins can change who can see the server map with the `visiblity` option. The `public` option lets anyone with a link see the map, `member-restricted` allows only members to see it, `map-role-restricted` authorizes people with the `map role`, and `admin-role-restricted` authorizes owners/admins. `invisible` hides the map from everyone, including owners/admins.

#### Defaults

`visibility`: `public`
<br/>
`admin-role`: `null`
<br/>
`map-role`: `null`
<br/>
`user-role`: `null`

## Developer Instructions

### Commands

  <div style="text-align: center;">
    <div style="display: inline-block; text-align: left;">
        <code>npm run setup</code> installs the required packages
        <br/>
        <code>npm run build</code> builds the application
        <br/>
        <code>npm run dev</code> runs the application locally with nodemon
        <br/>
        <code>npm run commands</code> deploys commands to Discord
        <br/>
        <code>npm run prettier</code> reformats the code
        <br/>
        <code>fly deploy</code> deploys the application to Fly.io
    </div>
  </div>

### Environment Variables

The top level directory and <code>/src/client</code> both require their own <code>.env</code> files.

Populate the client <code>.env</code> with the variables <code>VITE_BOT_INVITE</code>, <code>VITE_OAUTH_URL</code>, and <code>VITE_SUPPORT_SERVER_INVITE</code>.

Populate the top level <code>.env</code> with the variables in <code>/src/server/config.ts</code>.

</div>
