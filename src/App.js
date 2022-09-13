import { useState, useEffect } from "react";
import Setup from "./components/Setup";
// import TypingInput from "./components/TypingInput";

function App() {
	//####   Setup Quote API    #####
	const quoteAPI = "https://goquotes-api.herokuapp.com/api/v1/random?count=1";
	const [error, setError] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [quote, setQuote] = useState([]);

	const loadQuote = () => {
		fetch(quoteAPI)
			.then((res) => res.json())
			.then(
				(data) => {
					data.author = data.quotes[0].author;
					data.content = data.quotes[0].text;
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