<div align="center">
  
  # Population Density Map Bot
  ### [Bot Invite](https://discord.com/api/oauth2/authorize?client_id=1115149738614984764&permissions=414464657472&scope=bot)
  ### [Website](localhost:5001/)
  
  <hr class="rounded">

  ## Description
  Generate a population density map based off of server member's self reported locations. Use `/help` in a Discord server to get the link to the server map. `/map` can be used to get a map for a specific country. Countries and subdivisions are from [ISO 3166](https://www.iso.org/iso-3166-country-codes.html).

  <hr class="rounded">

  ## User Docs
  You can delete your data with `/user-delete`. Your location should be automatically removed from a server map if you are kicked/banned/leave the server, but this will not work if the bot is offline. Use `/remove-location` if your location is not automatically removed.

  #### Location
  Save your location with the `/set-location` command. You must choose your country and optionally your subdivision (state, region, prefecture, etc). Your location is the same across all servers, and isn't shared with any servers automatically. You need to manually use `/add-location` in a server to add your location to the server's map. Use `/remove-location` anywhere to remove your location from any map.

  #### User Settings
  View your settings/location by using `/user-settings` with no options selected. To have your location automatically added when you join a server, use the `add-location-on-join` option in `/user-settings`. `add-location-on-join` is off by default.

  <hr class="rounded">
  
  ## Server Owners Docs
  Set a server's settings with `/server-settings`. Using `/server-settings` for the first time without any options selected will save the defaults. Before the server owner uses `/server-settings`, the map is unavailable.

  #### Server Roles
  The admin role permits a server owner to authorizes members with a certain role to be able to change any server setting. Select a role to become the admin role with the `admin-role` option. Only the owner is allowed to change the admin role.
  
  The map role allows admins/owners to restrict map access to members with a role. Set the map role with the `map-role` option. Remove the map or admin role with `remove-role`. `remove-role` does not delete the role from the server.

  #### Map Visibility
  The `visibility` option allows admins/owners to change who can view the server map. Setting `visibility` to `public` allows anyone with a link to view the map. Setting it to `member-restricted` allows only server members to view the map. Choosing `map-role-restricted` restricts the map to the owner and members with the map role. The `admin-role-restricted` choice limits access to only the owner and members with the admin role. Selecting `invisible` blocks the map to everyone, including owners and admins.

  #### Defaults
  `visibility`: `member-restricted`
  `admin-role`: `null`
  `map-role`: `null`

  <hr class="rounded">

  ## Example Images
  ![World Map Example](/images/WORLD-example.jpg)
  ![Help Command Example](/images/help-command-example.png)
  ![USA Map Example](/images/US-example.png)
  ![Italy Map Example](/images/IT-example.png)

  <hr class="rounded">
</div>
