define([
  "shared/gw_common",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/units.js",
  "coui://ui/mods/com.pa.quitch.gwaioverhaul/shared/ai.js",
], function (GW, gwoUnit, gwoAI) {
  var clusterArmyIndex = function (ai) {
    if (ai.faction === 4) {
      return 0;
    } else if (ai.foes) {
      var index = _.findIndex(ai.foes, { faction: [4] });
      if (index !== -1) {
        return index + 1;
      }
    }
    return -1;
  };

  var combineSpecs = function (baseSpecs, newSpecs) {
    return baseSpecs.concat(newSpecs);
  };

  /* start of gw_spec.js replacements */
  function tagSpec(tag, spec) {
    var moreWork = [];
    if (!_.isObject(spec)) {
      return moreWork;
    }

    var applyTag = function (obj, key) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (_.isString(obj[key])) {
          moreWork.push(obj[key]);
          obj[key] = obj[key] + tag;
        } else if (_.isArray(obj[key])) {
          obj[key] = _.map(obj[key], function (value) {
            moreWork.push(value);
            return value + tag;
          });
        }
      }
    };

    // Units
    applyTag(spec, "base_spec");
    if (spec.tools) {
      _.forEach(spec.tools, function (tool) {
        applyTag(tool, "spec_id");
      });
    }
    applyTag(spec, "replaceable_units");
    applyTag(spec, "buildable_projectiles");
    if (spec.factory && _.isString(spec.factory.initial_build_spec)) {
      applyTag(spec.factory, "initial_build_spec");
    }

    // Tools
    if (spec.ammo_id) {
      if (_.isString(spec.ammo_id)) {
        applyTag(spec, "ammo_id");
      } else {
        _.forEach(spec.ammo_id, function (ammo) {
          applyTag(ammo, "id");
        });
      }
    }

    if (spec.death_weapon) {
      if (_.isString(spec.death_weapon.ground_ammo_spec)) {
        applyTag(spec.death_weapon, "ground_ammo_spec");
      }

      if (_.isString(spec.death_weapon.air_ammo_spec)) {
        applyTag(spec.death_weapon, "air_ammo_spec");
      }
    }

    if (_.isString(spec.spawn_unit_on_death)) {
      applyTag(spec, "spawn_unit_on_death");
    }

    return moreWork;
  }

  var genUnitSpecs = function (units, tag) {
    if (!tag) {
      return null;
    }

    var result = $.Deferred();
    var results = {};
    var work = units.slice(0);

    var finish = _.once(function () {
      results["/pa/units/unit_list.json" + tag] = {
        units: _.map(units, function (unit) {
          return unit + tag;
        }),
      };
      result.resolve(results);
    });

    var step = function () {
      var item;
      var pending = 0;
      var fetch = function (filePath) {
        $.ajax({
          url: "coui:/" + filePath,
          success: function (data) {
            try {
              data = JSON.parse(data);
            } catch (e) {
              // empty
            }
            var newWork = tagSpec(tag, data);
            work = work.concat(newWork);
            results[filePath + tag] = data;
          },
          error: function (request, status, error) {
            console.log(
              "error loading spec:",
              filePath,
              request,
              status,
              error
            );
          },
          complete: function () {
            --pending;
            if (!pending) {
              _.delay(step);
            }
          },
        });
      };
      while (work.length) {
        item = work.pop();
        if (Object.prototype.hasOwnProperty.call(results, item + tag)) {
          continue;
        }
        ++pending;
        fetch(item);
      }
      if (!pending) {
        _.delay(finish);
      }
    };
    step();

    return result;
  };

  var flattenBaseSpecs = function (spec, specs, tag) {
    if (!Object.prototype.hasOwnProperty.call(spec, "base_spec")) {
      return spec;
    }

    var base = specs[spec.base_spec];
    if (!base) {
      base = specs[spec.base_spec + tag];
      if (!base) {
        return spec;
      }
    }

    spec = _.cloneDeep(spec);
    delete spec.base_spec;

    base = flattenBaseSpecs(base, specs, tag);

    return _.merge({}, base, spec);
  };

  var modSpecs = function (specs, mods, specTag) {
    var load = function (specId) {
      var taggedId = specId;
      if (!Object.prototype.hasOwnProperty.call(specs, taggedId)) {
        taggedId = specId + specTag;
        if (!Object.prototype.hasOwnProperty.call(specs, taggedId)) {
          return null;
        }
      }
      var result = specs[taggedId];
      if (result) {
        specs[taggedId] = result = flattenBaseSpecs(result, specs, specTag);
      }
      return result;
    };

    var ops = {
      multiply: function (attribute, value) {
        return !_.isUndefined(attribute) ? attribute * value : value;
      },
      add: function (attribute, value) {
        return !_.isUndefined(attribute) ? attribute + value : value;
      },
      replace: function (attribute, value) {
        return value;
      },
      merge: function (attribute, value) {
        return _.assign({}, attribute, value);
      },
      push: function (attribute, value) {
        if (!_.isArray(attribute)) {
          attribute = _.isEmpty(attribute) ? [] : [attribute];
        }
        if (_.isArray(value)) {
          attribute = attribute.concat(value);
        } else {
          attribute.push(value);
        }
        return attribute;
      },
      eval: function (attribute, value) {
        return new Function("attribute", value)(attribute);
      },
      clone: function (attribute, value) {
        var loaded = load(attribute);
        if (loaded) {
          loaded = _.cloneDeep(loaded);
        }
        specs[value + specTag] = loaded || attribute;
      },
      tag: function (attribute) {
        // hack fix for mirrorMode due to the fact that
        // `attribute` was retaining the previous `specTag`s
        // and I couldn't track down why
        var cleanAttribute = attribute.slice(
          0,
          attribute.lastIndexOf(".json") + 5
        );
        return cleanAttribute + specTag;
      },
      pull: function (attribute, value) {
        if (!_.isArray(attribute)) {
          attribute = _.isEmpty(attribute) ? [] : [attribute];
        }
        var args = [];
        if (_.isArray(value)) {
          args = [attribute].concat(value);
        } else {
          args = [attribute, value];
        }
        return _.pull.apply(this, args);
      },
      // New op to remove text in a string
      wipe: function (attribute, value) {
        if (!_.isString(attribute)) {
          attribute = attribute.toString();
        }
        if (!_.isArray(value)) {
          value = [value, ""];
        }
        return attribute.replace(value[0], value[1]);
      },
      // New op to prepend to arrays
      prepend: function prepend(attribute, value) {
        if (!_.isArray(attribute)) {
          attribute = _.isEmpty(attribute) ? [] : [attribute];
        }
        attribute.unshift(value);
        if (_.isArray(value)) {
          attribute = _.flatten(attribute);
        }
        return attribute;
      },
    };

    var applyMod = function (mod) {
      var spec = load(mod.file);
      if (!spec) {
        return console.warn("Warning: File not found in mod", mod);
      }
      if (!Object.prototype.hasOwnProperty.call(ops, mod.op)) {
        return console.error("Invalid operation in mod", mod);
      }

      var originalPath = (mod.path || "").split(".");
      var path = originalPath.reverse();

      var reportError = function (error, step) {
        console.error(
          error,
          spec[step],
          "spec",
          spec,
          "mod",
          mod,
          "path",
          originalPath.slice(0, -path.length).join(".")
        );
        return undefined;
      };

      var cookStep = function (step) {
        if (_.isArray(spec)) {
          if (step === "+") {
            step = spec.length;
            spec.push({});
          } else {
            step = Number(step);
          }
        } else if (
          path.length &&
          !Object.prototype.hasOwnProperty.call(spec, step)
        ) {
          spec[step] = {};
        }
        return step;
      };

      while (path.length > 1) {
        var level = path.pop();
        cookStep(level);

        if (_.isString(spec[level])) {
          var newSpec = load(spec[level]);
          if (!newSpec) {
            return reportError("Undefined mod spec encountered,", level);
          }
          spec = newSpec;
        } else if (_.isObject(spec[level])) {
          spec = spec[level];
        } else {
          return reportError("Invalid attribute encountered,", level);
        }
      }

      if (path.length && path[0]) {
        var leaf = cookStep(path[0]);
        spec[leaf] = ops[mod.op](spec[leaf], mod.value);
      } else {
        ops[mod.op](spec, mod.value);
      }
    };
    _.forEach(mods, applyMod);
  };
  /* end of gw_spec.js replacements */

  // global for modder compatibility
  if (!model.gwoSpecs) {
    model.gwoSpecs = [];
  }
  // files not assigned by default that we wish to mod
  model.gwoSpecs.push(
    gwoUnit.fireflyAmmo,
    gwoUnit.fireflyWeapon,
    gwoUnit.orcaTorpedo,
    gwoUnit.orcaTorpedoAmmo,
    gwoUnit.skitterAmmo,
    gwoUnit.skitterWeapon
  );

  return function () {
    var self = this;

    // Game file generation cannot use previously mounted files.  That would be bad.
    var done = $.Deferred();

    // community mods will hook unmountAllMemoryFiles to remount client mods
    api.file.unmountAllMemoryFiles().always(function () {
      var titans = api.content.usingTitans();

      var game = self.game();
      var ai = game.galaxy().stars()[game.currentStar()].ai();
      var aiFactionCount = ai.foes ? 1 + ai.foes.length : 1;
      var aiTag = [];
      var aiFactions = [];
      _.times(aiFactionCount, function (n) {
        var aiNewTag = ".ai" + n;
        aiTag.push(aiNewTag);
        aiFactions.push($.Deferred());
      });

      var playerFileGen = $.Deferred();
      var filesToProcess = [playerFileGen];

      var aiUnitMapPath = "/pa/ai/unit_maps/ai_unit_map.json";
      var aiUnitMapTitansPath = "/pa/ai/unit_maps/ai_unit_map_x1.json";
      var aiBrain = gwoAI.aiInUse();

      if (aiBrain === "Queller") {
        aiUnitMapPath = "/pa/ai_queller/q_uber/unit_maps/ai_unit_map.json";
        aiUnitMapTitansPath =
          "/pa/ai_queller/q_uber/unit_maps/ai_unit_map_x1.json";
      } else if (aiBrain === "Penchant") {
        aiUnitMapPath = "/pa/ai_penchant/unit_maps/ai_unit_map.json";
        aiUnitMapTitansPath = "/pa/ai_penchant/unit_maps/ai_unit_map_x1.json";
      }

      var unitsLoad = $.get("spec://pa/units/unit_list.json");
      var aiMapLoad = $.get("spec:/" + aiUnitMapPath);
      var aiX1MapLoad = titans ? $.get("spec:/" + aiUnitMapTitansPath) : {};
      $.when(unitsLoad, aiMapLoad, aiX1MapLoad).then(function (
        unitsGet,
        aiMapGet,
        aiX1MapGet
      ) {
        var inventory = self.game().inventory();

        var units = parse(unitsGet[0]).units;
        var aiUnitMap = parse(aiMapGet[0]);
        var aiX1UnitMap = parse(aiX1MapGet[0]);
        var clusterUnitMapPath = "/pa/ai_cluster/unit_maps/ai_unit_map.json";
        var clusterUnitMapTitansPath =
          "/pa/ai_cluster/unit_maps/ai_unit_map_x1.json";
        _.times(aiFactionCount, function (n) {
          var currentCount = n;
          var enemyAIUnitMap = GW.specs.genAIUnitMap(aiUnitMap, aiTag[n]);
          var enemyX1AIUnitMap = GW.specs.genAIUnitMap(aiX1UnitMap, aiTag[n]);
          var aiSpecs = combineSpecs(units, model.gwoSpecs);

          genUnitSpecs(aiSpecs, aiTag[n]).then(function (aiSpecFiles) {
            var unitMapPath = aiUnitMapPath;
            var unitMapTitansPath = aiUnitMapTitansPath;
            if (clusterArmyIndex(ai) === currentCount) {
              unitMapPath = clusterUnitMapPath;
              unitMapTitansPath = clusterUnitMapTitansPath;
            }

            var enemyAIUnitMapFile = unitMapPath + aiTag[n];
            var enemyAIUnitMapPair = {};
            enemyAIUnitMapPair[enemyAIUnitMapFile] = enemyAIUnitMap;
            var enemyX1AIUnitMapFile = unitMapTitansPath + aiTag[n];
            var enemyX1AIUnitMapPair = {};
            enemyX1AIUnitMapPair[enemyX1AIUnitMapFile] = enemyX1AIUnitMap;
            var aiFilesClassic = _.assign(enemyAIUnitMapPair, aiSpecFiles);
            var aiFilesX1 = titans
              ? _.assign(enemyX1AIUnitMapPair, aiSpecFiles)
              : {};
            var aiFiles = _.assign({}, aiFilesClassic, aiFilesX1);

            if (ai.inventory) {
              var aiInventory =
                currentCount === 0
                  ? ai.inventory
                  : ai.foes[currentCount - 1].inventory;
              if (ai.mirrorMode === true) {
                aiInventory = aiInventory.concat(inventory.mods());
              }
              modSpecs(aiFiles, aiInventory, aiTag[n]);
            }
            aiFactions[currentCount].resolve(aiFiles);
          });
        });

        var playerTag = ".player";

        var playerAIUnitMap = GW.specs.genAIUnitMap(aiUnitMap, playerTag);
        var playerX1AIUnitMap = titans
          ? GW.specs.genAIUnitMap(aiX1UnitMap, playerTag)
          : {};
        var additionalPlayerSpecs = _.isUndefined(ai.ally)
          ? model.gwoSpecs
          : model.gwoSpecs.concat(ai.ally.commander);
        var playerSpecs = combineSpecs(
          inventory.units(),
          additionalPlayerSpecs
        );

        genUnitSpecs(playerSpecs, playerTag).then(function (playerSpecFiles) {
          var playerFilesClassic = {};
          var playerFilesX1 = {};
          var playerIsCluster =
            inventory.getTag("global", "playerFaction") === 4;
          // the order of unit_map assignments must match getAIPath()
          if (playerIsCluster) {
            playerFilesClassic = _.assign(
              {
                "/pa/ai_cluster/unit_maps/ai_unit_map.json.player":
                  playerAIUnitMap,
              },
              playerSpecFiles
            );
            playerFilesX1 = titans
              ? _.assign(
                  {
                    "/pa/ai_cluster/unit_maps/ai_unit_map_x1.json.player":
                      playerX1AIUnitMap,
                  },
                  playerSpecFiles
                )
              : {};
          } else if (
            aiBrain === "Queller" &&
            _.some(inventory.cards(), {
              id: "gwaio_upgrade_subcommander_tactics",
            })
          ) {
            playerFilesClassic = _.assign(
              {
                "/pa/ai_queller/q_gold/unit_maps/ai_unit_map.json.player":
                  playerAIUnitMap,
              },
              playerSpecFiles
            );
            playerFilesX1 = titans
              ? _.assign(
                  {
                    "/pa/ai_queller/q_gold/unit_maps/ai_unit_map_x1.json.player":
                      playerX1AIUnitMap,
                  },
                  playerSpecFiles
                )
              : {};
          } else if (aiBrain === "Queller") {
            playerFilesClassic = _.assign(
              {
                "/pa/ai_queller/q_silver/unit_maps/ai_unit_map.json.player":
                  playerAIUnitMap,
              },
              playerSpecFiles
            );
            playerFilesX1 = titans
              ? _.assign(
                  {
                    "/pa/ai_queller/q_silver/unit_maps/ai_unit_map_x1.json.player":
                      playerX1AIUnitMap,
                  },
                  playerSpecFiles
                )
              : {};
          } else if (!_.isEmpty(inventory.aiMods()) && ai.mirrorMode !== true) {
            playerFilesClassic = _.assign(
              {
                "/pa/ai_tech/unit_maps/ai_unit_map.json.player":
                  playerAIUnitMap,
              },
              playerSpecFiles
            );
            playerFilesX1 = titans
              ? _.assign(
                  {
                    "/pa/ai_tech/unit_maps/ai_unit_map_x1.json.player":
                      playerX1AIUnitMap,
                  },
                  playerSpecFiles
                )
              : {};
          } else if (aiBrain === "Penchant") {
            playerFilesClassic = _.assign(
              {
                "/pa/ai_penchant/unit_maps/ai_unit_map.json.player":
                  playerAIUnitMap,
              },
              playerSpecFiles
            );
            playerFilesX1 = titans
              ? _.assign(
                  {
                    "/pa/ai_penchant/unit_maps/ai_unit_map_x1.json.player":
                      playerX1AIUnitMap,
                  },
                  playerSpecFiles
                )
              : {};
          } else {
            playerFilesClassic = _.assign(
              {
                "/pa/ai/unit_maps/ai_unit_map.json.player": playerAIUnitMap,
              },
              playerSpecFiles
            );
            playerFilesX1 = titans
              ? _.assign(
                  {
                    "/pa/ai/unit_maps/ai_unit_map_x1.json.player":
                      playerX1AIUnitMap,
                  },
                  playerSpecFiles
                )
              : {};
          }
          var playerFiles = _.assign({}, playerFilesClassic, playerFilesX1);
          modSpecs(playerFiles, inventory.mods(), playerTag);
          playerFileGen.resolve(playerFiles);
        });
      });

      _.times(aiFactionCount, function (n) {
        filesToProcess.push(aiFactions[n]);
      });

      $.when.apply($, filesToProcess).always(function () {
        self.files(_.assign.apply(_, arguments));
        done.resolve();
      });
    });
    return done.promise();
  };
});
