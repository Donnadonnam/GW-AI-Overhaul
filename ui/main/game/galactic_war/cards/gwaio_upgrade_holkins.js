define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/functions.js",
], function (gwaioFunctions) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Holkins Upgrade Tech triples the number of shots fired per volley by the advanced artillery while also tripling their deviation from target."
    ),
    summarize: _.constant("!LOC:Holkins Upgrade Tech"),
    icon: _.constant(
      "coui://ui/mods/com.pa.quitch.gwaioverhaul/gw_play/img/tech/gwc_artillery_upgrade.png"
    ),
    audio: function () {
      return {
        found: "/VO/Computer/gw/board_tech_available_ammunition",
      };
    },
    getContext: function (galaxy) {
      return {
        totalSize: galaxy.stars().length,
      };
    },
    deal: function () {
      var chance = 0;
      if (
        gwaioFunctions.hasUnit(
          "/pa/units/land/artillery_long/artillery_long.json"
        )
      )
        chance = 60;

      return { chance: chance };
    },
    buff: function (inventory) {
      inventory.addMods([
        {
          file: "/pa/units/land/artillery_long/artillery_long.json",
          path: "tools.0.projectiles_per_fire",
          op: "replace",
          value: 3,
        },
        {
          file: "/pa/units/land/artillery_long/artillery_long.json",
          path: "tools.0.muzzle_bone",
          op: "replace",
          value: ["socket_muzzle", "socket_muzzle", "socket_muzzle"],
        },
        {
          file: "/pa/units/land/artillery_long/artillery_long_tool_weapon.json",
          path: "firing_standard_deviation",
          op: "multiply",
          value: 3,
        },
      ]);
    },
    dull: function () {
      //empty
    },
  };
});
