import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";

const TypingInput = (props) => {
	const time = props.time;
	const quote = props.quote;
	const author = props.author;
	let spannifiedQuote = [];
	let [numIncorrect, setIncorrect] = useState(0);
	let [wrongKeyPressCount, setWrongKey] = useState(0);
	let [keyPressCount, setKeyCount] = useState(0);

	//breaks the quote into single char spans for input validation in handleChange();
	for (let i = 0; i < quote.length; i++) {
		let currentLetter = (
			<span key={i} id={i} className="quote-spans">
				{quote[i]}
			</span>
		);
		spannifiedQuote.push(currentLetter);
	}

	useEffect(() => {
		if (props.timer === "00:00") {
			let errCounter = document.getElementsByClassName("incorrect");
			setIncorrect(numIncorrect + errCounter.length);
			showDashboard();
		}
		// eslint-disable-next-line
	}, [props.timer]);

	const showDashboard = () => {
		document.querySelector(".dash-container").classList.remove("hide");
		document.querySelector(".quote-container").classList.add("hide");
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		let errCounter = document.getElementsByClassName("incorrect");
		setIncorrect(numIncorrect + errCounter.length);
		props.loadquote();
		document.getElementById("text-input").value = "";

		let spans = document.getElementsByClassName("quote-spans");
		for (let span of spans) {
			span.removeAttribute("style");
			span.classList.remove("incorrect");
		}
		document.getElementById(0).style.cssText = `
	        background-color: #cce5ff;
	    `;
	};

	const handleCursor = (input) => {
		if (input - 1 > 0) {
			document.getElementById(input - 1).style.cssText = `
					background-color: none;	
				`;
		}

		if (input + 1 < spannifiedQuote.length) {
			document.getElementById(input + 1).style.cssText = `
			background-color: none;	
		`;
		}
		document.getElementById(input).style.cssText = `
			background-color: #cce5ff;
		`;
	};

	// When clicking on the div containing the quote text, it will focus on the hidden input field so you can keep typing
	const transferFocus = () => {
		document.getElementById("text-input").focus();
	};

	const handleChange = () => {
		const userInput = document.getElementById("text-input").value;
		let currentId = userInput.length - 1;
		handleCursor(userInput.length);
		if (userInput[currentId] !== quote[currentId]) {
			document.getElementById(currentId).style.cssText = `
            background-color: #f48aa0;
			`;
			document.getElementById(currentId).classList.add("incorrect");
		} else {
			document.getElementById(currentId).removeAttribute("style");
			document.getElementById(currentId).classList.remove("incorrect");
		}
	};

	const handleScore = (e) => {
		let userInput = document.getElementById("text-input").value;
		let currentId = userInput.length - 1;

		if (e.key !== "Backspace" && e.key !== "Shift" && e.key !== "Enter") {
			setKeyCount(keyPressCount + 1);
		}
		if (userInput[currentId] !== quote[currentId] && e.key !== "Backspace") {
			setWrongKey(wrongKeyPressCount + 1);
		}
		if (e.key === "Backspace") {
			setKeyCount(keyPressCount - 1);
		}
	};

	const resetDashboard = () => {
		setIncorrect(0);
		setKeyCount(0);
		setWrongKey(0);

		document.querySelector(".dash-container").classList.add("hide");
		document.querySelector(".setup-container").classList.remove("hide");
		document.getElementById("text-input").value = "";

		let spans = document.getElementsByClassName("quote-spans");
		for (let span of spans) {
			span.removeAttribute("style");
			span.classList.remove("incorrect");
		}
		document.getElementById(0).style.cssText = `
	        background-color: #cce5ff;
	    `;
		props.loadquote();
	};

	return (
		<>
			<div className="quote-container hide" onClick={transferFocus}>
				<h2 className="timer">{props.timer}</h2>
				<div className="quote-text">
					<div className="quote-span-container">{spannifiedQuote}</div>
					<div className="author">-{author}</div>
					<form action="" autoComplete="off" className="type-input" onSubmit={handleSubmit}>
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
				time={time}
				resetDashboard={resetDashboard}
			/>
		</>
	);
};

export default TypingInput;
