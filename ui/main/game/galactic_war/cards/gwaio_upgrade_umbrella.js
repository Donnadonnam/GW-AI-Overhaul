define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/cards.js",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/units.js",
], function (gwaioCards, gwaioUnits) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Umbrella Upgrade Tech enables the targeting of land and surface naval units by anti-orbital defenses."
    ),
    summarize: _.constant("!LOC:Umbrella Upgrade Tech"),
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
      if (gwaioCards.hasUnit(inventory.units(), gwaioUnits.umbrella)) {
        chance = 60;
      }
      return { chance: chance };
    },
    buff: function (inventory) {
      inventory.addMods([
        {
          file: gwaioUnits.umbrella,
          path: "unit_types",
          op: "push",
          value: "UNITTYPE_SurfaceDefense",
        },
        {
          file: gwaioUnits.umbrellaWeapon,
          path: "target_layers",
          op: "push",
          value: ["WL_LandHorizontal", "WL_WaterSurface"],
        },
        {
          file: gwaioUnits.umbrellaAmmo,
          path: "turn_rate",
          op: "replace",
          value: 1000,
        },
      ]);
    },
    dull: function () {
      //empty
    },
  };
});
