// could have used node-fetch, but this requires me to change all require statements to import
// got is another option, but doesn't work in the browser
const axios = require('axios');
const { StarRail, LightCone, LightConeData } = require("starrail.js");

// function related to mihomo API requests
async function getUserDashboard(uid) {
  const url = `https://api.mihomo.me/sr_info_parsed/${uid}?lang=en`;
  // pulling the images from the github repo
  const imageUrl = "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/"; 
  try {
    const response = await axios.get(url);
    // console.log(response.data);
    response.data.player.avatar.icon = imageUrl + response.data.player.avatar.icon; 
    response.data.characters.forEach(character => {
      character.preview = imageUrl + character.preview;
      character.path = imageUrl + character.path.icon;
      character.element = imageUrl + character.element.icon;
      character.light_cone.preview = imageUrl + character.light_cone.preview;
      // console.log(character.preview);
    });
    return response.data;
  } catch (error) {
    console.log(`Failed to fetch user info: ${error}`);
  }
}

// function related to Enka.Network API requests
const client = new StarRail();

async function listAllCharacters() {
  const allCharacters = client.getAllCharacters();
  const validCharacters = allCharacters.filter(c => 
    c.name.get("en") !== "{NICKNAME}");
    // console.log(validCharacters)
  
  // tried to map over validCharacters and create a new array,
  // but I was getting "converting circular structure to JSON"
  // errors, due to complex properties like client and cachedAssetsManager
  // directly modifying properties of character objects within validCharacters array
  // doesn't create any new objects with said properties
  validCharacters.forEach(character => {
    character.splashImage = character.splashImage.url;
    character.name = character.name.get();
    let description = character.description.toString();
    description = description.replace(/<unbreak>/g, '').replace(/<\/unbreak>/g, '').replace(/\\n/g, '<br>');
    character.description = description;

    character.stars = character.stars;
    character.path = character.path.name.get("en");
    character.combatType = character.combatType.name.get("en"); // character element

    // console.log(character.name);
    // console.log(character.splashImage);
    // console.log(character.description);
    // console.log(character.stars);
    // console.log(character.path);
    // console.log(character.combatType);
  });
  return validCharacters;
}

async function listAllLightCones() {
  const allLightCones = client.getAllLightCones();
  // console.log(allLightCones);
  allLightCones.forEach(LightCone => {
    LightCone.cardImage = LightCone.icon.url;
    LightCone.name = LightCone.name.get("en");
    LightCone.stars = LightCone.stars;
    LightCone.path = LightCone.path.name.get("en");
    LightCone.baseStats = LightCone.getStatsByLevel(0, 1);
    LightCone.maxStats = LightCone.getStatsByLevel(6, 80)
    let description = LightCone.description.toString();
    LightCone.description = description.replace(/\\n/g, '<br>');
    // future improvement: add superimposition stats
    
    // round stat values to whole numbers
    function roundStats(stats, type) {
      let stat = stats.find(stat => stat.type === type);
      return stat ? Math.round(stat.value) : null;
    }

    // extract BaseHP, BaseAttack, BaseDefence
    const BaseHP = roundStats(LightCone.baseStats, 'BaseHP'); 
    const BaseAttack = roundStats(LightCone.baseStats, 'BaseAttack');
    const BaseDefence = roundStats(LightCone.baseStats, 'BaseDefence');
    const MaxHP = roundStats(LightCone.maxStats, 'BaseHP');
    const MaxAttack = roundStats(LightCone.maxStats, 'BaseAttack');
    const MaxDefence = roundStats(LightCone.maxStats, 'BaseDefence');
  });
  return allLightCones;
};

module.exports = {
  getUserDashboard,
  listAllCharacters,
  listAllLightCones
}
