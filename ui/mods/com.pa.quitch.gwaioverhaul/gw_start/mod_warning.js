var gwoModWarningLoaded;

if (!gwoModWarningLoaded) {
  gwoModWarningLoaded = true;

  function gwoModWarning() {
    try {
      api.mods.getMounted("client", true).then(function (mods) {
        var modMounted = function (modIdentifier) {
          return _.some(mods, { identifier: modIdentifier });
        };

        var modIncompatible = "";
        var modIssues = "";

        if (modMounted("com.heiz.aurora_arty")) {
          modIncompatible += "<br>Aurora-Artillery";
        }
        if (modMounted("com.wondible.pa.gw_challenge")) {
          modIncompatible += "<br>Challenge Levels for Galactic War";
        }
        if (modMounted("com.wondible.pa.gw_ramp")) {
          modIncompatible += "<br>Enemy Ramp for Galactic War";
        }
        if (modMounted("nemuneko.gw.unique.loadouts")) {
          modIncompatible += "<br>Galactic War Unique Loadouts";
        }
        if (modMounted("com.wondible.pa.section_of_foreign_intelligence")) {
          modIncompatible +=
            "<br>Section of Foreign Intelligence for Galactic War";
        }
        if (modMounted("com.pa.domdom.laser_unit_effects")) {
          modIssues += "<br>More Pew Pew";
        }
        if (modMounted("com.pa.dreadnought.angel_combat_select")) {
          modIssues += "<br>Angel Combat Select";
        }
        if (modMounted("com.pa.dreadnought.icarus_combat_select")) {
          modIssues += "<br>Icarus Combat Select";
        }
        if (modMounted("com.pa.lulamae.air-scout-select")) {
          modIssues += "<br>Air Scout Select";
        }
        if (modMounted("com.pa.grandhomie.land_scout_combat_grouping_mod")) {
          modIssues += "<br>Land Scout Combat Grouping";
        }
        if (modMounted("ca.pa.metapod.colonel_combat_grouping_mod")) {
          modIssues += "<br>Combat Colonel Selection Mod";
        }
        if (modMounted("ni.pa.Alpha.combat_fabricator_grouping_mod")) {
          modIssues += "<br>Combat Fabricator Group Deselect";
        }

        if (modIncompatible) {
          modIncompatible =
            loc(
              "!LOC:<p>The following mods you have active are known to be incompatible with Galactic War Overhaul and should be disabled:</p>"
            ) + modIncompatible;
        }
        if (modIssues) {
          modIssues =
            loc(
              "!LOC:<p>The following mods you have active can cause issues with the proper operation of Galactic War tech cards and AI and it is recommended that you disable them:</p>"
            ) + modIssues;
        }
      });
    } catch (e) {
      console.error(e);
      console.error(JSON.stringify(e));
    }
  }
  gwoModWarning();
}
