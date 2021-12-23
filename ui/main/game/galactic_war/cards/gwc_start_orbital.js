define([
  "module",
  "shared/gw_common",
  "cards/gwc_start",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/functions.js",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/units.js",
], function (module, GW, GWCStart, gwaioFunctions, gwaioUnits) {
  var CARD = { id: /[^/]+$/.exec(module.id).pop() };

  return {
    visible: _.constant(false),
    summarize: _.constant("!LOC:Orbital Commander"),
    icon: function () {
      return gwaioFunctions.loadoutIcon(CARD.id);
    },
    describe: _.constant(
      "!LOC:The Orbital Commander loadout contains all orbital units and factories."
    ),
    deal: gwaioFunctions.startCard,
    buff: function (inventory) {
      if (inventory.lookupCard(CARD) === 0) {
        // Make sure we only do the start buff/dull once
        var buffCount = inventory.getTag("", "buffCount", 0);
        if (!buffCount) {
          GWCStart.buff(inventory);
          gwaioFunctions.setupCluster(inventory);
          inventory.addUnits([
            gwaioUnits.anchor,
            gwaioUnits.jig,
            gwaioUnits.omega,
            gwaioUnits.orbitalFabber,
            gwaioUnits.orbitalFactory,
            gwaioUnits.avenger,
            gwaioUnits.sxx,
            gwaioUnits.hermes,
            gwaioUnits.artemis,
            gwaioUnits.radarSatelliteAdvanced,
            gwaioUnits.arkyd,
            gwaioUnits.solarArray,
          ]);
          inventory.addMods([
            {
              file: gwaioUnits.deepSpaceOrbitalRadar,
              path: "unit_types",
              op: "push",
              value: "UNITTYPE_CmdBuild",
            },
            {
              file: gwaioUnits.orbitalFabber,
              path: "buildable_types",
              op: "add",
              value: " | FabBuild",
            },
          ]);
        } else {
          // Don't clog up a slot.
          inventory.maxCards(inventory.maxCards() + 1);
        }
        ++buffCount;
        inventory.setTag("", "buffCount", buffCount);
      } else {
        // Don't clog up a slot.
        inventory.maxCards(inventory.maxCards() + 1);
        GW.bank.addStartCard(CARD);
      }
    },
    dull: function (inventory) {
      gwaioFunctions.applyDulls(CARD, inventory);
    },
  };
});
