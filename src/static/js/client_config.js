function drconfig() {
    var unit = {};
    function main() {
        unit.imagePath = './static/images/';
        unit.fontPath = './static/fonts/';
        unit.stringsPath = './static/strings/';
        unit.examplesPath = './static/examples/';
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
