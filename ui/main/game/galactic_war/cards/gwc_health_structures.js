define([
  "shared/gw_common",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/units.js",
], function (GW, gwaioUnits) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Structure Armor Tech increases the health of all structures by 50%"
    ),
    summarize: _.constant("!LOC:Structure Armor Tech"),
    icon: _.constant(
      "coui://ui/main/game/galactic_war/gw_play/img/tech/gwc_structure.png"
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
    deal: function (system, context) {
      var chance = 0;
      var dist = system.distance();
      if (dist > 0) {
        if (context.totalSize <= GW.balance.numberOfSystems[0]) {
          chance = 14;
        } else if (context.totalSize <= GW.balance.numberOfSystems[1]) {
          chance = 14;
        } else if (context.totalSize <= GW.balance.numberOfSystems[2]) {
          chance = 28;
          if (dist > 6) {
            chance = 142;
          }
        } else if (context.totalSize <= GW.balance.numberOfSystems[3]) {
          chance = 28;
          if (dist > 9) {
            chance = 142;
          }
        } else {
          chance = 28;
          if (dist > 12) {
            chance = 142;
          }
        }
      }
      return { chance: chance };
    },
    buff: function (inventory) {
      var units = [
        gwaioUnits.airFactoryAdvanced,
        gwaioUnits.airFactory,
        gwaioUnits.flak,
        gwaioUnits.galata,
        gwaioUnits.antiNukeLauncher,
        gwaioUnits.holkins,
        gwaioUnits.pelter,
        gwaioUnits.lob,
        gwaioUnits.botFactoryAdvanced,
        gwaioUnits.botFactory,
        gwaioUnits.catalyst,
        gwaioUnits.energyPlantAdvanced,
        gwaioUnits.energyPlant,
        gwaioUnits.energyStorage,
        gwaioUnits.wall,
        gwaioUnits.landMine,
        gwaioUnits.laserDefenseTowerAdvanced,
        gwaioUnits.singleLaserDefenseTower,
        gwaioUnits.laserDefenseTower,
        gwaioUnits.metalExtractorAdvanced,
        gwaioUnits.metalExtractor,
        gwaioUnits.metalStorage,
        gwaioUnits.nukeLauncher,
        gwaioUnits.radarAdvanced,
        gwaioUnits.radar,
        gwaioUnits.catapult,
        gwaioUnits.teleporter,
        gwaioUnits.unitCannon,
        gwaioUnits.vehicleFactoryAdvanced,
        gwaioUnits.vehicleFactory,
        gwaioUnits.deepSpaceOrbitalRadar,
        gwaioUnits.anchor,
        gwaioUnits.halley,
        gwaioUnits.umbrella,
        gwaioUnits.jig,
        gwaioUnits.orbitalFactory,
        gwaioUnits.orbitalLauncher,
        gwaioUnits.navalFactoryAdvanced,
        gwaioUnits.navalFactory,
        gwaioUnits.torpedoLauncherAdvanced,
        gwaioUnits.torpedoLauncher,
      ];
      var mods = [];
      units.forEach(function (unit) {
        mods.push({
          file: unit,
          path: "max_health",
          op: "multiply",
          value: 1.5,
        });
      });
      inventory.addMods(mods);
    },
    dull: function () {
      //empty
    },
  };
});
