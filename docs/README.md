# KonsoleJS
A Promise based JavaScript Library for creating console/terminal UI on the web.

## Demo

<div id="console" class="dark"></div>

!> You can also checkout my [Portfolio](https://husnaintaj.github.io/) made using  KonsoleJS

## Installation

### Using CDN
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@husnain.taj/konsolejs/dist/konsole.min.css">

<!-- JS -->
<script src="https://cdn.jsdelivr.net/npm/@husnain.taj/konsolejs/dist/konsole.js"></script>
<script>
    // The library classes are available in the global scope as follows:
    // Konsole.Konsole
    // Konsole.KonsoleSettings
    // Konsole.Kommand
</script>
```

### Using NPM
```bash
npm i @husnain.taj/konsolejs
```

## Quick Start

### Using CDN

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Konsole Example</title>
    <!-- KonsoleJS CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/konsolejs/dist/konsole.min.css">
</head>
<body>
    <div id="console"></div>

    <!-- KonsoleJS javascript -->
    <script src="https://cdn.jsdelivr.net/npm/@husnain.taj/konsolejs/dist/konsole.js"></script>
    <script>
        (async ()=>
        {
            let konsole = new Konsole.Konsole("#console");

            await konsole.print("Hello Konsole!");

            await konsole.awaitKommand();
        })();
    </script>
</body>
</html>
```

?> You can find this quickstart sample [here](https://github.com/HusnainTaj/KonsoleJS/tree/main/samples/cdn).

### Using NPM
```bash
npm i @husnain.taj/konsolejs
```

```js
import { Konsole } from "@husnain.taj/konsolejs"; // KonsoleJS javascript
import "@husnain.taj/konsolejs/dist/konsole.min.css"; // KonsoleJS CSS

(async ()=>
{
    let konsole = new.Konsole("#console");

    await konsole.print("Hello Konsole!");

    await konsole.awaitKommand();
})();
```

!> Depending on the choice of the bundler, you may need to configure it to bundle the CSS file as well.

?> You can use webpack or any other bundler to bundle the code. Check out this [example](https://github.com/HusnainTaj/KonsoleJS/tree/main/samples/quickstart/parcel) to see how to setup KonsoleJS with [Parcel bundler](https://parceljs.org/).

?> You can also see this [example](https://github.com/HusnainTaj/KonsoleJS/tree/main/samples/quickstart/npm) to see how to setup KonsoleJS with only npm without using any bundler. (CDN prefered over this method)

# API Reference

## Konsole
The central class of the library — it is used to initialize the Konsole Object and Html container and interact with it.

### Constructor

| Property | Type | Description |
| ------ | ------ | ------ |
| selector | string | query selector string for the konsole's container element. |
| settings | [Konsole Settings](#konsolesettings)? | settings object (optional) |

#### Example
```js
let konsole = new Konsole("#my-konsole-element", { prefix:"C:\>" });

await konsole.print("Hello Konsole!");

await konsole.awaitKommand();
```

### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| elem | HTMLElement | The container of the Konsole. |
| settings | [KonsoleSettings](#konsolesettings) | The settings object passed to the constructor. |
| kommands | [Kommand](#Kommand)[] | List of all registered Kommands. |


### Methods
#### addKommand
Adds a new [Kommand](#kommand) to valid Kommands List in the Konsole.

See the [Kommand](#kommand) section for details on how to create a Kommand.


**Parameters:**
- `kommand: Kommand` - The Kommand to add.

**Returns:** `void`

```js
let myKommand = new Kommand("clear", "clears the console.", null, (arg, konsole) =>
    new Promise((resolve, reject)=>
    {
        konsole.elem.innerHtml = "";
        resolve(true);
    })
);

konsole.addKommand(myKommand);
```

#### removeKommand
Removes the Kommand with the given name from kommands list.

**Parameters:**
- `name: string` - name of the Kommand to remove.

**Returns:** `void`

```js
konsole.removeKommand("clear");
```

#### awaitKommand
This prompts the user to enter a Kommand and executes the action associated with it if it is registered.

**Parameters:**
- `awaitNext: boolean` - Whether to wait for the next Kommand after the current one is executed. Defaults to `true`.

**Returns:** `Promise<void>`

```js
await konsole.awaitKommand();
```

**Kommand Format:** `name arg` - The name of the Kommand followed by any arguments.

Everything after the first space is considered as an argument and is passed as the first argument to the Kommand's action.

Check out the [Kommand](#kommand) section for details.

#### print
Prints the given text/html in the console. Passing multiple strings will print them on separate lines.

**Parameters:**
- `text: ...string[]` - text(s) to print.

**Returns:** `Promise<void>` - a promise that resolves once the text is printed.

```js
// printing a single line
await konsole.print("Hello Konsole!");

// printing multiple lines 
await konsole.print("Hello", "Konsole!");
```
If you have set `animatePrint` to `true` in [Konsole Settings](#konsolesettings), and try to print HTML, The Konsole will first *animately* print the html as text and then replace the text with actual html.

So basically, if you do `konsole.print("<a href='hello'>Konsole</a>");`, you will not be able to click the link while Konsole is printing.

#### getInput
Let's user input anything and returns a promise that resolves to the user's input.

**Returns:** `Promise<string>` - the user's input.

```js
let r = await konsole.getInput();

await konsole.print(`You entered: ${r}`);
```

#### prompt
Prints the question and prompts the user for input and returns a promise that resolves to the user's answer.

**Parameters:**
- `question: string` - text to show to the user as a prompt.

**Returns:** `Promise<string>` - the user's input.

```js
let age = await konsole.prompt("How old are you?");

await konsole.print(`You said: ${age}`);
```
#### choice
This method will show the list of options with the question to the user. The user can select one of the options by using arrow keys to select and pressing enter to submit.

**Parameters:**
- `question: string` - The question to ask the user.
- `options: string[]` - An array of strings representing the options.

**Returns:** `Promise<string>` - The selected option.

```js
let selectedOption = await konsole.choice("Which one the best programming language?", ["C#", "C Sharp", "C++++", "Microsoft Java"]);

await konsole.print(`You chose: ${selectedOption}`);
```

<hr>

## Kommand
A `Kommand` is a command that can be executed in Konsole. It has the following properties:

| Property | Type | Description |
| ------ | ------ | ------ |
| name | string | The name of the kommand that is used in konsole to execute it. |
| description | string | Short description of what the kommand does. |
| details | string? | Detailed information about usage/syntax of a kommand. It is shown when `help kommandName` is entered. |
| action | [KommandAction](#KommandAction) | A function that is executed when user enters the kommand in konsole. |

> Note: All the properties are required except `details` to [add a Kommand](#addkommand).

### KommandAction
A function that takes `arg: string` and `konsole: Konsole` as parameters and returns a Promise that resolves after the action is completed. It is executed when the user enters the kommand's name in Konsole.

```js
let myKommand = new Kommand("clear", "clears the console.", null, (arg:string, konsole:Konsole) =>
    new Promise((resolve, reject)=>
    {
        $("#console").html("");
        resolve(true);

        // or do this if you have nothing to return
        // resolve(null) or resolve(undefined);
    })
);
```

<hr>

## KonsoleSettings
Configuration object that can be passed to `Konsole`'s constructor.

| Property | Type | Default | Description |
| ------ | ------ | ------ | ------ |
| prefix | string | "$" | The string shown at the very beginning of a line. |
| animatePrint | bool | true | Whether to print text letter by letter or all at once. |
| printLetterInterval | int | 25 | The time in ms between each letter when printing. |
| registerDefaultKommands | bool | true | Whether to register [Default Kommands](#Default-Kommands) or not. |
| caseSensitiveKommands | bool | true | Weather kommands should be case-sensitive. |
| invalidKommandMessage | string | "invalid command." | Text to print when no kommand matches the input. |

### Default Kommands
| Name | Description |
| ------ | ------ |
| clear | Empties the Konsole element's html. |
| help | Shows all registered Kommands. |

### Example
```js
let konsole = new Konsole("#console", 
    { 
        prefix: "C:\>",
        animatePrint: false,
        registerDefaultKommands: false,
    }
);

await konsole.print("Hello Konsole!");

await konsole.awaitKommand();
```

