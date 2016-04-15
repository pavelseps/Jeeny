/**
 * Jeeny version 1.0
 * 11.4.2016
 */

const readline = require('readline');
const fs = require('fs');
const open = require('open');
const rl = readline.createInterface(process.stdin, process.stdout);
const cp = require("child_process");
const ncp = require("copy-paste");

/**
 * Include js vith variables
 */
function read(f) {
    return fs.readFileSync(f).toString();
}
function include(f) {
    eval.apply(global, [read(f)]);
}


/***
 * Check default/local variable
 */
fs.access('.\\import\\variables.local.js', fs.F_OK, function(err) {
    if (!err){
        include('./import/variables.local.js');
    }else{
        include('./import/variables.js');
    }
});


/**
 * List of commands
 * For not show in help use false on "help info"
 */
var commandsList = [
    ["pomoc", false, fcPomoc],
    ["baf", false, fcBaf],
    ["konec", "ukončíš Jeeny", fcKonec],
    ["novy projekt", "Jeeny vytvoří nový projekt", fcNovyProjekt],
    ["pozdrav", "Jeeny tě pozdraví", fcPozdrav],
    ["cas", "Jeeny řekne aktuální čas", fcCas],
    ["zpravy", "Jeeny ti ukáže zprávy na idnes", fcZpravy],
    ["jira", "Jeeny otevře JIRU s otevřenýma projektama", fcJira],
    ["zabava", "Jeeny otevře 9gag", fcZabava],
    ["fonty", "Jeeny otevře google fonts", fcFonty],
    ["googli", "Jeeny bude vyhnedávat na google", fcGoogli],
    ["poznamky", "Jeeny ti pustí texťák s poznámkama", fcPoznamky],
    ["rozhodni", "Jeeny za tebe rozhodne, jestli ani nebo ne", fcRozhodni],
    ["chci pracovat", "Jeeny zapne všechny důležitý programy pro práci", fcPracuj],
    ["testuj prohlizece", "Jeeny otevře web ve všech prohlížečích", fcProhlizece],
    ["lorem ipsum", "Jeeny vloží do clipboardu část Lorem Ipsum textu", fcLorem],
    ["vhost", "Jeeny otevře soubory pro nastavení virtual hostu", fcVhost],
    ["test", false, fcTest]
];

/**
 * Functions for communication
 */

function mainCycle(readedInput){
    if(validateInput(readedInput)){
        callCommand(readedInput);
    }else{
        JeenySays("Nevím co tím myslíš");
    }
}
function validateInput(command){
    for(var i = 0; i<commandsList.length; i++){
        if(command == commandsList[i][0]){
            return true;
        }
    }
    return false;
}
function JeenySays(text){
    if(text==undefined || text==""){
        console.log("Jeeny:");
    }else{
        console.log("Jeeny:  "+text);
    }
}
function callCommand(command){
    for(var i = 0; i<commandsList.length; i++){
        if(command == commandsList[i][0]){
            commandsList[i][2]();
        }
    }
}

/**
 * Functions for commands
 */
