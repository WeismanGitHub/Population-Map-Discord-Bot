<div align="center">
  
  # Population Map Bot

  ### [Website](https://population-map-bot.fly.dev/)
  ### [Bot Invite](https://discord.com/oauth2/authorize?client_id=1115149738614984764&permissions=414464657472&scope=bot)
  <hr class="rounded">

  ## Description
  The Population Map Bot is a dynamic map generator capable of visualizing population data on a global, continental, or country level. Maps are generated from self-reported locations provided by Discord server members, enabling users to explore population distributions with ease. The application facilitates efficient data processing and visualization, empowering users to gain valuable insights into population patterns across the world. Use `/help`for further information. `/map` can be used to get a map for a specific country. Countries and subdivisions are from [ISO 3166](https://www.iso.org/iso-3166-country-codes.html).

  <hr class="rounded">

  ## Example Images
  ![World Map Example](/images/WORLD-example.jpg)
  ![Continents Map Example](/images/CONTINENTS-example.jpg)
  ![Help Command Example](/images/help-command-example.jpg)
  ![USA Map Example](/images/US-example.jpg)
  ![Italy Map Example](/images/IT-example.jpg)

  <hr class="rounded">
  
  ## User Docs
  You can delete your data with `/user-delete`. Your location should be automatically removed from a server map if you leave or are kicked/banned, but this will not work if the bot is offline. Use `/remove-location` if your location is not automatically removed.

  #### Location
  Add your location to a server map with the `/set-location` command. Use `/remove-location` anywhere to remove your location from a server map. Use `/view-location` to see your location in a server.

  <hr class="rounded">
  
  ## Server Owners Docs
  Set a server's settings with `/server-settings`. Using `/server-settings` for the first time without any options selected will save the defaults. Before the server owner uses `/server-settings`, the map is unavailable.

  #### Server Roles
  The admin role permits a server owner to authorizes members with a certain role to be able to change any server setting. Select a role to become the admin role with the `admin-role` option. Only the owner is allowed to change the admin role.
  
  The map role allows admins/owners to restrict map access to members with a specific role. Set the map role with the `map-role` option. Remove the map or admin role with `remove-role`. `remove-role` does not delete the role from the server.

  #### Map Visibility
  The `visibility` option allows admins/owners to change who can view the server map. Setting `visibility` to `public` allows anyone with a link to view the map. Setting it to `member-restricted` allows only server members to view the map. Choosing `map-role-restricted` restricts the map to the owner and members with the map role. `admin-role-restricted` limits access to only the owner and members with the admin role. Selecting `invisible` hides the map from everyone (even admins), except the owner.

  #### Defaults
  `visibility`: `public`
  `admin-role`: `null`
  `map-role`: `null`

  <hr class="rounded">
</div>
