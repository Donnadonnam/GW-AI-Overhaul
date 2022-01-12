define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/cards.js",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/units.js",
], function (gwaioCards, gwaioUnits) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Torpedo Launcher Upgrade Tech enables the targeting of hover and coastal naval units by the Torpedo Launcher."
    ),
    summarize: _.constant("!LOC:Torpedo Launcher Upgrade Tech"),
    icon: _.constant(
      "coui://ui/mods/com.pa.quitch.gwaioverhaul/gw_play/img/tech/gwc_turret_upgrade.png"
    ),
    audio: function () {
      return {
        found: "/VO/Computer/gw/board_tech_available_ammunition",
      };
    },
    getContext: gwaioCards.getContext,
    deal: function (system, context, inventory) {
      var chance = 0;
      if (gwaioCards.hasUnit(inventory.units(), gwaioUnits.torpedoLauncher)) {
        chance = 30;
      }
      return { chance: chance };
    },
    buff: function (inventory) {
      inventory.addMods([
        {
          file: gwaioUnits.torpedoLauncherWeapon,
          path: "exclude_unit_types",
          op: "replace",
          value: "",
        },
      ]);
    },
    dull: function () {
      //empty
    },
  };
});
