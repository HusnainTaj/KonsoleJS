# KonsoleJS
A Promise based JavaScript Library for creating consoles on the web.

## Disclaimer
This project is still under development so many things will break in future updates.
I'm also not doing any versioning.

## Demo
Checkout my [Portfolio](https://husnaintaj.github.io/Portfolio/) made using  KonsoleJS

## Dependencies 
- [Jquery](https://code.jquery.com/jquery-3.6.0.min.js)
Make sure you include KonsoleJs script after JQuery.

## Quick Start
Download and add konsole js and css files to your project.
```js
	let konsole = new Konsole("#console");

	await konsole.print("Hello Konsole!");

	konsole.awaitKommand();
```

## Documentation
#### KonsoleSettings

You can pass an instance of KonsoleSettings class when creating a [Konsole](#konsole) instance to change some default behavior of the Konsole.

```js
	let settings = new KonsoleSettings();
	settings.prefix = "C:\\>";

	let konsole = new Konsole("#console", settings);

	await konsole.print("Hello Konsole!");

	konsole.awaitKommand();
```

Following are the properties you can change.

| Name | Default | Type | description |
| ------ | ------ | ------ | ------ |
| prefix | "$ " | string | The string shown at the very beginning of a line. |
| animatePrint | true | bool | Whether to print text letter by letter or all at once. |
| printLetterInterval | 25 | int | The time in ms between each letter when printing. |
| registerDefaultKommands | true | bool | Whether to [Register Default Kommands](#registerdefaultkommands) or not. |

#### Kommand
A Kommand is just an object with following properties

`name`&emsp;&emsp;&emsp;&emsp;- The name of the kommand that is used in konsole to execute it.
`description` - Short description of what the kommand does.
`details`&emsp;&emsp;&ensp;- Detailed information about usage/syntax of a kommand. It is shown when using *help kommandName*.
`func`&emsp;&emsp;&emsp;&emsp;&nbsp;- A function that is executed when user enters the kommand in konsole.

> Note: All the properties are required except `details` to [Register a Kommand](#registerkommand).

#### Konsole
##### RegisterDefaultKommands
It will add following 2 Kommands to the Konsole.
- clear - Empties the Konsole element's html.
- help - Shows all registered Kommands
```js
	konsole.RegisterDefaultKommands();
```
You can call this function manually or automatically by setting registerDefaultKommands = true in [Konsole Settings](#konsolesettings).

##### RegisterKommand
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

##### awaitKommand
This method waits for the user to enter a Kommand and then executes it.
```js
	konsole.awaitKommand();
```

##### print
As the name suggests this will output the text/html in the console.
```js
	// printing a single line
	await konsole.print("Hello Konsole!");

	// printing multiple lines 
	await konsole.print("Hello", "Konsole!");
```
If you have set `animatePrint` to `true` in [Konsole Settings](#konsolesettings), and try to print HTML, The Konsole will first *animately* print the html as text and then replace the text with actual html.
So basically, if you do `konsole.print("<a href='hello'>Konsole</a>");`, you will not be able to click the link while Konsole is printing.

##### input
##### choice

## Known Bugs
- too many to list rn, ill update this later when the project is stable.

## Todo
- Complete [Quick Start](#quick-start)
- Complete [Docs](#documentation)
- Complete this Readme