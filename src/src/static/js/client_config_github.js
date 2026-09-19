function dh2config() {
    var unit = {};
    function main() {
        unit.debug = true;
        unit.showBackButton = false;
        unit.pad = true;
        unit.imagePath = "src/src/static/images/";
		  unit.wideMenuIcon = "start_menu_drakosha.png"
        unit.fontPath = "src/src/static/fonts/";
        unit.stringsPath = "src/src/static/strings/";
        unit.examplesPath = "src/src/static/examples/";
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
        unit.showToolTips = true;
        return;
    }
    unit.main = main;
    return unit;
}
