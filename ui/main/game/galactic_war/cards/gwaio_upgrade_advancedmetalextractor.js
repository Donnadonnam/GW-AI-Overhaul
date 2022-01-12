define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/cards.js",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/units.js",
], function (gwaioCards, gwaioUnits) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Advanced Metal Extractor Upgrade Tech increases the metal production of this advanced economy structure by 25% but decreases its health by 50%."
    ),
    summarize: _.constant("!LOC:Advanced Metal Extractor Upgrade Tech"),
    icon: _.constant(
      "coui://ui/mods/com.pa.quitch.gwaioverhaul/gw_play/img/tech/gwc_storage_compression_upgrade.png"
    ),
    audio: function () {
      return {
        found: "/VO/Computer/gw/board_tech_available_efficiency",
      };
    },
    getContext: gwaioCards.getContext,
    deal: function (system, context, inventory) {
      var chance = 0;
      if (
        gwaioCards.hasUnit(inventory.units(), gwaioUnits.metalExtractorAdvanced)
      ) {
        chance = 60;
      }
      return { chance: chance };
    },
    buff: function (inventory) {
      inventory.addMods([
        {
          file: gwaioUnits.metalExtractorAdvanced,
          path: "production.metal",
          op: "multiply",
          value: 1.25,
        },
        {
          file: gwaioUnits.metalExtractorAdvanced,
          path: "max_health",
          op: "multiply",
          value: 0.5,
        },
      ]);
    },
    dull: function () {
      //empty
    },
  };
});
