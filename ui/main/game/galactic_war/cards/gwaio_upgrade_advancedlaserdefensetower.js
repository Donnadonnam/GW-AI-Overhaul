define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/functions.js",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/units.js",
], function (gwaioFunctions, gwaioUnits) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Advanced Laser Defense Tower Upgrade Tech increases the rate of fire of the advanced turret by 300%, but it fires in bursts and requires energy to recharge."
    ),
    summarize: _.constant("!LOC:Advanced Laser Defense Tower Upgrade Tech"),
    icon: _.constant(
      "coui://ui/mods/com.pa.quitch.gwaioverhaul/gw_play/img/tech/gwc_defense_upgrade.png"
    ),
    audio: function () {
      return {
        found: "/VO/Computer/gw/board_tech_available_ammunition",
      };
    },
    getContext: gwaioFunctions.getContext,
    deal: function () {
      var chance = 0;
      if (gwaioFunctions.hasUnit(gwaioUnits.laserDefenseTowerAdvanced)) {
        chance = 60;
      }

      return { chance: chance };
    },
    buff: function (inventory) {
      inventory.addMods([
        {
          file: gwaioUnits.laserDefenseTowerAdvancedWeapon,
          path: "rate_of_fire",
          op: "multiply",
          value: 4,
        },
        {
          file: gwaioUnits.laserDefenseTowerAdvancedWeapon,
          path: "ammo_source",
          op: "replace",
          value: "energy",
        },
        {
          file: gwaioUnits.laserDefenseTowerAdvancedWeapon,
          path: "ammo_capacity",
          op: "replace",
          value: 1200,
        },
        {
          file: gwaioUnits.laserDefenseTowerAdvancedWeapon,
          path: "ammo_demand",
          op: "replace",
          value: 300,
        },
        {
          file: gwaioUnits.laserDefenseTowerAdvancedWeapon,
          path: "ammo_per_shot",
          op: "replace",
          value: 100,
        },
        {
          file: gwaioUnits.laserDefenseTowerAdvancedWeapon,
          path: "spread_fire",
          op: "replace",
          value: true,
        },
        {
          file: gwaioUnits.laserDefenseTowerAdvancedWeapon,
          path: "carpet_fire",
          op: "replace",
          value: true,
        },
        {
          file: gwaioUnits.laserDefenseTowerAdvancedWeapon,
          path: "carpet_wait_for_full_ammo",
          op: "replace",
          value: true,
        },
      ]);
    },
    dull: function () {
      //empty
    },
  };
});
