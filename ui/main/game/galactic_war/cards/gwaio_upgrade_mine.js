define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/functions.js",
], function (gwaioFunctions) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Mine Upgrade Tech allows mines to explode without self-destructing."
    ),
    summarize: _.constant("!LOC:Mine Upgrade Tech"),
    icon: _.constant(
      "coui://ui/main/game/galactic_war/gw_play/img/tech/gwc_turret.png"
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
    deal: function (system, context, inventory) {
      var hasUnit = gwaioFunctions.hasUnit();
      var chance = 0;
      if (
        hasUnit("/pa/units/land/land_mine/land_mine.json") &&
        (hasUnit("/pa/units/sea/fabrication_barge/fabrication_barge.json") ||
          hasUnit(
            "/pa/units/land/fabrication_bot_combat/fabrication_bot_combat.json"
          ) ||
          ((hasUnit("/pa/units/land/bot_factory_adv/bot_factory_adv.json") ||
            inventory.hasCard("gwaio_upgrade_botfactory")) &&
            hasUnit(
              "/pa/units/land/fabrication_bot_combat_adv/fabrication_bot_combat_adv.json"
            )))
      )
        chance = 60;

      return { chance: chance };
    },
    buff: function (inventory) {
      inventory.addMods([
        {
          file: "/pa/units/land/land_mine/land_mine_tool_weapon.json",
          path: "self_destruct",
          op: "replace",
          value: false,
        },
      ]);
    },
    dull: function () {},
  };
});
