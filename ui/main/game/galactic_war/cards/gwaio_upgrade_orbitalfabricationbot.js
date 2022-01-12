define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/cards.js",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/units.js",
], function (gwaioCards, gwaioUnits) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Orbital Fabrication Bot Upgrade Tech allows the orbital fabricator to build all basic structures."
    ),
    summarize: _.constant("!LOC:Orbital Fabrication Bot Upgrade Tech"),
    icon: _.constant(
      "coui://ui/mods/com.pa.quitch.gwaioverhaul/gw_play/img/tech/gwc_metal_upgrade.png"
    ),
    audio: function () {
      return {
        found: "/VO/Computer/gw/board_tech_available_orbital",
      };
    },
    getContext: gwaioCards.getContext,
    deal: function (system, context, inventory) {
      var chance = 0;
      if (
        !(
          inventory.hasCard("nem_start_deepspace") ||
          inventory.hasCard("gwc_start_orbital")
        ) &&
        gwaioCards.hasUnit(inventory.units(), gwaioUnits.orbitalFabber)
      ) {
        chance = 60;
      }
      return { chance: chance };
    },
    buff: function (inventory) {
      inventory.addMods([
        {
          file: gwaioUnits.orbitalFabber,
          path: "buildable_types",
          op: "add",
          value: " | Land & Structure & Basic | Factory & Basic | FabBuild",
        },
      ]);

      var structures = [
        "BasicAirDefense",
        "BasicAirFactory",
        "BasicArtillery",
        "BasicBotFactory",
        "BasicEnergyGenerator",
        "BasicLandDefense",
        "BasicLandDefenseSingle",
        "BasicRadar",
        "BasicVehicleFactory",
        "EnergyStorage",
        "MetalStorage",
        "OrbitalLauncher",
        "Umbrella",
        "Wall",
      ];
      var aiMods = _.map(structures, function (structure) {
        return {
          type: "fabber",
          op: "append",
          toBuild: structure,
          idToMod: "builders",
          value: "OrbitalFabber",
        };
      });
      inventory.addAIMods(aiMods);
    },
    dull: function () {
      //empty
    },
  };
});
