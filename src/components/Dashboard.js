import React, { useEffect } from "react";

const Dashboard = (props) => {
	// calculate variables to disply in dash
	let grossWPM = props.keyPressCount / 5 / (props.time / 60);
	let netWPM = grossWPM - props.numIncorrect / (props.time / 60);
	let accuracy = ((props.keyPressCount - props.wrongKeyPressCount) / props.keyPressCount) * 100;

	// handles when restart button is clicked
	const restart = () => {
		props.resetDashboard();
		document.getElementById("start").focus();
	};

	// allows using the enter key (keycode 13) to restart
	const handleKeypress = (e) => {
		if (e.keyCode === 13) {
			restart();
		}
		e.preventDefault();
	};

	//set the highscore to the local storage
	useEffect(() => {
		localStorage.setItem("highscore", JSON.stringify(props.highscore));
	}, [props.highscore]);

	return (
		<>
			<div className="dash-container hide">
				<p>
					Net WPM: <b>{netWPM.toFixed(2)}</b>
				</p>
				<p>
					Accuracy: <b>{accuracy.toFixed(2)}%</b>
				</p>
				<p>
					Number of unfixed errors: <b>{props.numIncorrect}</b>
				</p>
				<p>
					Keys pressed: <b>{props.keyPressCount}</b>
				</p>
				<p>
					Wrong keys pressed: <b>{props.wrongKeyPressCount}</b>
				</p>
				<p>
					Personal Record WPM = <b>{props.highscore}</b>
				</p>
				<br />
				<br />
				<button onClick={restart} onKeyDown={handleKeypress} className="start-button" id="restart">
					Restart
				</button>
			</div>
		</>
	);
};

export default Dashboard;
