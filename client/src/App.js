import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import API from './utils/API';

function App() {
	const [ number_of_copies, set_number_of_copies ] = useState(2);
	const [ gcode_name, set_gcode_name ] = useState('');
	const [ gcode_parts, set_gcode_parts ] = useState({});

	const [ filename, set_filename ] = useState('');
	const [ status, set_status ] = useState('');
	const [ loading, set_loading ] = useState(false);
	const [ color_change, set_color_change ] = useState(false);

	const remove_print = `G1 X105 Y195 Z50 F8000 ; Move up and back
  
  M300 S3520 P200 ; A7
  M300 S4698.868 P200 ; D8
  M300 S5274.04 P200 ; E8
  M300 S6271.93 P200 ; G8
  
  G4 S20

	G1 X105 Y195 Z1 F8000 ; Lower

  G1 X105 Y1 Z1 F8000 ; Remove Print
  G1 X105 Y30 Z1 F8000 ; Shake it Out
  G1 X105 Y1 Z1 F8000 ; Shake it Out
  G1 X105 Y30 Z1 F8000 ; Shake it Out

  ${color_change ? 'M600; Change Color' : ''}
  `.split('\n');

	const showFiles = async (e) => {
		e.preventDefault();

		for (let index = 0; index < e.target.files.length; index++) {
			const reader = new FileReader();
			let text = [];
			console.log(e.target.files[0]);
			const file = e.target.files[index];
			console.log({ file });
			reader.onload = async (e) => {
				text = e.target.result;
				const gcode = text.split('\n');
				let beginning_array = [];
				let beginning_boolean = true;
				let middle_start = 0;
				let middle_finished = 0;
				for (let i = 0; i <= 100; i++) {
					if (gcode[i] === 'M83 ; use relative distances for extrusion') {
						beginning_boolean = false;
						beginning_array = [ ...beginning_array, gcode[i] ];
						middle_start = i + 1;
					} else if (beginning_boolean) {
						beginning_array = [ ...beginning_array, gcode[i] ];
					}
				}

				let ending_array = [];
				let ending_boolean = true;

				for (let i = gcode.length - 1; i >= gcode.length - 300; i--) {
					if (gcode[i] === 'G4 ; wait') {
						ending_array = [ ...ending_array, 'G4 ; wait' ];
						ending_boolean = false;
						middle_finished = i;
						console.log({ middle_finished });
					} else if (ending_boolean) {
						ending_array = [ ...ending_array, gcode[i] ];
					}
				}
				const middle_array = gcode.slice(middle_start, middle_finished);
				const num = index + 1;
				set_gcode_parts((parts) => {
					return {
						...parts,
						['file_' + num]: {
							['beginning_' + num]: beginning_array,
							['middle_' + num]: middle_array,
							['ending_' + num]: ending_array
						}
					};
				});
			};

			reader.readAsText(file);
			set_filename(document.getElementById('file').files[0].name);
			set_gcode_name(document.getElementById('file').files[0].name);
		}
	};

	const create_new_gcode = async () => {
		console.log({ gcode_parts });
		set_loading(true);
		let gcode_array = [ gcode_parts.file_1.beginning_1 ];
		console.log(number_of_copies);
		if (number_of_copies === 2) {
			gcode_array = [
				...gcode_array,
				gcode_parts.file_1.middle_1,
				remove_print,
				gcode_parts.file_2.middle_2,
				remove_print,
				gcode_parts.file_2.ending_2
			];
		} else if (number_of_copies > 2) {
			gcode_array = [
				...gcode_array,
				gcode_parts.file_1.middle_1,
				remove_print,
				gcode_parts.file_2.middle_2,
				remove_print
			];
			for (let i = 2; i < number_of_copies; i++) {
				if (i % 2 === 0) {
					console.log('odd');
					gcode_array = [ ...gcode_array, gcode_parts.file_1.middle_1, remove_print ];
				} else if (i % 2 === 1) {
					console.log('even');
					gcode_array = [ ...gcode_array, gcode_parts.file_2.middle_2, remove_print ];
				}
			}
			gcode_array = [ ...gcode_array, gcode_parts.file_2.ending_2 ];
		}

		const array = gcode_array.map((item) => {
			return item.join('\n');
		});
		const gcode = array.join('\n');
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
						<label className="mr-1rem w-50per fw-800">Select Gcode</label>
						<label className="btn primary w-50per">
							<label className="">Choose gcode files</label>
							<input
								className="btn primary"
								type="file"
								id="file"
								multiple
								onChange={(e) => showFiles(e)}
							/>
						</label>
					</div>
					<label className="form-item">{gcode_name}</label>
					<div className="form-item">
						<label className="mr-1rem w-50per fw-800">Number of Copies</label>
						<input
							type="number"
							className="w-50per"
							defaultValue={number_of_copies}
							onChange={(e) => set_number_of_copies(e.target.value)}
						/>
					</div>
					<div className="w-100per mb-2rem">
						<label htmlFor="color_change">Color Change</label>
						<input
							type="checkbox"
							name="color_change"
							defaultChecked={color_change}
							id="color_change"
							onChange={(e) => {
								set_color_change(e.target.checked);
							}}
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
		</div>
	);
}

export default App;
