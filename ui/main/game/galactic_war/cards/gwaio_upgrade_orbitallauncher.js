define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/cards.js",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/units.js",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/unit_groups.js",
], function (gwoCard, gwoUnit, gwoGroup) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Orbital Launcher Upgrade Tech enables the building of advanced units by basic orbital manufacturing."
    ),
    summarize: _.constant("!LOC:Orbital Launcher Upgrade Tech"),
    icon: _.constant(
      "coui://ui/mods/com.pa.quitch.gwaioverhaul/gw_play/img/tech/gwc_orbital_upgrade.png"
    ),
    audio: function () {
      return {
        found: "/VO/Computer/gw/board_tech_available_orbital",
      };
    },
    getContext: gwoCard.getContext,
    deal: function (system, context, inventory) {
      var chance = 0;
      if (
        !inventory.hasCard("gwaio_start_rapid") &&
        gwoCard.hasUnit(inventory.units(), gwoUnit.orbitalLauncher)
      ) {
        chance = 60;
      }
      return { chance: chance };
    },
    buff: function (inventory) {
      inventory.addUnits(gwoGroup.orbitalAdvanced);

      inventory.addMods([
        {
          file: gwoUnit.orbitalLauncher,
          path: "buildable_types",
          op: "add",
          value: "| (Orbital & FactoryBuild)",
        },
      ]);

      var units = [
        "SolarArray",
        "OrbitalDeathLaser",
        "AdvancedRadarSattelite",
        "OrbitalRailgun",
        "OrbitalBattleShip",
      ];
      var aiMods = _.flatten(
        _.map(units, function (unit) {
          return [
            {
              type: "factory",
              op: "append",
              toBuild: unit,
              idToMod: "builders",
              value: "OrbitalLauncher",
            },
            {
              type: "factory",
              op: "replace",
              toBuild: unit,
              idToMod: "priority",
              value: 100,
            },
          ];
        })
      );
      inventory.addAIMods(aiMods);
    },
    dull: function () {
      // empty
    },
  };
});
