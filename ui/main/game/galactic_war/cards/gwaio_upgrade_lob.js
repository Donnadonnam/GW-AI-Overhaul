define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/cards.js",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/units.js",
], function (gwaioCards, gwaioUnits) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Lob Upgrade Tech increases the range of the Lob by 150%."
    ),
    summarize: _.constant("!LOC:Lob Upgrade Tech"),
    icon: _.constant(
      "coui://ui/mods/com.pa.quitch.gwaioverhaul/gw_play/img/tech/gwc_artillery_upgrade.png"
    ),
    audio: function () {
      return {
        found: "/VO/Computer/gw/board_tech_available_ammunition",
      };
    },
    getContext: gwaioCards.getContext,
    deal: function (system, context, inventory) {
      var chance = 0;
      if (gwaioCards.hasUnit(inventory.units(), gwaioUnits.lob)) {
        chance = 60;
      }
      return { chance: chance };
    },
    buff: function (inventory) {
      inventory.addMods([
        {
          file: gwaioUnits.lobWeapon,
          path: "max_range",
          op: "multiply",
          value: 2.5,
        },
        {
          file: gwaioUnits.lobWeapon,
          path: "max_firing_velocity",
          op: "multiply",
          value: 2.5,
        },
      ]);
    },
    dull: function () {
      //empty
    },
  };
});
