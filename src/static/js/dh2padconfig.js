function dh2padconfig() {
    var unit = {};
    function main() {
        unit.imagePath = '/gen/drakonhub/static/images/';
        unit.fontPath = '/gen/drakonhub/static/fonts/';
        unit.stringsPath = '/gen/drakonhub/static/strings/';
        unit.examplesPath = '/gen/drakonhub/static/examples/';
        unit.appName = 'DrakonHub Test';
        unit.baseUrl = 'https://app.drakon.tech';
        unit.canChangeLanguage = true;
        unit.documentation = 'https://drakon.tech/';
        unit.siteRoot = 'https://drakon.tech/';
        unit.defaultLanguage = 'ru';
        unit.privacy = 'https://drakon.tech/read/programming_in_drakon';
        unit.free = true;
        unit.fontFamily = 'Arimo';
        unit.fontSize = 15;
        unit.logo = 'log-hor-98-sq.png';
        unit.wideLogo = 'log-hor-98.png';
        unit.padding = 10;
        unit.watermark = 'drakonpro.ru';
        unit.showLog = false;
        unit.groups = true;
        unit.appRoot = 'https://app.drakon.tech/gen/B30TJKVWW4Ye4Zg7eSapaWiYl5azoWCP/dh2app';
        return;
    }
    unit.main = main;
    return unit;
}
if (typeof module != 'undefined') {
    module.exports = dh2padconfig;
}