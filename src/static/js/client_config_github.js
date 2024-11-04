function drconfig() {
    var unit = {};
    function main() {
        unit.imagePath = 'src/static/images/';
        unit.fontPath = 'src/static/fonts/';
        unit.stringsPath = 'src/static/strings/';
        unit.examplesPath = 'src/static/examples/';
        unit.appName = 'DrakonHub';
        unit.canChangeLanguage = true;
        unit.defaultLanguage = 'en-us';
        unit.free = true;
        unit.fontFamily = 'Arimo';
        unit.fontSize = 15;
        unit.padding = 10;
        unit.watermark = "drakonhub.com"
        unit.motherSite = "drakonhub.com"
        unit.wideLogo = "drakosha98b-wide.png"
        unit.showLearn = false        
        return;
    }
    unit.main = main;
    return unit;
}
