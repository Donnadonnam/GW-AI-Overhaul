define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/functions.js",
], function (gwaioFunctions) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Icarus Upgrade Tech adds production of 2 metal to the solar drone."
    ),
    summarize: _.constant("!LOC:Icarus Upgrade Tech"),
    icon: _.constant(
      "coui://ui/main/game/galactic_war/gw_play/img/tech/gwc_storage_compression.png"
    ),
    audio: function () {
      return {
        found: "/VO/Computer/gw/board_tech_available_economy",
      };
    },
    getContext: function (galaxy) {
      return {
        totalSize: galaxy.stars().length,
      };
    },
    deal: function () {
      var chance = 0;
      if (gwaioFunctions.hasUnit("/pa/units/air/solar_drone/solar_drone.json"))
        chance = 60;

      return { chance: chance };
    },
    buff: function (inventory) {
      var mods = [
        {
          file: "/pa/units/air/solar_drone/solar_drone.json",
          path: "production.metal",
          op: "replace",
          value: 2,
        },
      ];
      inventory.addMods(mods);
    },
    dull: function () {},
  };
});
