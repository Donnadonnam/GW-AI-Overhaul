define([
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/cards.js",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/unit_groups.js",
], function (gwoCard, gwoGroup) {
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
    getContext: gwoCard.getContext,
    deal: function (system, context, inventory) {
      var chance = 0;
      if (gwoCard.hasUnit(inventory.units(), gwoGroup.botsMobile)) {
        chance = 70;
      }
      return { chance: chance };
    },
    buff: function (inventory) {
      var mods = _.flatten(
        _.map(gwoGroup.botsMobile, function (unit) {
          return [
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
            },
          ];
        })
      );
      inventory.addMods(mods);
    },
    dull: function () {
      // empty
    },
  };
});
