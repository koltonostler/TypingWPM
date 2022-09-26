import { useState, useEffect } from "react";
import Setup from "./components/Setup";

function App() {
	//####   Setup Quote API    #####
	const quoteAPI = "https://api.quotable.io/random?minLength=75";
	const [error, setError] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [quote, setQuote] = useState([]);

	// loads and parses quote from API into json format
	const loadQuote = () => {
		fetch(quoteAPI)
			.then((res) => res.json())
			.then(
				(data) => {
					// data.author = data.author;
					// data.content = data.content;
					setQuote(data);
					setIsLoaded(true);
				},
				(error) => {
					setIsLoaded(true);
					setError(error);
				}
			);
	};

	useEffect(() => {
		loadQuote();
	}, []);

	if (error) {
		return <div>Error: {error.message}</div>;
	} else if (!isLoaded) {
		return <div>Loading...</div>;
	} else {
		return (
			<div className="App">
				<h1 className="title">Typing Test</h1>
				<Setup quote={quote.content} author={quote.author} loadquote={loadQuote} />
			</div>
		);
	}
}

export default App;
