/* micropolisJS. Adapted from Micropolis by Graeme McCutcheon.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 */

define(['BaseTool', 'Messages', 'Text', 'Tile'],
       function(BaseTool, Messages, Text, Tile) {
  "use strict";

  function QueryTool(map) {
    this.init(0, map, false, false);
  }


  // Keep in sync with QueryWindow
  var debug = true;

  BaseTool.makeTool(QueryTool);


  QueryTool.prototype.classifyPopulationDensity = function(x, y, blockMaps) {
    var density = blockMaps.populationDensityMap.worldGet(x, y);
    if (debug)
      $('#queryDensityRaw').text(density);
    density = density >> 6;
    density = density & 3;
    $('#queryDensity').text(Text.densityStrings[density]);
  };


  QueryTool.prototype.classifyLandValue = function(x, y, blockMaps) {
     var landValue = blockMaps.landValueMap.worldGet(x, y);
     if (debug)
       $('#queryLandValueRaw').text(landValue);

     var i = 0;
     if (landValue >= 150)
       i = 3;
     else if (landValue >= 80)
       i = 2;
     else if (landValue >= 30)
       i = 1;

     var text = Text.landValueStrings[i];
     $('#queryLandValue').text(text);
  };


  QueryTool.prototype.classifyCrime = function(x, y, blockMaps) {
    var crime = blockMaps.crimeRateMap.worldGet(x, y);
    if (debug)
      $('#queryCrimeRaw').text(crime);
    crime = crime >> 6;
    crime = crime & 3;
    $('#queryCrime').text(Text.crimeStrings[crime]);
  };


  QueryTool.prototype.classifyPollution = function(x, y, blockMaps) {
    var pollution = blockMaps.pollutionDensityMap.worldGet(x, y);
    if (debug)
      $('#queryPollutionRaw').text(pollution);
    pollution = pollution >> 6;
    pollution = pollution & 3;
    $('#queryPollution').text(Text.pollutionStrings[pollution]);
  };


  QueryTool.prototype.classifyRateOfGrowth = function(x, y, blockMaps) {
    var rate = blockMaps.rateOfGrowthMap.worldGet(x, y);
    if (debug)
      $('#queryRateRaw').text(rate);
    rate = rate >> 6;
    rate = rate & 3;
    $('#queryRate').text(Text.rateStrings[rate]);
  };


  QueryTool.prototype.classifyDebug = function(x, y, blockMaps) {
    if (!debug)
      return;
    $('#queryFireStationRaw').text(blockMaps.fireStationMap.worldGet(x, y));
    $('#queryFireStationEffectRaw').text(blockMaps.fireStationEffectMap.worldGet(x, y));
    $('#queryPoliceStationRaw').text(blockMaps.policeStationMap.worldGet(x, y));
    $('#queryPoliceStationEffectRaw').text(blockMaps.policeStationEffectMap.worldGet(x, y));
    $('#queryTerrainDensityRaw').text(blockMaps.terrainDensityMap.worldGet(x, y));
    $('#queryTrafficDensityRaw').text(blockMaps.trafficDensityMap.worldGet(x, y));
    $('#queryComRateRaw').text(blockMaps.comRateMap.worldGet(x, y));
  };


  QueryTool.prototype.classifyZone = function(x, y) {
    var baseTiles = [
        Tile.DIRT, Tile.RIVER, Tile.TREEBASE, Tile.RUBBLE,
        Tile.FLOOD, Tile.RADTILE, Tile.FIRE, Tile.ROADBASE,
        Tile.POWERBASE, Tile.RAILBASE, Tile.RESBASE, Tile.COMBASE,
        Tile.INDBASE, Tile.PORTBASE, Tile.AIRPORTBASE, Tile.COALBASE,
        Tile.FIRESTBASE, Tile.POLICESTBASE, Tile.STADIUMBASE, Tile.NUCLEARBASE,
        Tile.HBRDG0, Tile.RADAR0, Tile.FOUNTAIN, Tile.INDBASE2,
        Tile.FOOTBALLGAME1, Tile.VBRDG0, 952];

    var tileValue = this._map.getTileValue(x, y);
    if (tileValue >= Tile.COALSMOKE1 && tileValue < Tile.FOOTBALLGAME1)
      tileValue = Tile.COALBASE;

    var index = 0;
    for (var index = 0, l = baseTiles.length - 1; index < l; index++) {
      if (tileValue < baseTiles[index + 1])
        break;
    }

    $('#queryZoneType').text(Text.zoneTypes[index]);
  };


  QueryTool.prototype.doTool = function(x, y, messageManager, blockMaps) {
    var text = 'Position (' + x + ', ' + y + ')';
    text += ' TileValue: ' + this._map.getTileValue(x, y);

    if (debug) {
      var tile = this._map.getTile(x, y);
      $('#queryTile').text([x,y].join(', '));
      $('#queryTileValue').text(tile.getValue());
      $('#queryTileBurnable').text(tile.isCombustible());
      $('#queryTileBulldozable').text(tile.isBulldozable());
      $('#queryTileCond').text(tile.isConductive());
      $('#queryTileAnim').text(tile.isAnimated());
      $('#queryTilePowered').text(tile.isPowered());
    }

    this.classifyZone(x, y);
    this.classifyPopulationDensity(x, y, blockMaps);
    this.classifyLandValue(x, y, blockMaps);
    this.classifyCrime(x, y, blockMaps);
    this.classifyPollution(x, y, blockMaps);
    this.classifyRateOfGrowth(x, y, blockMaps);
    this.classifyDebug(x, y, blockMaps);

    messageManager.sendMessage(Messages.QUERY_WINDOW_NEEDED);

    this.result = this.TOOLRESULT_OK;
  };


  return QueryTool;
});
