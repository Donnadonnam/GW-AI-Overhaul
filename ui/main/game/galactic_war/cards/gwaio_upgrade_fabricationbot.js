define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/functions.js",
], function (gwaioFunctions) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Fabrication Bot Upgrade Tech enables the building of advanced structures by the basic bot fabricator."
    ),
    summarize: _.constant("!LOC:Fabrication Bot Upgrade Tech"),
    icon: _.constant(
      "coui://ui/main/game/galactic_war/gw_play/img/tech/gwc_metal.png"
    ),
    audio: function () {
      return {
        found: "/VO/Computer/gw/board_tech_available_bot",
      };
    },
    getContext: function (galaxy) {
      return {
        totalSize: galaxy.stars().length,
      };
    },
    deal: function () {
      var hasUnit = gwaioFunctions.hasUnit();
      var chance = 0;
      if (
        hasUnit("/pa/units/land/bot_factory/bot_factory.json") &&
        hasUnit("/pa/units/land/fabrication_bot/fabrication_bot.json")
      )
        chance = 60;

      return { chance: chance };
    },
    buff: function (inventory) {
      inventory.addMods([
        {
          file: "/pa/units/land/fabrication_bot/fabrication_bot.json",
          path: "buildable_types",
          op: "replace",
          value:
            "Land & Structure & Advanced - Factory | Factory & Advanced & Bot & Land | FabAdvBuild | FabBuild",
        },
      ]);
    },
    dull: function () {},
  };
});
