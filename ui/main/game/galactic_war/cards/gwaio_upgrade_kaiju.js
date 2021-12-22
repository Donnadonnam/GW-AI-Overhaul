define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/functions.js",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/units.js",
], function (gwaioFunctions, gwaioUnits) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Kaiju Upgrade Tech enables the use of teleporters by hover destroyers."
    ),
    summarize: _.constant("!LOC:Kaiju Upgrade Tech"),
    icon: _.constant(
      "coui://ui/mods/com.pa.quitch.gwaioverhaul/gw_play/img/tech/gwc_naval_upgrade.png"
    ),
    audio: function () {
      return {
        found: "/VO/Computer/gw/board_tech_available_speed",
      };
    },
    getContext: function (galaxy) {
      return {
        totalSize: galaxy.stars().length,
      };
    },
    deal: function (system, context, inventory) {
      var chance = 0;
      if (
        (gwaioFunctions.hasUnit(gwaioUnits.navalFactoryAdvanced) ||
          inventory.hasCard("gwaio_upgrade_navalfactory")) &&
        gwaioFunctions.hasUnit(gwaioUnits.kaiju)
      ) {
        chance = 30;
      }

      return { chance: chance };
    },
    buff: function (inventory) {
      inventory.addMods([
        {
          file: gwaioUnits.kaiju,
          path: "teleportable",
          op: "replace",
          value: {},
        },
        {
          file: gwaioUnits.kaiju,
          path: "command_caps",
          op: "push",
          value: "ORDER_Use",
        },
      ]);

      inventory.addAIMods([
        {
          type: "factory",
          op: "new",
          toBuild: "HoverShip",
          value: [
            {
              test_type: "AloneOnPlanet",
              boolean: true,
            },
            {
              test_type: "CanAffordBuildDemand",
            },
            {
              test_type: "OtherPlanetCanReceiveLandUnitAssistance",
              boolean: true,
            },
            {
              test_type: "UnitCountOnPlanet",
              unit_type_string0: "Structure & Teleporter",
              compare0: ">",
              value0: 0,
            },
          ],
        },
        {
          type: "platoon",
          op: "prepend",
          toBuild: "Land_Attack_XLarge",
          value: "(Naval & Hover & Advanced & Mobile) | ",
          idToMod: "unit_type_string0",
          refId: "test_type",
          refValue: "UnitPoolCount",
        },
        {
          type: "template",
          op: "squad",
          toBuild: "Land_Attack_XLarge",
          value: {
            unit_types:
              "(Naval & Hover & Advanced & Mobile) - Fabber - AirDefense - Construction - Artillery - Heavy - Scout - SelfDestruct - Deconstruction - Titan",
            min_count: 0,
            max_count: 40,
            squad: "General",
          },
        },
        {
          type: "platoon",
          op: "prepend",
          toBuild: "Land_Attack_Max",
          value: "(Naval & Hover & Advanced & Mobile) | ",
          idToMod: "unit_type_string0",
          refId: "test_type",
          refValue: "UnitPoolCount",
        },
        {
          type: "template",
          op: "squad",
          toBuild: "Land_Attack_Max",
          value: {
            unit_types:
              "(Naval & Hover & Advanced & Mobile) - Fabber - AirDefense - OrbitalDefense - Construction - Artillery - Tactical - Heavy - Scout - SelfDestruct - Deconstruction - Titan",
            min_count: 0,
            max_count: -1,
            squad: "General",
          },
        },
        {
          type: "platoon",
          op: "prepend",
          toBuild: "Teleporter_Attack_Queller",
          value: "(Naval & Hover & Advanced & Mobile) | ",
          idToMod: "unit_type_string0",
          refId: "test_type",
          refValue: "UnitPoolCount",
        },
        {
          type: "template",
          op: "squad",
          toBuild: "Teleporter_Attack_Queller",
          value: {
            unit_types:
              "(Naval & Hover & Advanced & Mobile) - Fabber - AirDefense - OrbitalDefense - Construction - Artillery - Tactical - Heavy - Scout - SelfDestruct - Deconstruction - Titan",
            min_count: 0,
            max_count: -1,
            squad: "General",
          },
        },
      ]);
    },
    dull: function () {
      //empty
    },
  };
});
