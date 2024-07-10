import { Konsole } from ".";

type KommandAction = (arg:any, konsole:Konsole) => Promise<any>;
export class Kommand
{
    name: string;
    description: string;
    details: string;
    action: KommandAction;

    constructor(_name:string, _description:string, _details:string, _action: KommandAction)
    {
        this.name = _name;
        this.description = _description;
        this.details = _details;
        this.action = _action;
    }
}

export const DefaultKommands = [
    new Kommand("clear", "clears the console.", null, (arg, konsole) => {
        return new Promise(async (resolve, reject)=>{
            konsole.elem.innerHTML = "";
            resolve(true);
        })
    }),
    new Kommand("help", "display all valid commands.", null, async (arg, konsole)=>{

        if(arg)
        {
            let kommand = konsole.kommands.find(k => k.name==arg);
            if(kommand)
            {
                return konsole.print(kommand.details || kommand.description);
            }
            else
            {
                return konsole.print(`'${arg}' is not a valid command.`);
            }
        }

        if(konsole.settings.animatePrint) await konsole.print("tip: you can skip text animation by pressing space.")

        let lengthOfLargestKommandName = Math.max(...konsole.kommands.map(k=>k.name.length));

        return konsole.print(...konsole.kommands.map(k=>k.name + " ".repeat(lengthOfLargestKommandName - k.name.length) + " - " + k.description));
    })
];