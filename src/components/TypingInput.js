import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";

const TypingInput = (props) => {
	// variables declared for props from setup, as well as useState variables to handle wpm calculations
	const time = props.time;
	const quote = props.quote;
	const author = props.author;
	let spannifiedQuote = [];
	let [numIncorrect, setIncorrect] = useState(0);
	let [wrongKeyPressCount, setWrongKey] = useState(0);
	let [keyPressCount, setKeyCount] = useState(0);

	//breaks the quote into single char spans and adds indices for input validation
	for (let i = 0; i < quote.length; i++) {
		let currentLetter = (
			<span key={i} id={i} className="quote-spans">
				{quote[i]}
			</span>
		);
		spannifiedQuote.push(currentLetter);
	}

	// checks to see if there is a highscore key in local Storage, if there is return that scores value, if not return 0,
	const loadHighscore = () => {
		if (localStorage.getItem("highscore") === null) {
			return 0;
		} else {
			return JSON.parse(localStorage.getItem("highscore"));
		}
	};

	// set the highscore using the load highscore function, will either be 0 or the stored highscore.
	const [highScore, setHighScore] = useState(loadHighscore());

	useEffect(() => {
		// when the time hits 0 we will run the following
		if (props.timer === "00:00") {
			countErrors();
			// get the new WPM for setting the highscore
			let WPM = keyPressCount / 5 / (time / 60) - numIncorrect / (time / 60);
			// set new highscore if the WPM was higher than the stored highscore
			if (WPM > highScore) {
				setHighScore(WPM);
			}
			// show the dashboard element
			showDashboard();
		}
		// eslint-disable-next-line
	}, [props.timer]);

	// show dashboard and hide quote
	const showDashboard = () => {
		document.querySelector(".dash-container").classList.remove("hide");
		document.querySelector(".quote-container").classList.add("hide");
		// set focus on restart button so you can use enter to advance
		document.querySelector("#restart").focus();
	};

	const clearQuotes = () => {
		// clear the text input
		document.getElementById("text-input").value = "";
		// clear the styles and classes of the spans from the new spans from loading the new quote
		let spans = document.getElementsByClassName("quote-spans");
		for (let span of spans) {
			span.removeAttribute("style");
			span.classList.remove("incorrect");
		}
	};

	const resetCursor = () => {
		// set cursor on the first span of the new quote
		document.getElementById(0).style.cssText = `
	        background-color: #cce5ff;
	    `;
	};

	const clearCursor = (index) => {
		// clears the cursor element on the index provided
		document.getElementById(index).style.cssText = `
					background-color: none;	
				`;
	};

	const addCursor = (index) => {
		// adds a cursor to the index provided
		document.getElementById(index).style.cssText = `
				background-color: #cce5ff;
			`;
	};

	const countErrors = () => {
		// get an array of the chars with incorrect added
		let errCounter = document.getElementsByClassName("incorrect");
		// update the number of incorrect chars
		setIncorrect(numIncorrect + errCounter.length);
	};

	const getNewQuote = () => {
		// load the new quote
		props.loadquote();
		// clear the css background elements for the new quote
		clearQuotes();
		// reset the cursor
		resetCursor();
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		countErrors();
		getNewQuote();
	};

	const handleCursor = (input) => {
		// only handle cursor changes if input length is less than the quote length
		if (input < spannifiedQuote.length) {
			// remove cursor style from the trailing span of current cursor
			if (input - 1 > 0) {
				clearCursor(input - 1);
			}
			// remove cursor style from the leading span of current cursor
			if (input + 1 < spannifiedQuote.length) {
				clearCursor(input + 1);
			}
			// put cursor on current input
			addCursor(input);
		}
		// load new quote when you reach the end of the sentence.
		// tried doing this by calling handleSubmit(), but would get error because there was no event
		if (input === spannifiedQuote.length) {
			countErrors();
			getNewQuote();
		}
	};

	// When clicking on the div containing the quote text, it will focus on the hidden input field so you can keep typing
	const transferFocus = () => {
		document.getElementById("text-input").focus();
	};
	// handles keeping track of wrong inputs
	const handleChange = () => {
		// gets the userinput
		const userInput = document.getElementById("text-input").value;
		// currentId will match the index of that spans created during spannifyquote
		let currentId = userInput.length - 1;
		handleCursor(userInput.length);
		// when user input and quote don't match on the current index, set background to red and add incorrect class to span
		if (userInput[currentId] !== quote[currentId]) {
			document.getElementById(currentId).style.cssText = `
            background-color: #f48aa0;
			`;
			document.getElementById(currentId).classList.add("incorrect");
			// handles when using backspace, only runs when userinput is > 0 as not to reference null Idex
		} else if (userInput.length > 0) {
			document.getElementById(currentId).removeAttribute("style");
			document.getElementById(currentId).classList.remove("incorrect");
		}
	};

	const handleScore = (e) => {
		let userInput = document.getElementById("text-input").value;
		let currentId = userInput.length - 1;
		// registers a key press except for when pressing backspace, shift and enter
		if (e.key !== "Backspace" && e.key !== "Shift" && e.key !== "Enter") {
			setKeyCount(keyPressCount + 1);
		}
		// registers an incorrect key press when input and quote don't match, and it isn't a backspace
		if (userInput[currentId] !== quote[currentId] && e.key !== "Backspace") {
			setWrongKey(wrongKeyPressCount + 1);
		}
		// take away keypress when you hit backspace, else you could just delete the whole text and get credit for correct keys for any backspace.
		if (e.key === "Backspace") {
			setKeyCount(keyPressCount - 1);
		}
	};

	// resets the counters for the next test
	const resetDashboard = () => {
		// resets incorrect, key count, wrong key count
		setIncorrect(0);
		setKeyCount(0);
		setWrongKey(0);
		// hide the dashboard component, show the setup component
		document.querySelector(".dash-container").classList.add("hide");
		document.querySelector(".setup-container").classList.remove("hide");
		// clear text input, reset curor and load quote
		getNewQuote();
	};

	return (
		<>
			<div className="quote-container hide" onClick={transferFocus}>
				<h2 className="timer">{props.timer}</h2>
				<div className="quote-text">
					<div className="quote-span-container">{spannifiedQuote}</div>
					<div className="author">-{author}</div>
					<form autoComplete="off" className="type-input" id="quote-form" onSubmit={handleSubmit}>
						<input
							onChange={handleChange}
							onKeyUp={handleScore}
							type="text"
							name="text-input"
							id="text-input"
							autoFocus
						/>
					</form>
				</div>
				<span className="enter-prompt">Press ENTER to go to next quote</span>
			</div>

			<Dashboard
				numIncorrect={numIncorrect}
				wrongKeyPressCount={wrongKeyPressCount}
				keyPressCount={keyPressCount}
				highscore={highScore}
				time={time}
				resetDashboard={resetDashboard}
			/>
		</>
	);
};

export default TypingInput;
