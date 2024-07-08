// TODO:
// + Events: onPrint, onWrongKommand etc
// + case insensitive commands option
// + better konsoleSettings implementation
// Done
// + refactor lambda functions in event listeners so only our listener is removed when using $0.off("keydown")
// + use input element for input instead of div

class Helpers
{
    static konsoleLineMarkup(prefix:string) :string
    {
        return `<pre class="KonsoleLine"><span class="KonsolePrefix">${prefix} </span><span class="KonsoleLineText"></span></pre>`;
    }

    static konsoleParaMarkup() :string
    { 
        return `<pre class="KonsolePara"><span class="KonsoleParaText"></span></pre>`;
    }

    static konsoleChoiceMarkup(lis:any) :string
    {
        return `<pre><ul class="KonsoleChoice">${lis}</ul></pre>`;
    }
}

export class KonsoleSettings
{
    prefix: string = "$";
    animatePrint: boolean = true;
    printLetterInterval: number = 25;
    registerDefaultKommands: boolean = true;
}

type KommandAction = (arg:any) => Promise<any>;
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

export class Konsole 
{
    settings: KonsoleSettings = undefined;
    elem: HTMLElement|null = undefined;
    inputElem: HTMLInputElement|null = undefined;
    kommands: Kommand[] = [];

    validInput: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 !@#$%^&*()-_=+~`?.><,|/\\";

    constructor(selector: string, settings: KonsoleSettings = new KonsoleSettings()) 
    {
        this.settings = settings;

        this.elem = document.querySelector(selector);

        if(this.elem == null)
        {
            console.error(`element`, selector, "wasnt found.");
            return;
        }

        this.elem.classList.add("Konsole");
        this.elem.setAttribute("tabindex", "0");

        // Prevent browser from scrolling when pressing arrow keys or space bar
        window.addEventListener("keydown", (e)=> {
            if(document.activeElement != this.inputElem && ["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) 
            {
                e.preventDefault();
            }
        }, false);

        // Prevent enter key from opening a link after it is focused once by clicking on it
        // $(this.elem).on('keydown',"a", function(e)
        // {
        //     if(e.which === 13) // enter
        //     {
        //         $(e.currentTarget).blur();
        //         e.preventDefault(); //prevent the default behavoir
        //     }
        // });
        this.elem.addEventListener('keydown', function(e) {
            if (e.which === 13 && (e.target as HTMLElement).tagName === 'A') 
            {
                (e.target as HTMLElement).blur();
                e.preventDefault();
            }
        });

        // Add input element
        // this.elem.insertAdjacentHTML("beforeend", `<input type="text" id="konsoleInput" disabled>`);
        this.elem.insertAdjacentHTML("afterend", `<textarea id="konsoleInput" disabled></textarea>`);
        this.inputElem = document.body.querySelector("#konsoleInput");
        this.elem.addEventListener('focus', (e) =>
        {
            this.inputElem.focus();
        });


        // Automatically Scroll to the bottom when new child is added
        const observer = new MutationObserver((mutationsList, observer) => {
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // console.log('A child node has been added or removed.', mutation.addedNodes.);
                    this.scrollToBottom();
                }
            }
        });

        observer.observe(this.elem, { attributes: false, childList: true, subtree: false });

        if(this.settings.registerDefaultKommands) this.registerDefaultKommands();
    }

    registerDefaultKommands()
    {
        this.kommands.push(new Kommand("clear", "clears the console.", null, (arg) => new Promise(async (resolve, reject)=>{
            this.elem.innerHTML = "";
            resolve(true);
        })));

        this.kommands.push(new Kommand("help", "display all valid commands.", null, async (arg)=>{

            if(arg)
            {
                let kommand = this.kommands.find(k => k.name==arg);
                if(kommand)
                {
                    return this.print(kommand.details || kommand.description);
                }
                else
                {
                    return this.print(`'${arg}' is not a valid command.`);
                }
            }

            if(this.settings.animatePrint) await this.print("tip: you can skip text animation by pressing space.")

            let lengthOfLargestKommandName = Math.max(...this.kommands.map(k=>k.name.length));

            return this.print(this.kommands.map(k=>k.name + " ".repeat(lengthOfLargestKommandName - k.name.length) + " - " + k.description));
        }));
    }

    registerKommand(kommand:Kommand)
    {
        // TODO: add check for if kommand with same name already exists

        if(kommand && kommand.name && kommand.description && kommand.action) this.kommands.push(kommand);
    }

    removeKommand(name:string)
    {
        this.kommands = this.kommands.filter(k => k.name !== name);
    }

    private controller = new AbortController;
    getInput():Promise<string>
    {
        return new Promise((resolve, reject)=>{

            this.elem.insertAdjacentHTML("beforeend", Helpers.konsoleLineMarkup(this.settings.prefix));
            let lastLine = Array.from(document.querySelectorAll(".KonsoleLine")).pop().querySelector("span.KonsoleLineText");
            
            this.initController();

            this.inputElem.disabled = false;
            this.inputElem.value = "";
            this.inputElem.focus();

            this.inputElem.addEventListener("input", async (e:InputEvent) => 
            {
                console.log(e);
                
                if (e.inputType === "insertLineBreak") // Enter key
                {
                    this.inputElem.disabled = true;
                    this.controller.abort();

                    // trim and replace multiple spaces with only a single one
                    let cl = this.inputElem.value.trim().replace( /  +/g, "");

                    resolve(cl);
                }
                else
                {
                    lastLine.textContent = this.inputElem.value;
                }
            }, {signal: this.controller.signal});
        });
    }

