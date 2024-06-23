# KonsoleJS
A Promise based JavaScript Library for creating console UI on the web.

> [!important]
> This project is still under development so many things will break in future updates.
> I'm also not doing any versioning at the moment.

## Demo
Checkout my [Portfolio](https://husnaintaj.github.io/) made using  KonsoleJS


## Quick Start for npm
You can find it on the [package listing](https://www.npmjs.com/package/@husnain.taj/konsolejs) page.

## Dependencies
- [Jquery](https://code.jquery.com/jquery-3.6.0.min.js)

> Note: Make sure you include KonsoleJs script after JQuery, if you are not using npm.

## Quick Start for Web

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Konsole Example</title>

    <link rel="stylesheet" href="konsole.min.css">
</head>
<body>

    <div id="console"></div>

    <script src="jquery-3.6.0.min.js"></script>
    <script src="konsole.js"></script>
    <script>
        (async ()=>{
            let konsole = new Konsole("#console");

            await konsole.print("Hello Konsole!");

            konsole.awaitKommand();
        })();
    </script>
</body>
</html>
```

> Note: This example assumes you have downloaded and placed konsole.min.css and konsole.js in the same directory as your html file.

## Documentation
### KonsoleSettings

You can pass an instance of KonsoleSettings class when creating a [Konsole](#konsole) instance to change some default behavior of the Konsole.

```js
    let settings = new KonsoleSettings();
    settings.prefix = "C:\\>";

    let konsole = new Konsole("#console", settings);

    await konsole.print("Hello Konsole!");

    konsole.awaitKommand();
```

Following are the properties you can change.

| Name | Default | Type | Description |
| ------ | ------ | ------ | ------ |
| prefix | "$ " | string | The string shown at the very beginning of a line. |
| animatePrint | true | bool | Whether to print text letter by letter or all at once. |
| printLetterInterval | 25 | int | The time in ms between each letter when printing. |
| registerDefaultKommands | true | bool | Whether to [Register Default Kommands](#registerdefaultkommands) or not. |

### Kommand
A Kommand is just an object with following properties


| Name | Type | Description |
| ------ | ------ | ------ |
| name | string | The name of the kommand that is used in konsole to execute it. |
| description | string | Short description of what the kommand does. |
| details | string | Detailed information about usage/syntax of a kommand. It is shown when using *help kommandName*. |
| func | string | A function that is executed when user enters the kommand in konsole. |

> Note: All the properties are required except `details` to [Register a Kommand](#registerkommand).

### Konsole
The Konsole Class takes 2 arguments.
1. Query Selector string for the target konsole element
2. [Konsole Settings](#konsolesettings) object (Optional)

```js
    let settings = new KonsoleSettings();
    settings.prefix = "$";

    let konsole = new Konsole("#my-konsole-element", settings);

    await konsole.print("Hello Konsole!");

    konsole.awaitKommand();
```


#### RegisterDefaultKommands
It will add following 2 Kommands to the Konsole.
- clear - Empties the Konsole element's html.
- help - Shows all registered Kommands
```js
    konsole.RegisterDefaultKommands();
```
You can call this function manually or automatically by setting registerDefaultKommands = true in [Konsole Settings](#konsolesettings).

#### RegisterKommand
Adds a new [Kommand](#kommand) to valid Kommands List in the Konsole.
```js
    let myKommand = new Kommand("clear", "clears the console.", null, () =>
        new Promise((resolve, reject)=>
        {
            $("#console").html("");
            resolve();
        })
    );

    konsole.RegisterKommand(myKommand);
```

#### awaitKommand
This method lets the user to enter a Kommand and then executes it when enter key is pressed.
```js
    konsole.awaitKommand();
```

#### print
As the name suggests this will output the text/html in the console.
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

```js
    let age = await konsole.input("How old are you?");

    await konsole.print(`You said: ${age}`);
```
#### choice
This method will show the list of options with the question to the user. The user can select one of the options using arrow keys and press enter to submit.
```js
    let selectedOption = await konsole.choice("Which language is the best?", ["C#", "C Sharp", "C++++", "Microsoft Java"]);

    await konsole.print(`You chose: ${selectedOption}`);
```

## Known Bugs
- too many to list rn, ill update this later when the project is stable.

## Todo
- Complete [Quick Start](#quick-start)
- Complete [Docs](#documentation)
- Complete this Readme
