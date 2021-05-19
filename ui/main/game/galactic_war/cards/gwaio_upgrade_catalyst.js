define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/functions.js",
], function (gwaioFunctions) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Catalyst Upgrade Tech increases the health of the Catalyst by 75%, enough to survive a nuclear blast."
    ),
    summarize: _.constant("!LOC:Catalyst Upgrade Tech"),
    icon: _.constant(
      "coui://ui/main/game/galactic_war/gw_play/img/tech/gwc_super_weapons.png"
    ),
    audio: function () {
      return {
        found: "/VO/Computer/gw/board_tech_available_armor",
      };
    },
    getContext: function (galaxy) {
      return {
        totalSize: galaxy.stars().length,
      };
    },
    deal: function (system, context, inventory) {
      var hasCard = inventory.hasCard();
      var hasUnit = gwaioFunctions.hasUnit();
      var chance = 0;
      if (
        hasUnit("/pa/units/land/control_module/control_module.json") &&
        (hasUnit("/pa/units/air/air_factory_adv/air_factory_adv.json") ||
          hasCard("gwaio_upgrade_airfactory") ||
          hasUnit("/pa/units/land/bot_factory_adv/bot_factory_adv.json") ||
          hasCard("gwaio_upgrade_botfactory") ||
          hasUnit("/pa/units/sea/naval_factory_adv/naval_factory_adv.json") ||
          hasCard("gwaio_upgrade_navalfactory") ||
          hasUnit(
            "/pa/units/land/vehicle_factory_adv/vehicle_factory_adv.json"
          ) ||
          hasCard("gwaio_upgrade_vehiclefactory"))
      )
        chance = 60;

      return { chance: chance };
    },
    buff: function (inventory) {
      inventory.addMods([
        {
          file: "/pa/units/land/control_module/control_module.json",
          path: "max_health",
          op: "multiply",
          value: 1.75,
        },
      ]);
    },
    dull: function () {},
  };
});
