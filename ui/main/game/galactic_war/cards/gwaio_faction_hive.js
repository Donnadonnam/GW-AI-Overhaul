define([], function () {
  return {
    buff: function (inventory) {
      var units = [
        "/pa/units/air/support_platform/support_platform.json",
        "/pa/units/land/bot_support_commander/bot_support_commander.json",
      ];
      var mods = [
        {
          file:
            "/pa/units/land/bot_support_commander/bot_support_commander.json",
          path: "tools.0.spec_id",
          op: "replace",
          value: "/pa/tools/commander_build_arm/commander_build_arm.json",
        },
        {
          file: "/pa/units/air/support_platform/support_platform.json",
          path: "buildable_types",
          op: "replace",
          value: "CmdBuild",
        },
        {
          file: "/pa/units/air/support_platform/support_platform.json",
          path: "command_caps",
          op: "replace",
          value: [
            "ORDER_Move",
            "ORDER_Patrol",
            "ORDER_Build",
            "ORDER_Attack",
            "ORDER_Reclaim",
            "ORDER_Repair",
            "ORDER_Assist",
            "ORDER_Use",
          ],
        },
        {
          file: "/pa/units/air/support_platform/support_platform.json",
          path: "max_health",
          op: "multiply",
          value: 5,
        },
        {
          file: "/pa/units/air/support_platform/support_platform.json",
          path: "tools.1.spec_id",
          op: "replace",
          value: "/pa/tools/commander_build_arm/commander_build_arm.json",
        },
        {
          file: "/pa/units/air/support_platform/support_platform.json",
          path: "transportable.size",
          op: "replace",
          value: 1,
        },
      ];
      units.forEach(function (unit) {
        mods.push(
          {
            file: unit,
            path: "build_metal_cost",
            op: "replace",
            value: 25000,
          },
          {
            file: unit,
            path: "si_name",
            op: "replace",
            value: "commander",
          },
          {
            file: unit,
            path: "storage.energy",
            op: "replace",
            value: 45000,
          },
          {
            file: unit,
            path: "storage.metal",
            op: "replace",
            value: 1500,
          },
          {
            file: unit,
            path: "strategic_icon_priority",
            op: "replace",
            value: 0,
          },
          {
            file: unit,
            path: "production.energy",
            op: "replace",
            value: 2000,
          },
          {
            file: unit,
            path: "production.metal",
            op: "replace",
            value: 20,
          },
          {
            file: unit,
            path: "recon.observer.items",
            op: "replace",
            value: [
              {
                channel: "sight",
                layer: "surface_and_air",
                radius: 150,
                shape: "capsule",
              },
              {
                channel: "sight",
                layer: "underwater",
                radius: 150,
                shape: "capsule",
              },
              {
                channel: "sight",
                layer: "celestial",
                radius: 1,
                shape: "sphere",
              },
            ],
          },
          {
            file: unit,
            path: "unit_types",
            op: "replace",
            value: [
              "UNITTYPE_Commander",
              "UNITTYPE_Construction",
              "UNITTYPE_Mobile",
              "UNITTYPE_Offense",
              "UNITTYPE_Land", // if you use Air then the AI won't work right
              "UNITTYPE_NoBuild",
            ],
          }
        );
      });
      inventory.addMods(mods);
    },
  };
});
