function dh2config() {
  var unit = {};
  function main() {
    unit.pad = true;
    unit.imagePath = "./static/images/";
    unit.fontPath = "./static/fonts/";
    unit.stringsPath = "./static/strings/";
    unit.examplesPath = "./static/examples/";
    unit.appName = "DrakonHub";
    unit.canChangeLanguage = true;
    unit.defaultLanguage = "en-us";
    unit.free = true;
    unit.fontFamily = "Arimo";
    unit.fontSize = 15;
    unit.padding = 10;
    unit.watermark = "drakonhub.com";
    unit.motherSite = "drakonhub.com";
    unit.logo = "drakosha98b.png";
    unit.wideLogo = "drakosha98b-wide.png";
    unit.showLearn = false;
    unit.baseUrl = "";
    unit.homeSite = "https://drakonhub.com/";
    unit.maxImageSizeMb = 3;
    return;
  }
  unit.main = main;
  return unit;
}
