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
	const [ gcode_1_name, set_gcode_1_name ] = useState('');
	const [ gcode_2_name, set_gcode_2_name ] = useState('');
	const [ status, set_status ] = useState('');
	const [ loading, set_loading ] = useState(false);

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
			let beginning_1_array = [];
			let beginning_1_boolean = true;
			let middle_start = 0;
			let middle_finished = 0;
			for (let i = 0; i <= 100; i++) {
				if (gcode[i] === 'M83 ; use relative distances for extrusion') {
					beginning_1_boolean = false;
					beginning_1_array = [ ...beginning_1_array, gcode[i] ];
					middle_start = i + 1;
				} else if (beginning_1_boolean) {
					beginning_1_array = [ ...beginning_1_array, gcode[i] ];
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
				}
			}
			const middle_1_array = gcode.slice(middle_start, middle_finished);
			set_beginning_1(beginning_1_array);
			set_middle_1(middle_1_array);
			set_ending_1(ending_1_array);
		};

		reader.readAsText(e.target.files[0]);
		set_filename(document.getElementById('file_1').files[0].name);
		set_file(document.getElementById('file_1').files[0]);
		set_gcode_1_name(document.getElementById('file_1').files[0].name);
	};
	const showFile_2 = async (e) => {
		e.preventDefault();
		const reader = new FileReader();
		let text = [];

		reader.onload = async (e) => {
			text = e.target.result;
			const gcode = text.split('\n');
			let beginning_2_array = [];
			let beginning_2_boolean = true;
			let middle_start = 0;
			let middle_finished = 0;
			for (let i = 0; i <= 100; i++) {
				if (gcode[i] === 'M83 ; use relative distances for extrusion') {
					beginning_2_boolean = false;
					beginning_2_array = [ ...beginning_2_array, gcode[i] ];
					middle_start = i + 1;
				} else if (beginning_2_boolean) {
					beginning_2_array = [ ...beginning_2_array, gcode[i] ];
				}
			}

			let ending_2_array = [];
			let ending_2_boolean = true;

			for (let i = gcode.length - 1; i >= gcode.length - 300; i--) {
				if (gcode[i] === 'G4 ; wait') {
					ending_2_array = [ ...ending_2_array, 'G4 ; wait' ];
					ending_2_boolean = false;
					middle_finished = i;
				} else if (ending_2_boolean) {
					ending_2_array = [ ...ending_2_array, gcode[i] ];
				}
			}
			const middle_2_array = gcode.slice(middle_start, middle_finished);
			const ending_2_forward = [ ...ending_2_array ];
			const ending_2_backwards = [ ...ending_2_array ].reverse();
			console.log({ ending_2_forward, ending_2_backwards });
			set_beginning_2(beginning_2_array);
			set_middle_2(middle_2_array);
			set_ending_2(ending_2_backwards);
		};

		reader.readAsText(e.target.files[0]);
		set_gcode_2_name(document.getElementById('file_2').files[0].name);
	};

	const create_new_gcode = async () => {
		set_loading(true);
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
		set_loading(false);
		set_status(`Created ${update_filename(filename)}`);
	};

	const update_filename = (filename) => {
		const removed = filename.slice(4);
		const new_filename = `${number_of_copies}x ${removed}`;
		console.log({ new_filename });
		return new_filename;
	};

	return (
		<div className="m-auto">
			<header className="p-1rem mb-2rem jc-b">
				<div className="logo h-125px w-125px">
					<img className="zoom logo_s" src="/glow_logo_optimized.png" alt="Glow LEDs Logo" title="Big Logo" />
				</div>
				<h1 className="ta-c fs-50px ">Gcode Continous Printing</h1>
				<div className="w-125px" />
			</header>
			<div>
				{loading && (
					<div className="jc-c column">
						<img
							src={process.env.PUBLIC_URL + '/loading.gif'}
							className="loading_gif"
							alt="Loading Circle"
							title="Loading Circle"
						/>
						<img
							src={process.env.PUBLIC_URL + '/loading_overlay.png'}
							className="loading_png"
							alt="Loading Overlay"
							title="Loading Overlay"
						/>
						{/* {loading_message()} */}
					</div>
				)}
			</div>
			<div className="column m-auto max-w-500px w-100per form">
				<div className="form-item">
					<label className="mr-1rem w-50per fw-800">1/2 gcode</label>
					<label className="btn primary w-50per">
						<label className="">Choose gcode file</label>
						<input
							className="btn primary"
							type="file"
							id="file_1"
							multiple
							onChange={(e) => showFile_1(e)}
						/>
					</label>
				</div>
				<label className="form-item">{gcode_1_name}</label>
				<div className="form-item">
					<label className="mr-1rem w-50per fw-800">2/2 gcode</label>
					<label className="btn primary w-50per">
						<label className="">Choose gcode file</label>
						<input
							className="btn primary"
							type="file"
							id="file_2"
							multiple
							onChange={(e) => showFile_2(e)}
						/>
					</label>
				</div>
				<label className="form-item">{gcode_2_name}</label>
				<div className="form-item">
					<label className="mr-1rem w-50per fw-800">Number of Copies</label>
					<input
						type="number"
						className="w-50per"
						defaultValue={number_of_copies}
						onChange={(e) => set_number_of_copies(e.target.value)}
					/>
				</div>
				<div className="form-item">
					<button className="btn primary w-100per" onClick={() => create_new_gcode()}>
						Make Continuous Gcode
					</button>
				</div>
				{status && <label className="form-item btn secondary">{status}</label>}
			</div>
		</div>
	);
}

export default App;