function fcPomoc(){
    JeenySays();
    for(var i = 0; i<commandsList.length; i++){
        if(commandsList[i][1] != false){
            console.log("\t"+commandsList[i][0]+" - "+commandsList[i][1]);
        }
    }
}
function fcBaf(){
    JeenySays("Lek!");
}
function fcKonec(){
    JeenySays("Přeji hezký zbytek dne, uvidíme se přiště.");
    setTimeout(function() {
        process.exit()
    }, 2500);
}
function fcNovyProjekt(){
    var dir;
    JeenySays("Jak se má jmenovat nový projekt?");
    rl.question('Jmeno:  ', function(line) {
        dir = rootProjectDir  + line;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
            fs.mkdirSync(dir+"\\web");
            fs.mkdirSync(dir+"\\PSD");
            fs.readdir(dir);
            JeenySays("Projekt \""+line+"\" je vytvořen.");
        }else{
            JeenySays("Projekt \""+line+"\" už je vytvořen.");
        }

        JeenySays("Chceš otevřít složku s projektem?");
        askForOpenDir();
    });


    function askForOpenDir(){
        rl.question('ano/ne: ', function(line) {
            if(line=="ano"){
                open(dir);
                JeenySays("Dobře, otevírám složku s projektem");
            }else if(line=="ne"){
                JeenySays("Dobře, co dalšího si přeješ?");
            }else{
                JeenySays("Prosím, odpověz ano/ne");
                askForOpenDir();
            }
        });
    }
}
function fcPozdrav(){
    JeenySays("Ahoj, já jsem Jeeny a pokusím se ti pomoct co nejvíce příkazy.");
}
function fcCas(){
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    JeenySays();
    console.log("\t"+day + "." + month + "." + year);
    console.log("\t"+hour + ":" + min + ":" + sec);
}
function fcZpravy(){
    open(zpravy);
    JeenySays("Otevírám idnes.");
}
function fcJira(){
    open(jira);
    JeenySays("Otevírám JIRU.");
}
function fcZabava(){
    open(zabava);
    JeenySays("Otevírám 9gag.");
}
function fcFonty(){
    open('https://www.google.com/fonts');
    JeenySays("Otevírám Google Fonts.");
}
function fcGoogli(){
    JeenySays("Co si přeješ vyhledat?");
    rl.question('Googli: ', function(line) {
        var url = "https://www.google.cz/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q="+line;
        open(url);
        JeenySays("Vyhledávám na google "+line);
    });
}
function fcPoznamky(){
    cp.exec(poznamky);
    JeenySays("Otevírám poznámky.");
}
function fcRozhodni(){
    var x = Math.floor((Math.random() * 2) + 1);
    if(x==1){
        JeenySays("Myslím, že ano.");
    }else{
        JeenySays("Myslím, že ne.");
    }
}
function fcPracuj(){
    JeenySays("Jaký spustit?");
    askForPrograms();

    //ano program/ne program/zrusit/vsechny/spustit
    function askForPrograms(){
        rl.question('prace:  ', function(line) {
            if(line=="vsechny"){
                for(var i = 0;i<programsForWork.length;i++){
                    programsForWork[i][2]=true;
                }
                JeenySays("Všechny programy jsou nastaveny na \"ano\"");
                askForPrograms();

            } else if(line=="spustit"){
                for(var i = 0;i<programsForWork.length;i++){
                    if(programsForWork[i][2]==true){
                        JeenySays("Spouštím program: "+programsForWork[i][0]);
                        open(programsForWork[i][1]);
                    }
                    programsForWork[i][2] = false;
                }

            } else if (line=="zrusit"){
                for(var i = 0;i<programsForWork.length;i++){
                    programsForWork[i][2]=false;
                }
                JeenySays("Všechny programy jsou nastaveny na \"ne\"");
                askForPrograms();

            } else if (line=="vypis"){
                for(var i = 0;i<programsForWork.length;i++){
                    if(programsForWork[i][2]==true){
                        console.log("Ano - "+programsForWork[i][0]);
                    }else{
                        console.log("Ne  - "+programsForWork[i][0]);
                    }
                }
                askForPrograms();

            } else if (line.indexOf("ano ") > -1){
                var name = line.split(' ')[1];
                var error = true;
                for(var i = 0;i<programsForWork.length;i++){
                    if(programsForWork[i][0]==name){
                        programsForWork[i][2]=true;
                        error = false;
                    }
                }

                if(error==true){
                    JeenySays("Program nenalezen.");
                }else{
                    JeenySays(name+" jsi nastavil na \"ano\"");
                }
                askForPrograms();

            } else if (line.indexOf("ne ") > -1){
                var name = line.split(' ')[1];
                var error = true;
                for(var i = 0;i<programsForWork.length;i++){
                    if(programsForWork[i][0]==name){
                        programsForWork[i][2]=false;
                        error = false;
                    }
                }

                if(error==true){
                    JeenySays("Program nenalezen.");
                }else{
                    JeenySays(name+" jsi nastavil na \"ne\"");
                }
                askForPrograms();

            }else{
                JeenySays("Prosím, použíjte příkazy: ano program/ne program/zrusit/vsechny/spustit/vypis");
                askForPrograms();
            }
        });
    }
}
function fcProhlizece(){
    JeenySays("Zadej url stránky:");
    rl.question('url:    ', function(line) {
        open(line, "chrome");
        open(line, "firefox");
        open(line, "safari");
        open(line, "iexplore");
        JeenySays("Všechny prohlížeče se otevírají.");
    });
}
function fcTest(){
    console.log("aktualně nemám co testovat");
}
function fcLorem(){
    ncp.copy('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis condimentum augue id magna semper rutrum. In dapibus augue non sapien. Nullam justo enim, consectetuer nec, ullamcorper ac, vestibulum in, elit. Etiam posuere lacus quis dolor. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Nullam feugiat, turpis at pulvinar vulputate, erat libero tristique tellus, nec bibendum odio risus sit amet ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Curabitur sagittis hendrerit ante. Integer imperdiet lectus quis justo. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Nullam sapien sem, ornare ac, nonummy non, lobortis a enim. Nullam justo enim, consectetuer nec, ullamcorper ac, vestibulum in, elit. Nullam sapien sem, ornare ac, nonummy non, lobortis a enim.', function () {
        JeenySays("Lorem Ipsum je vloženo do clipboardu.");
    })
}
function fcVhost() {
    cp.exec(httpd_vhosts);
    JeenySays("Otevírám soubor httpd-vhosts.");
    open(win_host);
    JeenySays("Otevírám složku s hosts.");
}

/**
 * Main
 */
JeenySays("Ahoj, co pak si přeješ?");
rl.on('line', function(line) {
    mainCycle(line.toString().trim());
});