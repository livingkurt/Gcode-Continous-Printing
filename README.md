# Gcode Batch Printing
Turn your 3D Printer into a small factory with the Gcode Batch Printing Web App

This app allows you to print parts that need to be printed one at a time with an auto eject and start over feature so you dont have to start each print manually

Gcode Steps

In Prusaslicer
- Load your model into Prusa Slicer
- Adjust settings as you would normally
- Make sure to remove the skirt
- Place one of your parts in the front middle of your heated bed
- Save project and gcode to file with 1/2 ... in the beginning of the name
- Then move the near the center of your headed bed
- Then Save a second project and gcode to file with 2/2 ... in the beginning of the name

Install Steps

First clone this repo

```shell
git@github.com:livingkurt/Gcode-Batch-Printing.git
```

Install Dependancies

```shell
npm install
```
Start App

```shell
npm start
```

In Gcode Batch Printing

- Start app
- Select your 1/2... file in the first file chooser
- Select your 2/2... file in the second file chooser
- Adjust the amount your want to print
- Click Create Gcode File

