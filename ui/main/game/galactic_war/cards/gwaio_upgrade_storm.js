define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/cards.js",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/units.js",
], function (gwaioCards, gwaioUnits) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Storm Upgrade Tech enables interception of tactical missiles by the flak tank."
    ),
    summarize: _.constant("!LOC:Storm Upgrade Tech"),
    icon: _.constant(
      "coui://ui/mods/com.pa.quitch.gwaioverhaul/gw_play/img/tech/gwc_vehicle_upgrade.png"
    ),
    audio: function () {
      return {
        found: "/VO/Computer/gw/board_tech_available_ammunition",
      };
    },
    getContext: gwaioCards.getContext,
    deal: function (system, context, inventory) {
      var chance = 0;
      if (gwaioCards.hasUnit(inventory.units(), gwaioUnits.storm)) {
        chance = 60;
      }
      return { chance: chance };
    },
    buff: function (inventory) {
      inventory.addMods([
        {
          file: gwaioUnits.storm,
          path: "tools",
          op: "push",
          value: {
            spec_id: gwaioUnits.gileEBeam,
            aim_bone: "socket_aim",
            muzzle_bone: [
              "socket_muzzle01",
              "socket_muzzle02",
              "socket_muzzle03",
              "socket_muzzle04",
            ],
          },
        },
      ]);
    },
    dull: function () {
      //empty
    },
  };
});
