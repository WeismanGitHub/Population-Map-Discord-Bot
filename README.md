<div align="center">
    
  # Population Map Bot

  ### [Website](https://population-map-bot.fly.dev/) - [Invite](https://discord.com/api/oauth2/authorize?client_id=1115149738614984764&permissions=268451840&scope=bot)
  The Population Map Bot is a dynamic map generator capable of visualizing population data on a global, continental, or country level. Maps are generated from self-reported locations provided by Discord server members, enabling users to explore population distributions with ease.
  <br/>
  <br/>
  This bot generates a unique map for each Discord server that can be accessed with `/map`. Server members use `/set-location` to add their location to the map. A location can be any country and, optionally, a subdivision (state, region, prefecture, etc.) within that country. Server admins can also make it so only members who share their location can access the server.
  <br/>
  <br/>
  <div style="display: flex;justify-content: center;overflow-wrap: break-word;text-align: center;flex-wrap: wrap;">
    <img src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/WORLD2-example.jpg" alt="World Example" style="width: 40%;min-width: 350px;height: auto;margin: 5px;"/>
    <img src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/CONTINENTS-example.jpg" alt="Continents Example" style="width: 40%;min-width: 350px;height: auto;margin: 5px;" />
    <img src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/US-example.jpg" alt="USA Example" style="width: 40%;min-width: 350px;height: auto;margin: 5px;" />
    <img src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/IT-example.jpg" alt="USA Example" style="width: 40%;min-width: 350px;height: auto;margin: 5px;" />
  </div>

  <hr class="rounded">
  
  ## User Docs
  You can delete your data with `/user-delete`. Your location should be automatically removed from a server map if you leave or are kicked/banned, but this will not work if the bot is offline. Use `/remove-location` if your location is not automatically removed.

  #### Location
  Add your location to a server map with the `/set-location` command. Use `/remove-location` anywhere to remove your location from a server map. Use `/view-location` to see your location in a server.

  <hr class="rounded">
  
  ## Server Owners Docs
  Set a server's settings with `/server-settings`. Using `/server-settings` for the first time without any options selected will save the defaults. Before the server owner uses `/server-settings`, the map is unavailable.

  #### Server Roles
  The `user-role` is assigned to a member when they set their location and is removed when their location is deleted. You can lock your server behind this role, essentially requiring people set their locations. You MUST place the `Population Map Bot` role above the `user-role` in your server's settings for it to work.

  The admin role permits a server owner to authorizes members with a certain role to be able to change any server setting. Select a role to become the admin role with the `admin-role` option. Only the owner is allowed to change the admin role.
  
  The map role allows admins/owners to restrict map access to members with a specific role. Set the map role with the `map-role` option. Remove the map, admin, or user role with `remove-role`. `remove-role` does not delete the role from the server.

  #### Map Visibility
  The `visibility` option allows admins/owners to change who can view the server map. Setting `visibility` to `public` allows anyone with a link to view the map. Setting it to `member-restricted` allows only server members to view the map. Choosing `map-role-restricted` restricts the map to the owner and members with the map role. `admin-role-restricted` limits access to only the owner and members with the admin role. Selecting `invisible` hides the map from everyone, including admins and the owner.

  #### Defaults
  `visibility`: `public`
  <br/>
  `admin-role`: `null`
  <br/>
  `map-role`: `null`
  <br/>
  `user-role`: `null`
</div>
