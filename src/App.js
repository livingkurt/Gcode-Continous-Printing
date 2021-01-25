import logo from './logo.svg';
import './App.css';

function App() {
	const showFile = async (e) => {
		e.preventDefault();
		const reader = new FileReader();
		let text = [];
		reader.onload = async (e) => {
			text = e.target.result;
			const gcode = text.split('\n');
			console.log(e.target.result);
			// let beginning = [];
			// let beginning_boolean = true;
			// for (let i = 0; i <= 100; i++) {
			// 	// console.log(gcode[i]);
			// 	if (gcode[i] === 'M83 ; use relative distances for extrusion') {
			// 		beginning_boolean = false;
			// 		beginning = [ ...beginning, gcode[i] ];
			// 	} else if (beginning_boolean) {
			// 		beginning = [ ...beginning, gcode[i] ];
			// 		// return;
			// 	}
			// }
			// let ending = [];
			// let ending_boolean = true;

			// for (let i = gcode.length - 1; i >= gcode.length - 300; i--) {
			// 	if (gcode[i] === '; G4 ; wait') {
			// 		ending = [ ...ending, ';G4 ; wait' ];
			// 		ending_boolean = false;
			// 	} else if (ending_boolean) {
			// 		ending = [ ...ending, gcode[i] ];
			// 		// return;
			// 	}
			// }
			// console.log({ beginning, ending: ending.reverse() });
		};

		reader.readAsText(e.target.files[0]);
	};

	function readmultifiles(e) {
		const files = e.currentTarget.files;
		const num_files = Object.keys(files).length;
		console.log({ num_files });
		Object.keys(files).forEach((i) => {
			const file = files[i];
			const reader = new FileReader();
			reader.onload = (e) => {
				//server call for uploading or reading the files one-by-one
				//by using 'reader.result' or 'file'
				console.log({ file: e.target.result });
			};
			reader.readAsBinaryString(file);
		});
	}
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<input type="file" multiple onChange={(e) => readmultifiles(e)} />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
