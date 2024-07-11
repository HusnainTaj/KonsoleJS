import { KonsoleSettings } from "./konsoleSettings";
import { Kommand, DefaultKommands } from "./kommand";

class MarkupHelpers
{
    static line(prefix: string): string
    {
        return `<pre class="KonsoleLine"><span class="KonsolePrefix">${prefix} </span><span class="KonsoleLineText"></span></pre>`;
    }

    static para(): string
    { 
        return `<pre class="KonsolePara"><span class="KonsoleParaText"></span></pre>`;
    }

    static choice(lis: any): string
    {
        return `<pre><ul class="KonsoleChoice">${lis}</ul></pre>`;
    }
}

export class Konsole 
{
    settings: KonsoleSettings = new KonsoleSettings();
    elem: HTMLElement = undefined;
    inputElem: HTMLInputElement = undefined; // For internal use
    kommands: Kommand[] = [];

    constructor(selector: string, settings: KonsoleSettings = new KonsoleSettings()) 
    {
        Object.assign(this.settings, settings);
        
        if(document.querySelector(selector) == null)
        {
            throw `element '` + selector + "' wasn't found.";
        }

        this.elem = document.querySelector(selector);

        this.elem.classList.add("Konsole");
        this.elem.setAttribute("tabindex", "0");

        // Prevent browser from scrolling when pressing arrow keys or space bar
        window.addEventListener("keydown", (e)=> {
            if(document.activeElement != this.inputElem && ["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) 
            {
                e.preventDefault();
            }
        }, false);

        // Refocus on Konsole when user clicks on a link
        this.elem.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).tagName === 'A') 
            {
                (e.target as HTMLElement).blur();
                this.elem.focus();
            }
        });

        // Add input element
        this.elem.insertAdjacentHTML("afterend", `<textarea id="konsoleInput" disabled></textarea>`);
        this.inputElem = document.body.querySelector("#konsoleInput");
        
        // Handle Konsole Focus
        this.elem.addEventListener('focus', (e) =>
        {
            this.elem.classList.add("focussed");  
            if(!this.inputElem.disabled) this.inputElem.focus();
        });

        // input can also be focused directly using code
        this.inputElem.addEventListener('focus', (e) =>
        {
            this.elem.classList.add("focussed");  
        });

        document.body.addEventListener('focusout', (e) =>
        {
            // relatedTarget is the element that will receive focus next
            if(this.inputElem.disabled)
            {
                if(e.relatedTarget == this.elem) 
                {
                    // this.elem.classList.add("focussed");
                }
                else if(e.relatedTarget != null)
                {
                    this.elem.classList.remove("focussed");
                }
            }
            else
            {
                if (e.relatedTarget !== this.inputElem) 
                {
                    this.elem.classList.remove("focussed");
                }
            }
        });

        // Automatically Scroll to the bottom when new child is added
        const observer = new MutationObserver((mutationsList, observer) => 
        {
            for(const mutation of mutationsList) 
            {
                if (mutation.type === 'childList') 
                {
                    // console.log('A child node has been added or removed.', mutation.addedNodes.);
                    this.elem.scrollTop = this.elem.scrollHeight;
                }
            }
        });

        observer.observe(this.elem, { attributes: false, childList: true, subtree: false });

        // Register Default Kommands
        if(this.settings.registerDefaultKommands)
        {
            for (const kommand of DefaultKommands) 
            {
                this.addKommand(kommand);
            }
        }
    }

    /**
     * Adds a new Kommand to valid kommands list.
     */
    addKommand(kommand:Kommand)
    {
        if(this.kommands.find(k => k.name == kommand.name)) throw `Kommand with name '${kommand.name}' already exists.`;

        if(kommand && kommand.name && kommand.description && kommand.action) this.kommands.push(kommand);
    }

    
    /**
     * Removes the Kommand with the given name from kommands list.
     */
    removeKommand(name:string)
    {
        this.kommands = this.kommands.filter(k => k.name !== name);
    }

    private inputController = new AbortController;
    /**
     * Let's user input anything and returns a promise that resolves to the user's input.
     */
    getInput():Promise<string>
    {
        return new Promise((resolve, reject)=>{

            this.elem.insertAdjacentHTML("beforeend", MarkupHelpers.line(this.settings.prefix));
            let lastLine = Array.from(document.querySelectorAll(".KonsoleLine")).pop().querySelector("span.KonsoleLineText");
            
            this.resetController();

            this.inputElem.disabled = false;
            this.inputElem.value = "";
            if(this.elem.classList.contains("focussed")) this.inputElem.focus();

            this.inputElem.addEventListener("input", async (e:InputEvent) => 
            {
                if (e.inputType === "insertLineBreak") // Enter key
                {
                    this.inputElem.disabled = true;
                    this.inputController.abort();

                    // trim and replace multiple spaces with only a single one
                    let cl = this.inputElem.value.trim().replace( /  +/g, "");

                    resolve(cl);
                }
                else
                {
                    lastLine.textContent = this.inputElem.value;
                }
            }, {signal: this.inputController.signal});
        });
    }

    /**
     * Prompts the user to enter a Kommand and executes the action associated with it if it is registered.
     */
    async awaitKommand(awaitNext:boolean = true)
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

        let kommand = this.kommands.find(k => this.settings.caseSensitiveKommands ? k.name == command : k.name.toLowerCase() == command.toLowerCase());

        if(kommand)
            await kommand.action(arg, this)
        else
            await this.print(this.settings.invalidKommandMessage);

        if(awaitNext) await this.awaitKommand();
    }

    /**
     * Prints the given text/html in the console.
     * 
     */
    print(...texts: string[]): Promise<void>
    {
        return new Promise((resolve, reject)=>{

            if(!texts.join("").trim())
            {
                reject("Empty Text.");
                return;
            }

            // Append new Konsole Para Markup
            this.elem.insertAdjacentHTML("beforeend", MarkupHelpers.para());

            const LastKonsolePara = Array.from(document.querySelectorAll(".KonsolePara")).pop().querySelector(".KonsoleParaText");

            // input in HTML
            const htmlToPrint = texts.join("\n");

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
                        this.inputController.abort();
                        resolve(); // "Printed animately"
                    }

                }, this.settings.printLetterInterval);

                // Skip the animation if user presses space
                this.resetController();

                document.body.addEventListener("keydown", (e)=>{
                    if (e.code === "Space")
                    {
                        LastKonsolePara.innerHTML = htmlToPrint;
                        clearInterval(lineInter);
                        this.inputController.abort();
                        resolve(); // "Printed animately (interrupted)"
                    }
                }, {signal: this.inputController.signal});
            }
            else
            {
                LastKonsolePara.innerHTML = htmlToPrint;

                resolve(); // "Printed non-animately"
            }
        });
    }

    /**
     * Prints the question and prompts the user for input and returns a promise that resolves to the user's answer.
     */
    async prompt(question:string) :Promise<string>
    {
        await this.print(question + "\n");

        return await this.getInput();
    }

    /**
     * This method will show the list of options with the question to the user.
     * The user can select one of the options by using arrow keys to select and pressing enter to submit.
     */
    async choice(question:string, choices:string[]): Promise<string>
    {
        await this.print(question);

        this.resetController();

        let lis = "";
        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];

            lis += `<li ${ i == 0 ? "class='active'" : ""}>${choice}</li>`;
        }

        this.elem.insertAdjacentHTML("beforeend", MarkupHelpers.choice(lis));
       
        return new Promise((resolve, reject)=>{

            const lastChoices = Array.from(document.querySelectorAll("ul.KonsoleChoice")).pop();

            this.inputElem.disabled = false;
            this.inputElem.value = "";

            this.inputElem.addEventListener("keyup", (e:KeyboardEvent)=>
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
                    this.inputElem.disabled = true;
                    this.inputController.abort();

                    Array.from(lastChoices.children).forEach((child, index) => {
                        if (child.classList.contains("active"))
                        {
                            resolve(child.textContent);
                        }
                    });

                }
            }, {signal: this.inputController.signal});

            this.inputElem.focus();
        });
    }

    // For internal use
    resetController()
    {
        this.inputController.abort();
        this.inputController = new AbortController;
    }
};