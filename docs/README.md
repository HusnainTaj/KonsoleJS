# KonsoleJS
A Promise based JavaScript Library for creating console/terminal UI on the web.

## Features
- Print text/HTML
- Get user input
- Get user choice
- Register custom Kommands
- Case-sensitive Kommands
- Animated text printing
- Customizable prefix

## Demo

<div id="console" class="dark"></div>

You can also checkout my [Portfolio](https://husnaintaj.github.io/) made using  KonsoleJS

## Installation

### Using NPM
```bash
npm i @husnain.taj/konsolejs
```

### Using CDN
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/konsolejs/dist/konsole.min.css">

<!-- JS -->
<script src="https://cdn.jsdelivr.net/npm/@husnain.taj/konsolejs/dist/es6/index.js"></script>
```


## Quick Start

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Konsole Example</title>
</head>
<body>
    <div id="console"></div>

    <script src="index.js" type="module"></script>
</body>
</html>
```

```js
// index.js
import { Konsole } from "@husnain.taj/konsolejs";

(async ()=>{
    let konsole = new Konsole("#console");

    await konsole.print("Hello Konsole!");

    konsole.awaitKommand();
})();
```

# API Reference

## Konsole
The central class of the library — it is used to initialize the Konsole Object and Html container and interact with it.

#### Example
```js
let konsole = new Konsole("#my-konsole-element", { prefix:"C:\>" });

await konsole.print("Hello Konsole!");

konsole.awaitKommand();
```

### Constructor

| Property | Type | Description |
| ------ | ------ | ------ |
| selector | string | query selector string for the konsole's container element. |
| settings | [Konsole Settings](#konsolesettings)? | settings object (optional) |

### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| elem | HTMLElement | The container of the Konsole. |
| settings | [KonsoleSettings](#konsolesettings) | The settings object passed to the constructor. |
| kommands | [Kommand](#Kommand)[] | List of all registered Kommands. |


### Methods
#### registerKommand
Adds a new [Kommand](#kommand) to valid Kommands List in the Konsole.
```js
let myKommand = new Kommand("clear", "clears the console.", null, (arg, konsole) =>
    new Promise((resolve, reject)=>
    {
        konsole.elem.innerHtml = "";
        resolve(true);
    })
);

konsole.RegisterKommand(myKommand);
```

#### awaitKommand
This method waits for the user to enter a Kommand and then executes it.

```js
konsole.awaitKommand();
```

#### print
outputs the given text/html in the console.

```js
// printing a single line
await konsole.print("Hello Konsole!");

// printing multiple lines 
await konsole.print("Hello", "Konsole!");
```
If you have set `animatePrint` to `true` in [Konsole Settings](#konsolesettings), and try to print HTML, The Konsole will first *animately* print the html as text and then replace the text with actual html.

So basically, if you do `konsole.print("<a href='hello'>Konsole</a>");`, you will not be able to click the link while Konsole is printing.

#### input
This method will get a string value from user.

**Parameters:**
- `question: string` - The question to ask the user.

**Returns:** User's response as a `string`.

```js
let age = await konsole.input("How old are you?");

await konsole.print(`You said: ${age}`);
```
#### choice
This method will show the list of options with the question to the user. The user can select one of the options using arrow keys and press enter to submit.

**Parameters:**
- `question: string` - The question to ask the user.
- `options: string[]` - An array of strings representing the options.

**Returns:** The selected option.

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

> Note: All the properties are required except `details` to [Register a Kommand](#registerkommand).

### KommandAction
A function that takes `arg: string` and `konsole: Konsole` as parameters and returns a Promise that resolves after the action is completed. It is executed when the user enters the kommand's name in Konsole.

```js
let myKommand = new Kommand("clear", "clears the console.", null, (arg:string, konsole:Konsole) =>
    new Promise((resolve, reject)=>
    {
        $("#console").html("");
        resolve();
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
| invalidKommandMessage | string | "invalid command." | Text to print when no kommand matches the input.

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

konsole.awaitKommand();

```