    async awaitKommand()
    {
        let cl = await this.getInput();

        let command = "";
        let arg = "";

        if(cl.indexOf(" ") == -1)
            command = cl;
        else
        {
            command = cl.substr(0,cl.indexOf(" "));
            arg = cl.substr(cl.indexOf(" ")+1);
        }
        
        let kommand = this.kommands.find(k => k.name==command);

        if(kommand)
            await kommand.action(arg)
        else
            await this.print("invalid command.")

        this.awaitKommand();
    }

    print(texts: string|string[])
    {
        if(!Array.isArray(texts)) texts = [texts];

        // Disable user input
        // document.body.removeEventListener("keydown", BodyKeydownCallback);

        return new Promise((resolve, reject)=>{

            if(!(texts as string[]).join("\n").trim())
            {
                reject("Empty Text.");
                return;
            }

            // Append new Konsole Para Markup
            this.elem.insertAdjacentHTML("beforeend", Helpers.konsoleParaMarkup());

            const LastKonsolePara = Array.from(document.querySelectorAll(".KonsolePara")).pop().querySelector(".KonsoleParaText");

            // input in HTML
            const htmlToPrint = (texts as string[]).join("\n");

            // Temporary elem to convert HTML to simple Text
            const tempHtmlElem = document.createElement("div");
            tempHtmlElem.innerHTML = htmlToPrint;

            // input in simple text
            const textToPrint = tempHtmlElem.textContent;

            if(this.settings.animatePrint)
            {
                let i = 0;
                const lineInter = setInterval(() => {

                    LastKonsolePara.textContent = LastKonsolePara.textContent + textToPrint[i];
                    i++;
        
                    if(i >= textToPrint.length)
                    {
                        LastKonsolePara.innerHTML = htmlToPrint;
                        clearInterval(lineInter);
                        this.controller.abort();
                        resolve("Printed animately");
                    }

                }, this.settings.printLetterInterval);

                // Skip the animation if user presses space
                this.initController();

                document.body.addEventListener("keydown", (e)=>{
                    if (e.code === "Space")
                    {
                        LastKonsolePara.innerHTML = htmlToPrint;
                        clearInterval(lineInter);
                        this.controller.abort();
                        resolve("Printed animately (interrupted)");
                    }
                }, {signal: this.controller.signal});
            }
            else
            {
                LastKonsolePara.innerHTML = htmlToPrint;

                resolve("Printed non-animately");
            }
        });
    }

    async input(question:string)
    {
        await this.print(question + "\n");

        return await this.getInput();
    }

    async choice(question:string, choices:string[]): Promise<string>
    {
        await this.print(question);

        this.initController();

        let lis = "";
        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];

            lis += `<li ${ i == 0 ? "class='active'" : ""}>${choice}</li>`;
        }

        this.elem.insertAdjacentHTML("beforeend", Helpers.konsoleChoiceMarkup(lis));
       
        return new Promise((resolve, reject)=>{

            const lastChoices = Array.from(document.querySelectorAll("ul.KonsoleChoice")).pop();

            this.elem.addEventListener("keyup", (e:KeyboardEvent)=>
            {
                if(e.code === "ArrowDown")
                {
                    let nextLiIndex = Array.from(lastChoices.children).findIndex(child => child.classList.contains("active")) + 1;

                    if(nextLiIndex >= lastChoices.children.length) nextLiIndex = 0;

                    Array.from(lastChoices.children).forEach((child, index) => {
                        child.classList.remove("active");
                        if(index == nextLiIndex) child.classList.add("active");
                    });

                    lastChoices.children[nextLiIndex].classList.add("active");
                }
                else if(e.code === "ArrowUp")
                {
                    let nextLiIndex = Array.from(lastChoices.children).findIndex(child => child.classList.contains("active")) - 1;

                    if (nextLiIndex < 0) {
                        nextLiIndex = lastChoices.children.length - 1;
                    }

                    Array.from(lastChoices.children).forEach((child, index) => {
                        child.classList.remove("active");
                        if (index === nextLiIndex) {
                            child.classList.add("active");
                        }
                    });
                }
                else if (e.code === "Enter")
                {
                    this.controller.abort();

                    Array.from(lastChoices.children).forEach((child, index) => {
                        if (child.classList.contains("active"))
                        {
                            resolve(child.textContent);
                        }
                    });

                }
            }, {signal: this.controller.signal});

            this.elem.focus();
        });
    }

    
    scrollToBottom()
    {
        this.elem.scrollTop = this.elem.scrollHeight;
    }

    initController()
    {
        this.controller.abort();
        this.controller = new AbortController;
    }
};