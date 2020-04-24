
mongo HummusDB --eval "db.scenario.remove({})"
mongo HummusDB --eval "db.scenarioFiles.remove({})"
mongo HummusDB --eval "db.scenario.insert({tal:{}, shahar: {}})"




