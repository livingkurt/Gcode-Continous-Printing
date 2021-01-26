import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import API from './utils/API';

function App() {
	const [ number_of_copies, set_number_of_copies ] = useState(2);
	const [ beginning_1, set_beginning_1 ] = useState('');
	const [ middle_1, set_middle_1 ] = useState('');
	const [ ending_1, set_ending_1 ] = useState('');
	const [ beginning_2, set_beginning_2 ] = useState('');
	const [ middle_2, set_middle_2 ] = useState('');
	const [ ending_2, set_ending_2 ] = useState('');

	const [ file, set_file ] = useState();
	const [ final_gcode, set_final_gcode ] = useState('');
	const [ directory, set_directory ] = useState('');
	const [ filename, set_filename ] = useState('');

	const remove_print = `G1 X105 Y195 Z50 F8000 ; Move up and back
  
  M300 S3520 P200 ; A7
  M300 S4698.868 P200 ; D8
  M300 S5274.04 P200 ; E8
  M300 S6271.93 P200 ; G8
  
  G1 X105 Y195 Z1 F8000 ; Lower
  G1 X105 Y1 Z1 F8000 ; Remove Print
  G1 X105 Y30 Z1 F8000 ; Shake it Out
  G1 X105 Y1 Z1 F8000 ; Shake it Out
  G1 X105 Y30 Z1 F8000 ; Shake it Out
  `.split('\n');

	const showFile_1 = async (e) => {
		e.preventDefault();
		const reader = new FileReader();
		let text = [];

		reader.onload = async (e) => {
			text = e.target.result;
			const gcode = text.split('\n');
			// console.log(e.target.result);
			let beginning_1_array = [];
			let beginning_1_boolean = true;
			let middle_start = 0;
			let middle_finished = 0;
			for (let i = 0; i <= 100; i++) {
				// console.log(gcode[i]);
				if (gcode[i] === 'M83 ; use relative distances for extrusion') {
					beginning_1_boolean = false;
					beginning_1_array = [ ...beginning_1_array, gcode[i] ];
					middle_start = i + 1;
					console.log({ middle_start });
				} else if (beginning_1_boolean) {
					beginning_1_array = [ ...beginning_1_array, gcode[i] ];
					// return;
				}
			}

			let ending_1_array = [];
			let ending_1_boolean = true;

			for (let i = gcode.length - 1; i >= gcode.length - 300; i--) {
				if (gcode[i] === 'G4 ; wait') {
					ending_1_array = [ ...ending_1_array, 'G4 ; wait' ];
					ending_1_boolean = false;
					middle_finished = i;
					console.log({ middle_finished });
				} else if (ending_1_boolean) {
					ending_1_array = [ ...ending_1_array, gcode[i] ];
					// return;
				}
			}
			const middle_1_array = gcode.slice(middle_start, middle_finished);
			// console.log({ beginning_1_array, middle_1_array, ending_1_array: ending_1_array });
			set_beginning_1(beginning_1_array);
			set_middle_1(middle_1_array);
			set_ending_1(ending_1_array);

			// create_new_gcode(beginning_1, middle_1, ending_1_array);
		};

		reader.readAsText(e.target.files[0]);
		set_filename(document.getElementById('file_1').files[0].name);
		set_file(document.getElementById('file_1').files[0]);
	};
	const showFile_2 = async (e) => {
		e.preventDefault();
		const reader = new FileReader();
		let text = [];

		reader.onload = async (e) => {
			text = e.target.result;
			const gcode = text.split('\n');
			// console.log(e.target.result);
			let beginning_2_array = [];
			let beginning_2_boolean = true;
			let middle_start = 0;
			let middle_finished = 0;
			for (let i = 0; i <= 100; i++) {
				// console.log(gcode[i]);
				if (gcode[i] === 'M83 ; use relative distances for extrusion') {
					beginning_2_boolean = false;
					beginning_2_array = [ ...beginning_2_array, gcode[i] ];
					middle_start = i + 1;
					console.log({ middle_start });
				} else if (beginning_2_boolean) {
					beginning_2_array = [ ...beginning_2_array, gcode[i] ];
					// return;
				}
			}

			let ending_2_array = [];
			let ending_2_boolean = true;

			for (let i = gcode.length - 1; i >= gcode.length - 300; i--) {
				if (gcode[i] === 'G4 ; wait') {
					ending_2_array = [ ...ending_2_array, 'G4 ; wait' ];
					ending_2_boolean = false;
					middle_finished = i;
					console.log({ middle_finished });
				} else if (ending_2_boolean) {
					ending_2_array = [ ...ending_2_array, gcode[i] ];
					// return;
				}
			}
			const middle_2_array = gcode.slice(middle_start, middle_finished);
			// console.log({ beginning_2_array, middle_2_array, ending_2_array });
			const ending_2_forward = [ ...ending_2_array ];
			const ending_2_backwards = [ ...ending_2_array ].reverse();
			// ending_2_backwards.reverse();
			console.log({ ending_2_forward, ending_2_backwards });
			set_beginning_2(beginning_2_array);
			set_middle_2(middle_2_array);
			set_ending_2(ending_2_backwards);

			// create_new_gcode(beginning_2, middle_2, ending_2);
		};

		reader.readAsText(e.target.files[0]);
	};

	const create_new_gcode = async () => {
		let gcode_array = [ beginning_1 ];
		console.log(number_of_copies);
		if (number_of_copies === 2) {
			gcode_array = [ ...gcode_array, middle_1, remove_print, middle_2, remove_print, ending_2 ];
		} else if (number_of_copies > 2) {
			gcode_array = [ ...gcode_array, middle_1, remove_print, middle_2, remove_print ];
			for (let i = 2; i < number_of_copies; i++) {
				if (i % 2 === 0) {
					console.log('odd');
					gcode_array = [ ...gcode_array, middle_1, remove_print ];
				} else if (i % 2 === 1) {
					console.log('even');
					gcode_array = [ ...gcode_array, middle_2, remove_print ];
				}
			}
			gcode_array = [ ...gcode_array, ending_2 ];
		}

		console.log({ gcode_array });
		const array = gcode_array.map((item) => {
			return item.join('\n');
		});
		const gcode = array.join('\n');
		console.log({ gcode });
		const response = await API.export_gcode(update_filename(filename), gcode);
		console.log({ response });
		// set_final_gcode(gcode);
	};

	const update_filename = (filename) => {
		const removed = filename.slice(4);
		const new_filename = `${number_of_copies}x ${removed}`;
		console.log({ new_filename });
		return new_filename;
	};

	// function readmultifiles(e) {
	//  const files = e.currentTarget.files;
	//  const num_files = Object.keys(files).length;
	//  console.log({ num_files });
	//  Object.keys(files).forEach((i) => {
	//    const file = files[i];
	//    const reader = new FileReader();
	//    reader.onload = (e) => {
	//      //server call for uploading or reading the files one-by-one
	//      //by using 'reader.result' or 'file'
	//      console.log({ file: e.target.result });
	//    };
	//    reader.readAsBinaryString(file);
	//  });
	// }

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				{/* <input type="text" defaultValue={filename} onChange={(e) => set_filename(e.target.value)} /> */}
				<input type="file" id="file_1" multiple onChange={(e) => showFile_1(e)} />
				<input type="file" multiple onChange={(e) => showFile_2(e)} />
				<input
					type="number"
					defaultValue={number_of_copies}
					onChange={(e) => set_number_of_copies(e.target.value)}
				/>
				<button onClick={() => create_new_gcode()}>Make Continuous Gcode</button>
			</header>
		</div>
	);
}

export default App;
