define(["coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/units.js"], function (
  gwaioUnits
) {
  return {
    visible: _.constant(true),
    describe: _.constant(
      "!LOC:Bot Engine Tech increases speed of all bots by 50%"
    ),
    summarize: _.constant("!LOC:Bot Engine Tech"),
    icon: _.constant(
      "coui://ui/main/game/galactic_war/gw_play/img/tech/gwc_bot_combat.png"
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
        inventory.hasCard("gwc_enable_bots_t1") ||
        inventory.hasCard("gwc_enable_bots_all") ||
        inventory.hasCard("gwc_start_bot") ||
        inventory.hasCard("gwaio_start_hoarder") ||
        inventory.hasCard("tgw_start_speed")
      ) {
        chance = 70;
      }
      return { chance: chance };
    },
    buff: function (inventory) {
      var units = [
        gwaioUnits.slammer,
        gwaioUnits.dox,
        gwaioUnits.stinger,
        gwaioUnits.boom,
        gwaioUnits.grenadier,
        gwaioUnits.locusts,
        gwaioUnits.gilE,
        gwaioUnits.colonel,
        gwaioUnits.bluehawk,
        gwaioUnits.spark,
        gwaioUnits.botFabberAdvanced,
        gwaioUnits.mend,
        gwaioUnits.stitch,
        gwaioUnits.botFabber,
      ];
      var mods = [];
      units.forEach(function (unit) {
        mods.push(
          {
            file: unit,
            path: "navigation.move_speed",
            op: "multiply",
            value: 1.5,
          },
          {
            file: unit,
            path: "navigation.brake",
            op: "multiply",
            value: 1.5,
          },
          {
            file: unit,
            path: "navigation.acceleration",
            op: "multiply",
            value: 1.5,
          },
          {
            file: unit,
            path: "navigation.turn_speed",
            op: "multiply",
            value: 1.5,
          }
        );
      });
      inventory.addMods(mods);
    },
    dull: function () {
      //empty
    },
  };
});
