import { Konsole } from "@husnain.taj/konsolejs"; // KonsoleJS javascript
import "@husnain.taj/konsolejs/dist/konsole.min.css"; // KonsoleJS CSS

(async ()=>{

    let konsole = new Konsole("#console");

    await konsole.print("Welcome to the Konsole!");
    await konsole.print("Check the complete docs <a href='https://github.com/HusnainTaj/KonsoleJS' target='_blank'>here</a>.");
    if(konsole.settings.animatePrint) await konsole.print("tip: you can skip text animation by pressing space.")
    
    let r = await konsole.prompt("What is your name?");

    await konsole.print("Hello " + r + "! How are you?");

    let r2 = await konsole.choice("Use Arrow keys to select and Enter to submit", [":)", ":|", ":("]);

    await konsole.print("Intersting... Try out some other commands!");

    await konsole.awaitKommand();
})();