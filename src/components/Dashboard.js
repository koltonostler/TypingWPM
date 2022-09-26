import React from "react";

const Dashboard = (props) => {
	let grossWPM = props.keyPressCount / 5 / (props.time / 60);
	let netWPM = grossWPM - props.numIncorrect / (props.time / 60);
	let accuracy = ((props.keyPressCount - props.wrongKeyPressCount) / props.keyPressCount) * 100;

	const restart = () => {
		props.resetDashboard();
		document.getElementById("start").focus();
	};

	const handleKeypress = (e) => {
		if (e.keyCode === 13) {
			restart();
		}
		e.preventDefault();
	};

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
