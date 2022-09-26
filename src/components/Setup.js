import React from "react";
import { useState, useRef } from "react";
import TypingInput from "./TypingInput";

const Setup = (props) => {
	const quote = props.quote;
	const author = props.author;
	const [inputTime, setTime] = useState("30");

	const handleSubmit = (e) => {
		e.preventDefault();
		document.querySelector(".setup-container").classList.add("hide");
		document.querySelector(".quote-container").classList.remove("hide");
		document.getElementById("text-input").focus();
		document.getElementById(0).style.cssText = `
	        background-color: #cce5ff;
	    `;

		onClickStart();
	};

	const handleChange = (e) => {
		setTime(e.target.value);
	};

	// #### TIMER SETUP ####
	const Ref = useRef(null);

	// The state for our timer
	const [timer, setTimer] = useState("00:30");

	const getTimeRemaining = (time) => {
		const total = Date.parse(time) - Date.parse(new Date());
		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor((total / 1000 / 60) % 60);
		return {
			total,
			minutes,
			seconds,
		};
	};

	const startTimer = (time) => {
		let { total, minutes, seconds } = getTimeRemaining(time);
		if (total >= 0) {
			setTimer((minutes > 9 ? minutes : "0" + minutes) + ":" + (seconds > 9 ? seconds : "0" + seconds));
		}
	};

	const clearTimer = (time) => {
		if (inputTime === "30") {
			setTimer("00:30");
		} else if (inputTime === "60") {
			setTimer("01:00");
		} else {
			setTimer("02:00");
		}

		if (Ref.current) clearInterval(Ref.current);
		const id = setInterval(() => {
			startTimer(time);
		}, 1000);
		Ref.current = id;
	};

	const getTime = () => {
		let endTime = new Date();

		endTime.setSeconds(endTime.getSeconds() + parseInt(inputTime));
		return endTime;
	};

	const onClickStart = () => {
		clearTimer(getTime());
	};

	return (
		<>
			<div className="setup-container">
				<form onSubmit={handleSubmit}>
					<fieldset className="time-select">
						<legend>Select time:</legend>

						<div className="radio-container">
							<input
								type="radio"
								id="time-30s"
								name="time"
								value="30"
								onChange={handleChange}
								defaultChecked
							/>
							<label htmlFor="time-30s">30 sec</label>
							<br />
							<input type="radio" id="time-1m" name="time" value="60" onChange={handleChange} />1 min
							<label htmlFor="time-1m"></label>
							<br />
							<input type="radio" id="time-2m" name="time" value="120" onChange={handleChange} />2 min
							<label htmlFor="time-2m"></label>
						</div>
					</fieldset>

					<button autoFocus type="submit" className="start-button" id="start">
						Start
					</button>
				</form>
			</div>
			<TypingInput quote={quote} author={author} loadquote={props.loadquote} timer={timer} time={inputTime} />
		</>
	);
};

export default Setup;
