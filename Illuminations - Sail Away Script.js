// Title: Sail Away
// Contributed by: Evan Harrison
// Song credit goes to Teminite, thanks to Ableton for making the launchpad and Kaskobi for being an awesome source of inspiration
// Kaskobi link: https://www.youtube.com/c/KaskobiOfficial

//p5 reference: https://p5js.org/reference/
const lightCount = 120;
const midHeight = 50;
const height = helpers.canvas.height;
const width = helpers.canvas.width;

//Variables related to the music
let time = 0;
let BPM = 170 * controls.bPMMultiplier.value;
let beat = 1;
let offset = controls.offset.value; //Audio / Visual offset (milliseconds)
let delay = 0; //Delay before starting (milliseconds)

let song;
let songPath = 'C:/Users/empir/Downloads/Music/Teminite - Sail Away (Cut v2).mp3'
let volume = 0;

//Arrays of all of the functions
let futureEffectList = []; //2D array of Beat, function, parameters
let currentEffectList = [];
let effectsToRemove = [];

//API information
const dataPath = "C:/Users/empir/Downloads/MIT Stuff/Illuminations/Sail Away API Data.json"; //If you use the API save the path of the file here so I can conserve API uses
let currentSpeed = 0;
let swellPeriod = 0;
let windSpeed = 0;
let windWavePeriod = 0;

function preload()
{
    if (controls.stop.value == 1) { return; }
    console.log("Loaded");
    soundFormats('mp3', 'ogg'); //The current song is an MP3 but I'll keep the ogg option available
	song = loadSound(songPath);
    
    //Grab the API data if we're using it
    if (controls.useAPI.value == 1) { useAPI(); }
}

function setup() {
    if (controls.stop.value == 1) { return; }
    createCanvas(helpers.canvas.width, helpers.canvas.height); //Width: 1200, Height: 100
    rectMode(CENTER);
    noStroke();
    
    //Append all of the light effects to the effect list
    createLightEffects();
    
    //Song setup
    volume = controls.volume.value;
    outputVolume(volume);
    
    song.stop();
    song.play(); //Uncomment this when I'm ready to play
    song.jump(60 * (controls.startingBeat.value - 1) / BPM < song.duration() ? 60 * (controls.startingBeat.value - 1) / BPM : 0);
}

function draw() 
{
    if (controls.stop.value == 1) { return; }
    
    //Keep track of the beat
    time = millis() / 1000; //might want to switch to currentTime()
    beat = (time / 60) * BPM + 1 - offset/1000 + (controls.startingBeat.value - 1);
    
    //Keep track of the lights, playing each function when needed
    manageLightEffects();
}

function manageLightEffects()
{
    for (let i = 0; i < futureEffectList.length; i++)
    {
        if (futureEffectList[i][0] <= beat)
        {
            //Be very careful with the ordering, the light effects are played in the order that they appear in currentEffectList
            if (futureEffectList[i][1] == bgpulse){currentEffectList.unshift(futureEffectList[i]);}
            else { currentEffectList.push(futureEffectList[i]); }            
            futureEffectList.splice(i, 1);
        }
    }
    
    currentEffectList.forEach(function(effect){ effect[1].apply(null, effect[2]); })
    
    //Remove all of the finished light effects from the current effect list (there's probably a more efficient way to do this but I don't know how)
    effectsToRemove.forEach(function(index){ currentEffectList.splice(index, 1, "Removed"); })
    while (currentEffectList.indexOf("Removed") != -1) { currentEffectList.splice(currentEffectList.indexOf("Removed"), 1); }
    effectsToRemove = [];
}

function createLightEffects()
{
    //Adding all light effects to the effect list
    
    //Constant Variables
    const harpHigh1Light = 80, harpHigh1Color = [249, 187, 61, 255], harpHigh1Fade = [249, 187, 61, 0];
    const harpHigh2Light = 70, harpHigh2Color = [249, 141, 34, 255], harpHigh2Fade = [249, 141, 34, 0];
    const harpHigh3Light = 75, harpHigh3Color = [239, 89, 52, 255], harpHigh3Fade = [239, 89, 52, 0];
    const harpHigh4Light = 65, harpHigh4Color = [251, 110, 90, 255], harpHigh4Fade = [251, 110, 90, 0];
    const harpLow1Light = 50, harpLow1Color = [233, 74, 121, 255], harpLow1Fade = [233, 74, 121, 0];
    const harpLow2Light = 55, harpLow2Color = [255, 105, 150, 255], harpLow2Fade = [255, 105, 150, 0];
    const harpLow3Light = 45, harpLow3Color = [178, 40, 123, 255], harpLow3Fade = [178, 40, 123, 0];
    const off = [0, 0, 0, 0];
    const white = [255, 255, 255, 255]
    const black = [0, 0, 0, 255]
    
    //Beats 1-64: Smooth single light flashes
    for (let j = 0; j < 2; j++)
    {
        for (let i = 1 + 16 * j; i <= 4 + 16 * j; i++)
        {
            futureEffectList.push([i * 2 - 1, pulse, [i * 2 - 1, harpHigh1Light, harpHigh1Light, 0, 0, 1.5, harpHigh1Color, harpHigh1Color, harpHigh1Fade]]);
            futureEffectList.push([i * 2, pulse, [i * 2, harpHigh2Light, harpHigh2Light, 0, 0, 1.5, harpHigh2Color, harpHigh2Color, harpHigh2Fade]]);

            futureEffectList.push([i * 2 - 0.5, pulse, [i * 2 - 0.5, harpLow1Light, harpLow1Light, 0, 0, 1.5, harpLow1Color, harpLow1Color, harpLow1Fade]]);
            futureEffectList.push([i * 2 + 0.5, pulse, [i * 2 + 0.5, harpLow1Light, harpLow1Light, 0, 0, 1.5, harpLow1Color, harpLow1Color, harpLow1Fade]]);
        }

        for (let i = 5 + 16 * j; i <= 8 + 16 * j; i++)
        {
            futureEffectList.push([i * 2 - 1, pulse, [i * 2 - 1, harpHigh3Light, harpHigh3Light, 0, 0, 1.5, harpHigh3Color, harpHigh3Color, harpHigh3Fade]]);
            futureEffectList.push([i * 2, pulse, [i * 2, harpHigh2Light, harpHigh2Light, 0, 0, 1.5, harpHigh2Color, harpHigh2Color, harpHigh2Fade]]);
            
            futureEffectList.push([i * 2 - 0.5, pulse, [i * 2 - 0.5, harpLow1Light, harpLow1Light, 0, 0, 1.5, harpLow1Color, harpLow1Color, harpLow1Fade]]);
            futureEffectList.push([i * 2 + 0.5, pulse, [i * 2 + 0.5, harpLow1Light, harpLow1Light, 0, 0, 1.5, harpLow1Color, harpLow1Color, harpLow1Fade]]);
        }
        
        for (let i = 9 + 16 * j; i <= 12 + 16 * j; i++)
        {
            futureEffectList.push([i * 2 - 1, pulse, [i * 2 - 1, harpHigh1Light, harpHigh1Light, 0, 0, 1.5, harpHigh1Color, harpHigh1Color, harpHigh1Fade]]);
            futureEffectList.push([i * 2, pulse, [i * 2, harpHigh2Light, harpHigh2Light, 0, 0, 1.5, harpHigh2Color, harpHigh2Color, harpHigh2Fade]]);

            futureEffectList.push([i * 2 - 0.5, pulse, [i * 2 - 0.5, harpLow2Light, harpLow2Light, 0, 0, 1.5, harpLow2Color, harpLow2Color, harpLow2Fade]]);
            futureEffectList.push([i * 2 + 0.5, pulse, [i * 2 + 0.5, harpLow2Light, harpLow2Light, 0, 0, 1.5, harpLow2Color, harpLow2Color, harpLow2Fade]]);
        }

        for (let i = 13 + 16 * j; i <= 14 + 16 * j; i++)
        {
            futureEffectList.push([i * 2 - 1, pulse, [i * 2 - 1, harpHigh3Light, harpHigh3Light, 0, 0, 1.5, harpHigh3Color, harpHigh3Color, harpHigh3Fade]]);
            futureEffectList.push([i * 2, pulse, [i * 2, harpHigh2Light, harpHigh2Light, 0, 0, 1.5, harpHigh2Color, harpHigh2Color, harpHigh2Fade]]);
            
            if (j % 2 == 0)
            {
                futureEffectList.push([i * 2 - 0.5, pulse, [i * 2 - 0.5, harpLow1Light, harpLow1Light, 0, 0, 1.5, harpLow1Color, harpLow1Color, harpLow1Fade]]);
                futureEffectList.push([i * 2 + 0.5, pulse, [i * 2 + 0.5, harpLow1Light, harpLow1Light, 0, 0, 1.5, harpLow1Color, harpLow1Color, harpLow1Fade]]);
            }
            
            else
            {
                futureEffectList.push([i * 2 - 0.5, pulse, [i * 2 - 0.5, harpLow3Light, harpLow3Light, 0, 0, 1.5, harpLow3Color, harpLow3Color, harpLow3Fade]]);
            	futureEffectList.push([i * 2 + 0.5, pulse, [i * 2 + 0.5, harpLow3Light, harpLow3Light, 0, 0, 1.5, harpLow3Color, harpLow3Color, harpLow3Fade]]);
            }
        }

        for (let i = 15 + 16 * j; i <= 16 + 16 * j; i++)
        {
            futureEffectList.push([i * 2 - 1, pulse, [i * 2 - 1, harpHigh3Light, harpHigh3Light, 0, 0, 1.5, harpHigh3Color, harpHigh3Color, harpHigh3Fade]]);
            futureEffectList.push([i * 2, pulse, [i * 2, harpHigh4Light, harpHigh4Light, 0, 0, 1.5, harpHigh4Color, harpHigh4Color, harpHigh4Fade]]);

            if (j % 2 == 0)
            {
                futureEffectList.push([i * 2 - 0.5, pulse, [i * 2 - 0.5, harpLow1Light, harpLow1Light, 0, 0, 1.5, harpLow1Color, harpLow1Color, harpLow1Fade]]);
                futureEffectList.push([i * 2 + 0.5, pulse, [i * 2 + 0.5, harpLow1Light, harpLow1Light, 0, 0, 1.5, harpLow1Color, harpLow1Color, harpLow1Fade]]);
            }
            
            else
            {
                futureEffectList.push([i * 2 - 0.5, pulse, [i * 2 - 0.5, harpLow3Light, harpLow3Light, 0, 0, 1.5, harpLow3Color, harpLow3Color, harpLow3Fade]]);
            	futureEffectList.push([i * 2 + 0.5, pulse, [i * 2 + 0.5, harpLow3Light, harpLow3Light, 0, 0, 1.5, harpLow3Color, harpLow3Color, harpLow3Fade]]);
            }
        }
    }
    
    //Wind on beat 14
    futureEffectList.unshift([14, bgpulse, [14, 6, 0, 6, off, [25, 25, 25, 255], off]]);
    futureEffectList.unshift([15, wave, [15, 1, 120, 8, 50, 10, [50, 50, 50], 0, 25]]);
    
    //Vibrations with the bass on beats 33 - 61
    const bassWidth = 20;
    const bass1Light = 10, bass1Color = [0, 0, 75, 255];
    const bass2Light = 15, bass2Color = [0, 36, 75, 255];
    const bass3Light = 10, bass3Color = [0, 0, 75, 255];
    const bass4Light = 5, bass4Color = [18, 0, 75, 255];
    const bass5Light = 10, bass5Color = [0, 0, 75, 255];
    const bass6Light = 5, bass6Color = [33, 0, 75, 255];
    const bass7Light = 20, bass7Color = [0, 75, 75, 255];
    const bass8Light = 15, bass8Color = [0, 50, 75, 255];
    
    futureEffectList.push([33, vibrate, [33, bass1Light, bass1Light + bassWidth, 0, 0, 0.5, off, bass1Color, [bass1Color[0] * 3 / 4, bass1Color[1] * 3 / 4, bass2Color[2] * 3 / 4, bass3Color[3] * 3 / 4], 1, 20]]);
    futureEffectList.push([33.5, vibrate, [33.5, bass2Light, bass2Light + bassWidth, 0, 0, 5, off, bass2Color, off, 1, 20]]);
    
    futureEffectList.push([40.5, vibrate, [40.5, bass3Light, bass3Light + bassWidth, 0, 0, 0.5, off, bass3Color, [bass3Color[0] * 3 / 4, bass3Color[1] * 3 / 4, bass3Color[2] * 3 / 4, bass3Color[3] * 3 / 4], 1, 20]]);
    futureEffectList.push([41, vibrate, [41, bass4Light, bass4Light + bassWidth, 0, 0, 6, off, bass4Color, off, 1, 20]]);
    
    futureEffectList.push([49, vibrate, [49, bass5Light, bass5Light + bassWidth, 0, 0, 4, off, bass5Color, off, 1, 20]]);
    futureEffectList.push([53, vibrate, [53, bass6Light, bass6Light + bassWidth, 0, 0, 4, off, bass6Color, off, 1, 20]]);
    futureEffectList.push([57, vibrate, [57, bass7Light, bass7Light + bassWidth, 0, 0, 4, off, bass7Color, off, 1, 20]]);
    futureEffectList.push([61, vibrate, [61, bass8Light, bass8Light + bassWidth, 0, 0, 4, off, bass8Color, off, 1, 20]]);
    
    //Howl on beat 38 (to 50)
    futureEffectList.unshift([38, bgpulse, [38, 3, 0, 8, off, [25, 25, 25, 255], [50, 50, 50, 255]]]);
    futureEffectList.unshift([49, bgpulse, [49, 0, 0, 6, [50, 50, 50, 255], [50, 50, 50, 255], [0, 0, 0, 255]]]);
    
    //Speeding up side swipe which fades to waves on beat 55
    futureEffectList.unshift([55, bgpulse, [55, 6, 0, 4, off, [0, 0, 75, 255], [100, 100, 255, 255]]]);
    for (let i = 0; i < 20; i++)
    {
        if (i < 10) { futureEffectList.push([55 + i, wave, [55 + i, 0, 120, 4 - Math.pow(i / 20, 3) * 2, 20 + Math.pow(i / 20, 3) * 10, 0, [0, 0, 255], 255 * (i / 20), 255 * (i / 20)]]); }
    }
    
    //Background waves on beats 65-129 (this is where useAPI comes in)
    futureEffectList.unshift([65, bgpulse, [65, 2, 58, 4, [100, 100, 255, 255], [0, 0, 255, 255], [255, 255, 255, 255]]]);
    
    if (controls.useAPI.value == 1) 
    { 
        const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
        
        let APIseed = currentSpeed * swellPeriod * windSpeed * windWavePeriod;
        let APIspeed = clamp(currentSpeed * 6, 0.75, 1.5);
        let APIwidth = clamp(swellPeriod, 6, 10);
        let APIduration = clamp(windWavePeriod * 3, 8, 12);
        console.log(APIseed + " " + APIspeed + " " + APIwidth + " " + APIduration);
        while (APIseed > 1) { APIseed /= 10; }
        
        futureEffectList.push([65, randomPulses, [65, 1, 120, 62, APIduration, APIwidth, APIspeed, APIseed, [0, 0, 255, 0], [0, 100, 255, 255], [0, 0, 255, 0]]]); 
    }
    else { futureEffectList.push([65, randomPulses, [65, 1, 120, 62, 10, 10, 1, Math.random(), [0, 0, 255, 0], [0, 100, 255, 255], [0, 0, 255, 0]]]); }
    
    //Shimmer effect on beat 94
    futureEffectList.push([95, randomPulses, [95, 1, 120, 2.5, 1, 1, 8, Math.random(), off, [255, 255, 255, 255], off]]);
    
    //Voice effects from beats 65-129
    const voiceLineColor1 = [251, 194, 63, 255];
    const voiceLineColor2 = [251, 194, 63, 255];
    const voiceLineFadeTime = 0.25;
    const voiceLineHoldTime = 0;
    futureEffectList.push([65, move, [65, 50, 60, voiceLineFadeTime, 3.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1]]);
    futureEffectList.push([66.5, move, [66.5, 75, 60, voiceLineFadeTime, 2, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1]]);
    futureEffectList.push([67, move, [67, 30, 60, voiceLineFadeTime, 1.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1, "cubein"]]);
    futureEffectList.push([68, move, [68, 90, 60, voiceLineFadeTime, 0.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1, "cubein"]]);
    futureEffectList.push([69, radiate, [69, 60, 10, 4, [255,255,255,255], [255,255,255,0], "cubeout"]]);
    futureEffectList.push([71.5, move, [71.5, 50, 80, voiceLineFadeTime, 5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1, "cubeout"]]);
    futureEffectList.push([72, move, [72, 40, 80, voiceLineFadeTime, 4.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1, "cubeout"]]);
    futureEffectList.push([72.5, move, [72.5, 100, 80, voiceLineFadeTime, 4, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1, "cubeout"]]);
    futureEffectList.push([73, move, [73, 110, 80, voiceLineFadeTime, 3.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1, "cubeout"]]);
    futureEffectList.push([74.5, radiate, [74.5, 30, 5, 2, voiceLineColor2, [255,255,255,0], "cubeout"]]);
    futureEffectList.push([75, radiate, [75, 50, 5, 2, voiceLineColor2, [255,255,255,0], "cubeout"]]);
    futureEffectList.push([76, radiate, [76, 100, 5, 2, voiceLineColor2, [255,255,255,0], "cubeout"]]);
    futureEffectList.push([77, radiate, [77, 80, 10, 4, [255,255,255,255], [255,255,255,0], "cubeout"]]);
    futureEffectList.push([79.5, move, [79.5, 20, 30, voiceLineFadeTime, 3.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor2, "cubeout"]]);
    futureEffectList.push([80, move, [80, 25, 45, voiceLineFadeTime, 3.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor2, "cubeout"]]);
    futureEffectList.push([80.5, move, [80.5, 120, 105, voiceLineFadeTime, 3.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor2, "cubeout"]]);
    futureEffectList.push([81, move, [81, 115, 90, voiceLineFadeTime, 3.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor2, "cubeout"]]);
    futureEffectList.push([82, move, [82, 100, 75, voiceLineFadeTime, 3.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor2, "cubeout"]]);
    futureEffectList.push([82.5, move, [82.5, 90, 60, voiceLineFadeTime, 3.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor2, "cubeout"]]);
    futureEffectList.push([83.5, radiate, [83.5, 30, 5, 2, voiceLineColor2, [255,255,255,0], "cubeout"]]);
    futureEffectList.push([84, radiate, [84, 45, 5, 2, voiceLineColor2, [255,255,255,0], "cubeout"]]);
    futureEffectList.push([84.5, radiate, [84.5, 105, 5, 2, voiceLineColor2, [255,255,255,0], "cubeout"]]);
    futureEffectList.push([85, radiate, [85, 90, 5, 2, voiceLineColor2, [255,255,255,0], "cubeout"]]);
    futureEffectList.push([86, radiate, [86, 75, 5, 2, voiceLineColor2, [255,255,255,0], "cubeout"]]);
    futureEffectList.push([86.5, radiate, [86.5, 60, 5, 2, voiceLineColor2, [255,255,255,0], "cubeout"]]);  
    futureEffectList.push([89, move, [89, 50, 60, 0, 1.5, 0, off, voiceLineColor1, voiceLineColor2, "cubeout"]]);
    futureEffectList.push([89.5, move, [89.5, 70, 60, 0, 1, 0, off, voiceLineColor1, voiceLineColor2, "cubeout"]]);
    futureEffectList.push([90.5, radiate, [90.5, 60, 30, 2, voiceLineColor2, [255, 255, 255, 150], "quadout"]]);
    futureEffectList.push([91.5, move, [91.5, 20, 30, voiceLineFadeTime, 0.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor2, "quadout"]]);
    futureEffectList.push([92, move, [92, 100, 90, voiceLineFadeTime, 0, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor2, "quadout"]]);
    futureEffectList.push([92.5, radiate, [92.5, 30, 12, 4, voiceLineColor2, [255,255,255,0], "quadout"]]);
    futureEffectList.push([92.5, radiate, [92.5, 90, 12, 4, voiceLineColor2, [255,255,255,0], "quadout"]]);
    
    futureEffectList.push([97, move, [97, 70, 80, voiceLineFadeTime, 3.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1]]);
    futureEffectList.push([98.5, move, [98.5, 95, 80, voiceLineFadeTime, 2, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1]]);
    futureEffectList.push([99, move, [99, 50, 80, voiceLineFadeTime, 1.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1, "cubein"]]);
    futureEffectList.push([100, move, [100, 110, 80, voiceLineFadeTime, 0.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1, "cubein"]]);
    futureEffectList.push([101, radiate, [101, 80, 10, 4, [255,255,255,255], [255,255,255,0], "cubeout"]]);   
    futureEffectList.push([104.5, move, [104.5, 10, 30, voiceLineFadeTime, 3.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1, "cubeout"]]);
    futureEffectList.push([105, move, [105, 20, 90, voiceLineFadeTime, 3, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1, "cubeout"]]);
    futureEffectList.push([106, move, [106, 100, 75, voiceLineFadeTime, 3, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1, "cubeout"]]);
    futureEffectList.push([106.5, move, [106.5, 90, 60, voiceLineFadeTime, 3.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1, "cubeout"]]);
    futureEffectList.push([107.5, move, [107.5, 80, 45, voiceLineFadeTime, 1.5, voiceLineFadeTime, off, voiceLineColor1, voiceLineColor1, "cubeout"]]);
    futureEffectList.push([108.5, radiate, [108.5, 30, 5, 4, voiceLineColor2, [255,255,255,0], "cubeout"]]);
    futureEffectList.push([108.5, radiate, [108.5, 90, 5, 4, voiceLineColor2, [255,255,255,0], "cubeout"]]);
    futureEffectList.push([109.5, radiate, [109.5, 45, 5, 4, voiceLineColor2, [255,255,255,0], "cubeout"]]);
    futureEffectList.push([109.5, radiate, [109.5, 75, 5, 4, voiceLineColor2, [255,255,255,0], "cubeout"]]);    
    futureEffectList.push([110.5, move, [110.5, 60, 20, 0, 2.333, 0, off, [255, 255, 255, 255], [255, 255, 255, 255], "quadout"]]);
    futureEffectList.push([110.5+2.333, move, [110.5+2.333, 20, 60, 0, 2.333, 0, off, [255, 255, 255, 255], [255, 255, 255, 255], "quadin"]]);
    futureEffectList.push([110.5+2.333*2, move, [110.5+2.333*2, 60, 100, 0, 2.333, 0, off, [255, 255, 255, 255], [255, 255, 255, 255], "quadout"]]);
    futureEffectList.push([110.5+2.333*3, move, [110.5+2.333*3, 100, 60, 0, 2.333, 0, off, [255, 255, 255, 255], [255, 255, 255, 255], "quadin"]]);
    futureEffectList.push([110.5+2.333*4, move, [110.5+2.333*4, 60, 20, 0, 2.333, 0, off, [255, 255, 255, 255], [255, 255, 255, 255], "quadout"]]);
    futureEffectList.push([110.5+2.333*5, move, [110.5+2.333*5, 20, 60, 0, 2.333, 0, off, [255, 255, 255, 255], [255, 255, 255, 255], "quadin"]]);   
    futureEffectList.push([110.5, move, [110.5, 60, 100, 0, 2.333, 0, off, [255, 255, 255, 255], [255, 255, 255, 255], "quadout"]]);
    futureEffectList.push([110.5+2.333, move, [110.5+2.333, 100, 60, 0, 2.333, 0, off, [255, 255, 255, 255], [255, 255, 255, 255], "quadin"]]);
    futureEffectList.push([110.5+2.333*2, move, [110.5+2.333*2, 60, 20, 0, 2.333, 0, off, [255, 255, 255, 255], [255, 255, 255, 255], "quadout"]]);
    futureEffectList.push([110.5+2.333*3, move, [110.5+2.333*3, 20, 60, 0, 2.333, 0, off, [255, 255, 255, 255], [255, 255, 255, 255], "quadin"]]);
    futureEffectList.push([110.5+2.333*4, move, [110.5+2.333*4, 60, 100, 0, 2.333, 0, off, [255, 255, 255, 255], [255, 255, 255, 255], "quadout"]]);
    futureEffectList.push([110.5+2.333*5, move, [110.5+2.333*5, 100, 60, 0, 2.333, 0, off, [255, 255, 255, 255], [255, 255, 255, 255], "quadin"]]);
    futureEffectList.push([124.5, radiate, [124.5, 60, 60, 2, [255,255,255,65], [255,255,255,0]]]);
    futureEffectList.push([125, radiate, [125, 60, 60, 2, [255,255,255,65], [255,255,255,0]]]);
    futureEffectList.push([125.5, radiate, [125.5, 60, 60, 2, [255,255,255,65], [255,255,255,0]]]);   
    futureEffectList.push([124.5, radiate, [124.5, 60, 40, 5, [255,255,255,255], [255,255,255,0], "quadout"]]);
    futureEffectList.push([125, radiate, [125, 60, 40, 5, [255,255,255,127], [255,255,255,0], "quadout"]]);
	futureEffectList.push([125.5, radiate, [125.5, 60, 40, 5, [255,255,255,63], [255,255,255,0], "quadout"]]);  
    futureEffectList.push([112, move, [112, 95, 30, 0, 2, 0, off, voiceLineColor1, voiceLineColor1]]);
    futureEffectList.push([112.5, move, [112.5, 99, 30, 0, 1.5, 0, off, voiceLineColor1, voiceLineColor1]]);
    futureEffectList.push([113, move, [113, 100, 40, 0, 1.5, 0, off, voiceLineColor1, voiceLineColor1]]);
    futureEffectList.push([114, radiate, [114.5, 30, 5, 2, [0,230,180,255], [0,230,180,0], "quadout"]]);
    futureEffectList.push([114.5, radiate, [114.5, 40, 5, 2, [0,230,180,255], [0,230,180,0], "quadout"]]);   
    futureEffectList.push([115.5, move, [115.5, 71, 20, 0, 2, 0, off, voiceLineColor1, voiceLineColor1]]);
    futureEffectList.push([116.5, move, [116.5, 93, 27, 0, 2, 0, off, voiceLineColor1, voiceLineColor1]]);
    futureEffectList.push([117.5, radiate, [117.5, 20, 5, 2, [0,230,180,255], [0,230,180,0], "quadout"]]);
	futureEffectList.push([118.5, radiate, [118.5, 27, 5, 2, [0,230,180,255], [0,230,180,0], "quadout"]]);   
    futureEffectList.push([120, move, [120, 65, 30, 0, 1, 0, off, voiceLineColor1, voiceLineColor1]]);
    futureEffectList.push([121, radiate, [121, 30, 5, 2, [0,230,180,255], [0,230,180,0], "quadout"]]);    
    futureEffectList.push([122.5, move, [122.5, 99, 60, 0, 2, 0, off, [0,230,180,255], [0,230,180,0], "cubicout"]]);
    futureEffectList.push([123, move, [123, 25, 60, 0, 1.5, 0, off, [0,230,180,255], [0,230,180,0], "cubicout"]]);
    futureEffectList.push([123.5, move, [123.5, 33, 60, 0, 1, 0, off, [0,230,180,255], [0,230,180,0], "cubicout"]]);
    futureEffectList.push([124, move, [124, 45, 60, 0, 0.5, 0, off, [0,230,180,255], [0,230,180,0], "cubicout"]]);
    
    //BRIDGE 1   
    //Piano and bass from beats 125 - 157
    for (let i = 0; i < 2; i++)
    {
        futureEffectList.push([130 + 16*i, pulse, [130 + 16*i, 65, 85, 0, 0, 1, off, [255, 127, 0, 255], [255, 0, 0, 155]]]);
        futureEffectList.push([131 + 16*i, pulse, [131 + 16*i, 65, 85, 0, 0, 0.5, off, [255, 127, 0, 255], [255, 0, 0, 205]]]);
        futureEffectList.push([131.5 + 16*i, pulse, [131.5 + 16*i, 35, 55, 0, 0, 1, off, [0, 255, 255, 255], [0, 127, 255, 155]]]);
        futureEffectList.push([132.5 + 16*i, pulse, [132.5 + 16*i, 65, 85, 0, 0, 1, off, [255, 127, 0, 255], [255, 0, 0, 155]]]);
        futureEffectList.push([133.5 + 16*i, pulse, [133.5 + 16*i, 65, 85, 0, 0, 1, off, [255, 127, 0, 255], [255, 0, 0, 155]]]);
        futureEffectList.push([134.5 + 16*i, pulse, [134.5 + 16*i, 65, 85, 0, 0, 0.5, off, [255, 127, 0, 255], [255, 0, 0, 205]]]);
        futureEffectList.push([135 + 16*i, pulse, [135 + 16*i, 65, 85, 0, 0, 0.5, off, [255, 127, 0, 255], [255, 0, 0, 205]]]);
        futureEffectList.push([135.5 + 16*i, pulse, [135.5 + 16*i, 35, 55, 0, 0, 0.5, off, [0, 255, 255, 255], [0, 127, 255, 205]]]);
        futureEffectList.push([136 + 16*i, pulse, [136 + 16*i, 65, 85, 0, 0, 2, off, [255, 127, 0, 255], [255, 0, 0, 105]]]);
        futureEffectList.push([137.5 + 16*i, pulse, [137.5 + 16*i, 75, 85, 0, 0, 0.5, off, [255, 255, 0, 100], [255, 255, 0, 100]]]);
        
        futureEffectList.push([138 + 16*i, pulse, [138 + 16*i, 65, 85, 0, 0, 1, off, [255, 127, 0, 255], [255, 0, 0, 155]]]);
        futureEffectList.push([139 + 16*i, pulse, [139 + 16*i, 65, 85, 0, 0, 0.5, off, [255, 127, 0, 255], [255, 0, 0, 205]]]);
        futureEffectList.push([139.5 + 16*i, pulse, [139.5 + 16*i, 35, 55, 0, 0, 1, off, [0, 255, 255, 255], [0, 127, 255, 155]]]);
        futureEffectList.push([140.5 + 16*i, pulse, [140.5 + 16*i, 65, 85, 0, 0, 1, off, [255, 127, 0, 255], [255, 0, 0, 155]]]);
        futureEffectList.push([141.5 + 16*i, pulse, [141.5 + 16*i, 65, 85, 0, 0, 1, off, [255, 127, 0, 255], [255, 0, 0, 155]]]);
    }
	
    futureEffectList.push([142.5, pulse, [142.5, 65, 85, 0, 0, 0.5, off, [255, 127, 0, 255], [255, 0, 0, 205]]]);
    futureEffectList.push([143, pulse, [143, 70, 90, 0, 0, 0.5, off, [255, 200, 0, 255], [255, 200, 0, 205]]]);
    futureEffectList.push([143.5, pulse, [143.5, 75, 95, 0, 0, 0.5, off, [255, 255, 0, 255], [255, 255, 0, 205]]]);
    futureEffectList.push([144, pulse, [144, 35, 55, 0, 0, 0.5, off, [0, 255, 255, 255], [0, 127, 255, 205]]]);
    futureEffectList.push([144.5, pulse, [144.5, 65, 85, 0, 0, 2, off, [255, 127, 0, 255], [255, 0, 0, 105]]]);
    
    futureEffectList.push([142.5, pulse, [142.5, 90, 100, 0, 0, 0.5, off, [0, 128, 255, 255], [0, 0, 255, 255]]]);
    futureEffectList.push([143, pulse, [143, 98, 108, 0, 0, 0.5, off, [0, 200, 255, 255], [0, 200, 255, 255]]]);
    futureEffectList.push([143.5, pulse, [143.5, 106, 116, 0, 0, 0.5, off, [0, 255, 200, 255], [0, 255, 200, 255]]]);
    futureEffectList.push([144, vibrate, [144, 95, 105, 0, 0.5, 0, off, [0,200,0,255], off, 1, 40]]);
    futureEffectList.push([144.5, vibrate, [144.5, 90, 102, 0, 1.5, 0, off, [0,100,0,255], off, 1, 40]]);
    
    futureEffectList.push([158.5, pulse, [158.5, 65, 85, 0, 0, 0.5, off, [255, 127, 0, 255], [255, 0, 0, 205]]]);
    futureEffectList.push([159, pulse, [159, 65, 85, 0, 0, 0.5, off, [255, 127, 0, 255], [255, 0, 0, 205]]]);
    futureEffectList.push([159.5, pulse, [159.5, 65, 85, 0, 0, 0.5, off, [255, 127, 0, 255], [255, 0, 0, 205]]]);
    futureEffectList.push([160, pulse, [160, 35, 55, 0, 0, 0.5, off, [0, 255, 255, 255], [0, 127, 255, 205]]]);
    futureEffectList.push([160.5, pulse, [160.5, 65, 85, 0, 0, 0.5, off, [255, 127, 0, 255], [255, 0, 0, 205]]]);
    
    //Bass bar (143)
    futureEffectList.push([143.5, move, [143.5, 0, 25, 0, 1, 0, off, [255, 255, 255, 255], [255, 255, 255, 255], "cubeout"]]);
    futureEffectList.push([144.5, pulse, [144.5, 25, 26, 0, 7, 0.5, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([151, move, [151, 0, 30, 0, 1, 0, off, [255, 255, 255, 255], [255, 255, 255, 255], "cubeout"]]);
    futureEffectList.push([152, pulse, [152, 30, 31, 0, 7, 0.5, off, [255, 255, 255, 255], off]]);

    //Bass initial wave (144.5)
    futureEffectList.unshift([144.5, wave, [144.5, 24, 0, 7.5, 1000, 0, [117, 82, 251], 255, 127]]);
    futureEffectList.unshift([152, wave, [152, 29, 0, 7.5, 1000, 0, [117, 82, 251], 255, 127]]);

    //Bass continual waves (144.5)
    for (let i = 0; i < 5; i++)
    {
        futureEffectList.push([144.5 + 1.5 * i, wave, [144.5 + 1.5 * i, 24, 0, 1, 20, 0, [148, 111, 249], 255, 255 - 30 * i]]);
        futureEffectList.push([152 + 1.5 * i, wave, [152 + 1.5 * i, 29, 0, 1, 20, 0, [148, 111, 249], 255, 255 - 30 * i]]);
    }
    
    //BUILDUP 1
    
    let laserBorderColor = [255, 255, 255, 255];
    let laserFillColor = [189, 25, 25, 255];
    
    futureEffectList.push([154.5, move, [154.5, 120, 100, 0, 3, 0, off, laserBorderColor, laserBorderColor, "cubeout"]]);
    futureEffectList.push([155.5, move, [155.5, 120, 110, 0, 2, 0, off, laserBorderColor, laserBorderColor, "cubeout"]]);
    
    //Fill (this comes first so that the other lights can be layered on top)
    futureEffectList.push([157.5, pulse, [157.5, 100, 105, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([158, pulse, [158, 90, 98, 0, 0.25, 0, off, laserFillColor, off]]);
    futureEffectList.push([158.25, pulse, [158.25, 80, 91, 0, 0.25, 0, off, laserFillColor, off]]);
    futureEffectList.push([158.5, pulse, [158.5, 70, 85, 0, 0.25, 0, off, laserFillColor, off]]);
    futureEffectList.push([159, pulse, [159, 80, 87, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([159.5, pulse, [159.5, 75, 84, 0, 0.25, 0, off, laserFillColor, off]]);
    futureEffectList.push([159.75, pulse, [159.75, 70, 81, 0, 0.25, 0, off, laserFillColor, off]]);
    futureEffectList.push([160, pulse, [160, 65, 78, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([160.5, pulse, [160.5, 50, 70, 0, 1.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([160.5, move, [160.5, 70, 80, 0, 1.5, 0, off, laserFillColor, off, "quadout", true]]);
    futureEffectList.push([160.5, move, [160.5, 51, 41, 0, 1.5, 0, off, laserFillColor, off, "quadout", true]]);
    futureEffectList.push([162, pulse, [162, 31, 90, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([163, pulse, [163, 51, 70, 0, 0.5, 0, off, laserFillColor.map(i => i * 3), off]]);
    futureEffectList.push([163.5, pulse, [163.5, 31, 90, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([164.5, pulse, [164.5, 31, 90, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([165.5, pulse, [165.5, 31, 90, 0, 0.25, 0, off, laserFillColor, off]]);
    futureEffectList.push([166, pulse, [166, 31, 90, 0, 0.25, 0, off, laserFillColor, off]]);
    futureEffectList.push([166.5, pulse, [166.5, 41, 80, 0, 0.25, 0, off, laserFillColor.map(i => i * 2), off]]);
    futureEffectList.push([167, pulse, [167, 31, 90, 0, 0.25, 0, off, laserFillColor, off]]);
    futureEffectList.push([167.5, pulse, [167.5, 31, 90, 0, 0.25, 0, off, laserFillColor, off]]);
    futureEffectList.push([168, vibrate, [168, 46, 75, 0, 2, 0, off, laserFillColor.map(i => i * 2.5), off, 1, 20]]);
    futureEffectList.push([170, pulse, [170, 31, 90, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([171, pulse, [171, 51, 70, 0, 0.5, 0, off, laserFillColor.map(i => i * 3), off]]);
    futureEffectList.push([171.5, pulse, [171.5, 31, 90, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([172.5, pulse, [172.5, 31, 90, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([173.5, pulse, [173.5, 31, 90, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([174.5, pulse, [174.5, 31, 90, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([175, pulse, [175, 36, 85, 0, 0.5, 0, off, laserFillColor.map(i => i * 1.5), off]]);
    futureEffectList.push([175.5, pulse, [175.5, 41, 80, 0, 0.5, 0, off, laserFillColor.map(i => i * 2), off]]);
    futureEffectList.push([176, pulse, [176, 46, 75, 0, 0.5, 0, off, laserFillColor.map(i => i * 2.5), off]]);
    futureEffectList.push([176.5, vibrate, [176.5, 41, 80, 0, 1, 0, off, laserFillColor.map(i => i * 2), off, 1, 20]]);
    futureEffectList.push([177.5, pulse, [177.5, 36, 85, 0, 1, 0, off, laserFillColor.map(i => i * 1.5), off]]);
    futureEffectList.push([178, pulse, [178, 31, 90, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([179, pulse, [179, 51, 70, 0, 0.5, 0, off, laserFillColor.map(i => i * 3), off]]);
    futureEffectList.push([179.5, pulse, [179.5, 31, 90, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([180.5, pulse, [180.5, 31, 90, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([181.5, pulse, [181.5, 31, 90, 0, 0.25, 0, off, laserFillColor, off]]);
    futureEffectList.push([182, pulse, [182, 31, 90, 0, 0.25, 0, off, laserFillColor, off]]);
    futureEffectList.push([182.5, pulse, [182.5, 41, 80, 0, 0.25, 0, off, laserFillColor.map(i => i * 2), off]]);
    futureEffectList.push([183, pulse, [183, 31, 90, 0, 0.25, 0, off, laserFillColor, off]]);
    futureEffectList.push([183.5, pulse, [183.5, 31, 90, 0, 0.25, 0, off, laserFillColor, off]]);
    futureEffectList.push([184, vibrate, [184, 46, 75, 0, 2, 0, off, laserFillColor.map(i => i * 2.5), off, 1, 20]]);
    futureEffectList.push([186, pulse, [186, 31, 90, 0, 0.5, 0, off, laserFillColor, off]]);
    futureEffectList.push([187, pulse, [187, 51, 70, 0, 0.5, 0, off, laserFillColor.map(i => i * 3), off]]);
    
    futureEffectList.push([187.5, pulse, [187.5, 55, 70, 0, 0.5, 0, off, laserFillColor.map(i => i * 3), off]]);
    futureEffectList.push([188, pulse, [188, 61, 76, 0, 0.5, 0, off, laserFillColor.map(i => i * 3), off]]);
    futureEffectList.push([188.5, pulse, [188.5, 55, 70, 0, 0.5, 0, off, laserFillColor.map(i => i * 3), off]]);
    futureEffectList.push([189.5, pulse, [189.5, 55, 70, 0, 0.5, 0, off, laserFillColor.map(i => i * 3), off]]);
    futureEffectList.push([190.5, pulse, [190.5, 55, 70, 0, 0.5, 0, off, laserFillColor.map(i => i * 3), off]]);
    futureEffectList.push([191, pulse, [191, 51, 66, 0, 0.5, 0, off, laserFillColor.map(i => i * 3), off]]);
    futureEffectList.push([191.5, pulse, [191.5, 45, 60, 0, 0.5, 0, off, laserFillColor.map(i => i * 3), off]]);
    futureEffectList.push([192, pulse, [192, 30, 45, 0, 0.5, 0, off, laserFillColor.map(i => i * 3), off]]);   
    futureEffectList.push([187.5, pulse, [187.5, 85, 100, 0, 0.5, 0, off, [255, 75, 246, 255], off]]);
    futureEffectList.push([188, pulse, [188, 91, 96, 0, 0.5, 0, off, [255, 75, 246, 255], off]]);
    futureEffectList.push([188.5, pulse, [188.5, 85, 100, 0, 0.5, 0, off, [255, 75, 246, 255], off]]);
    futureEffectList.push([189.5, pulse, [189.5, 85, 100, 0, 0.5, 0, off, [255, 75, 246, 255], off]]);
    futureEffectList.push([190.5, pulse, [190.5, 85, 100, 0, 0.5, 0, off, [255, 75, 246, 255], off]]);
    futureEffectList.push([191, pulse, [191, 81, 96, 0, 0.5, 0, off, [255, 75, 246, 255], off]]);
    futureEffectList.push([191.5, pulse, [191.5, 75, 90, 0, 0.5, 0, off, [255, 75, 246, 255], off]]);
    futureEffectList.push([192, pulse, [192, 60, 75, 0, 0.5, 0, off, [255, 75, 246, 255], off]]);

    //Left side
    futureEffectList.push([157.5, pulse, [157.5, 99, 100, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([158, pulse, [158, 89, 90, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([158.25, pulse, [158.25, 79, 80, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([158.5, pulse, [158.5, 69, 70, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([159, pulse, [159, 79, 80, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([159.5, pulse, [159.5, 74, 75, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([159.75, pulse, [159.75, 69, 70, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([160, pulse, [160, 64, 65, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([160.5, move, [160.5, 50, 40, 0, 1.5, 0, off, laserBorderColor, off, "quadout"]]);
    futureEffectList.push([162, pulse, [162, 29, 30, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([163, pulse, [163, 49, 50, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([163.5, pulse, [163.5, 29, 30, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([164.5, pulse, [164.5, 29, 30, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([165.5, pulse, [165.5, 29, 30, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([166, pulse, [166, 29, 30, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([166.5, pulse, [166.5, 39, 40, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([167, pulse, [167, 29, 30, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([167.5, pulse, [167.5, 29, 30, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([168, vibrate, [168, 44, 45, 0, 2, 0, off, laserBorderColor, off, 1, 20]]);
    futureEffectList.push([170, pulse, [170, 29, 30, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([171, pulse, [171, 49, 50, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([171.5, pulse, [171.5, 29, 30, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([172.5, pulse, [172.5, 29, 30, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([173.5, pulse, [173.5, 29, 30, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([174.5, pulse, [174.5, 29, 30, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([175, pulse, [175, 34, 35, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([175.5, pulse, [175.5, 39, 40, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([176, pulse, [176, 44, 45, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([176.5, vibrate, [176.5, 39, 40, 0, 1, 0, off, laserBorderColor, off, 1, 20]]);
    futureEffectList.push([177.5, pulse, [177.5, 34, 35, 0, 1, 0, off, laserBorderColor, off]]);
    futureEffectList.push([178, pulse, [178, 29, 30, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([179, pulse, [179, 49, 50, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([179.5, pulse, [179.5, 29, 30, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([180.5, pulse, [180.5, 29, 30, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([181.5, pulse, [181.5, 29, 30, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([182, pulse, [182, 29, 30, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([182.5, pulse, [182.5, 39, 40, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([183, pulse, [183, 29, 30, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([183.5, pulse, [183.5, 29, 30, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([184, vibrate, [184, 44, 45, 0, 2, 0, off, laserBorderColor, off, 1, 20]]);
    futureEffectList.push([186, pulse, [186, 29, 30, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([187, pulse, [187, 49, 50, 0, 0.5, 0, off, laserBorderColor, off]]);
    
    futureEffectList.push([187.5, pulse, [187.5, 54, 55, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([188, pulse, [188, 60, 61, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([188.5, pulse, [188.5, 54, 55, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([189.5, pulse, [189.5, 54, 55, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([190.5, pulse, [190.5, 54, 55, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([191, pulse, [191, 49, 50, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([191.5, pulse, [191.5, 44, 45, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([192, pulse, [192, 29, 30, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
   
    futureEffectList.push([187.5, pulse, [187.5, 70, 71, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([188, pulse, [188, 66, 67, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([188.5, pulse, [188.5, 70, 71, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([189.5, pulse, [189.5, 70, 71, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([190.5, pulse, [190.5, 70, 71, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([191, pulse, [191, 66, 67, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([191.5, pulse, [191.5, 60, 61, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([192, pulse, [192, 45, 46, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);

    //Right side
    futureEffectList.push([157.5, pulse, [157.5, 105, 106, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([158, pulse, [158, 98, 99, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([158.25, pulse, [158.25, 91, 93, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([158.5, pulse, [158.5, 85, 86, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([159, pulse, [159, 87, 88, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([159.5, pulse, [159.5, 84, 85, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([159.75, pulse, [159.75, 81, 82, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([160, pulse, [160, 77, 78, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([160.5, move, [160.5, 70, 80, 0, 1.5, 0, off, laserBorderColor, off, "quadout"]]);
	futureEffectList.push([162, pulse, [162, 90, 91, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([163, pulse, [163, 70, 71, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([163.5, pulse, [163.5, 90, 91, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([164.5, pulse, [164.5, 90, 91, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([165.5, pulse, [165.5, 90, 91, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([166, pulse, [166, 90, 91, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([166.5, pulse, [166.5, 80, 81, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([167, pulse, [167, 90, 91, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([167.5, pulse, [167.5, 90, 91, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([168, vibrate, [168, 75, 76, 0, 2, 0, off, laserBorderColor, off, 1, 20]]);
    futureEffectList.push([170, pulse, [170, 90, 91, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([171, pulse, [171, 70, 71, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([171.5, pulse, [171.5, 90, 91, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([172.5, pulse, [172.5, 90, 91, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([173.5, pulse, [173.5, 90, 91, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([174.5, pulse, [174.5, 90, 91, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([175, pulse, [175, 85, 86, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([175.5, pulse, [175.5, 80, 81, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([176, pulse, [176, 75, 76, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([176.5, vibrate, [176.5, 80, 81, 0, 1, 0, off, laserBorderColor, off, 1, 20]]);
    futureEffectList.push([177.5, pulse, [177.5, 85, 86, 0, 1, 0, off, laserBorderColor, off]]);
    futureEffectList.push([178, pulse, [178, 90, 91, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([179, pulse, [179, 70, 71, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([179.5, pulse, [179.5, 90, 91, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([180.5, pulse, [180.5, 90, 91, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([181.5, pulse, [181.5, 90, 91, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([182, pulse, [182, 90, 91, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([182.5, pulse, [182.5, 80, 81, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([183, pulse, [183, 90, 91, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([183.5, pulse, [183.5, 90, 91, 0, 0.25, 0, off, laserBorderColor, off]]);
    futureEffectList.push([184, vibrate, [184, 75, 76, 0, 2, 0, off, laserBorderColor, off, 1, 20]]);
    futureEffectList.push([186, pulse, [186, 90, 91, 0, 0.5, 0, off, laserBorderColor, off]]);
    futureEffectList.push([187, pulse, [187, 70, 71, 0, 0.5, 0, off, laserBorderColor, off]]);
    
    futureEffectList.push([187.5, pulse, [187.5, 84, 85, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([188, pulse, [188, 90, 91, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([188.5, pulse, [188.5, 84, 85, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([189.5, pulse, [189.5, 84, 85, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([190.5, pulse, [190.5, 84, 85, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([191, pulse, [191, 79, 80, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([191.5, pulse, [191.5, 74, 75, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([192, pulse, [192, 59, 60, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([187.5, pulse, [187.5, 100, 101, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([188, pulse, [188, 96, 97, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([188.5, pulse, [188.5, 100, 101, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([189.5, pulse, [189.5, 100, 101, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([190.5, pulse, [190.5, 100, 101, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([191, pulse, [191, 96, 97, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([191.5, pulse, [191.5, 90, 91, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    futureEffectList.push([192, pulse, [192, 75, 76, 0, 0.5, 0, off, [255, 255, 255, 255], off]]);
    
    //Random lines on beat 187.5
    futureEffectList.push([187.5, move, [187.5, 30, 70, 0.5, 0.875, 0, [0,0,255,0], [0, 0, 255, 255], off, "quadout"]]);
    futureEffectList.push([187.5+1.375, move, [187.5+1.375, 70, 50, 0, 1.375, 0, off, [0, 0, 255, 255], off, "quadinout"]]);
    futureEffectList.push([187.5+1.375*2, move, [187.5+1.375*2, 50, 90, 0, 1.375, 0, off, [0, 0, 255, 255], off, "quadinout"]]);
    futureEffectList.push([187.5+1.375*3, move, [187.5+1.375*3, 90, 0, 0, 1.375, 0, off, [0, 0, 255, 255], off, "quadin"]]);
    futureEffectList.push([187.5, move, [187.5, 31, 71, 0.5, 0.875, 0, [0,0,255,0], [0, 0, 255, 255], off, "quadout"]]);
    futureEffectList.push([187.5+1.375, move, [187.5+1.375, 71, 51, 0, 1.375, 0, off, [0, 0, 255, 255], off, "quadinout"]]);
    futureEffectList.push([187.5+1.375*2, move, [187.5+1.375*2, 51, 91, 0, 1.375, 0, off, [0, 0, 255, 255], off, "quadinout"]]);
    futureEffectList.push([187.5+1.375*3, move, [187.5+1.375*3, 91, 1, 0, 1.375, 0, off, [0, 0, 255, 255], off, "quadin"]]);
    
    futureEffectList.push([187.5, move, [187.5, 90, 50, 0.5, 1.333, 0, [252, 104, 238, 0], [252, 104, 238, 255], off, "quadout"]]);
    futureEffectList.push([187.5+1.833, move, [187.5+1.833, 50, 70, 0, 1.833, 0, off, [252, 104, 238, 255], off, "quadinout"]]);
    futureEffectList.push([187.5+1.833*2, move, [187.5+1.833*2, 70, 0, 0, 1.833, 0, off, [252, 104, 238, 255], off, "quadin"]]);
    futureEffectList.push([187.5, move, [187.5, 91, 51, 0.5, 1.333, 0, [252, 104, 238, 0], [252, 104, 238, 255], off, "quadout"]]);
    futureEffectList.push([187.5+1.833, move, [187.5+1.833, 51, 71, 0, 1.833, 0, off, [252, 104, 238, 255], off, "quadinout"]]);
    futureEffectList.push([187.5+1.833*2, move, [187.5+1.833*2, 71, 1, 0, 1.833, 0, off, [252, 104, 238, 255], off, "quadin"]]);
    
    //Slice effect on beat 161.5
    futureEffectList.push([161, move, [161.25, 0, 240, 0, 2, 0, [0,0,0,255], [0,0,0,255], [0,0,0,255], "none", true]]);
    futureEffectList.push([161.5, wave, [161.5, 30, 90, 0.5, 40, 0, [255, 255, 255], 255, 255]]);
    futureEffectList.push([161, wave, [161.25, 0, 120, 1, 80, 0, [255, 255, 255], 25, 50]]);

    //Waves on the ends from beats 162 - 192.5
    for (let i = 0; i < 30; i++)
    {
        futureEffectList.push([162 + i, wave, [162 + i, 15, 0, 0.75, 15, 0, [255, 255, 255], 255, 255]]);
        futureEffectList.push([162 + i, wave, [162 + i, 105, 120, 0.75, 15, 0, [255, 255, 255], 255, 255]]);
    }
    
    //BG Effects from beats 177 - 193
    for (let i = 0; i < 16; i++)
    {
        futureEffectList.unshift([177 + i/2, bgpulse, [177 + i/2, 0, 0, 0.25, off, [50 + 3 * (i + 1), 50 + 5 * (i + 1), 50 + 5 * (i + 1), 255], off]]);
    }
    
    for (let i = 0; i < 16; i++)
    {
        futureEffectList.unshift([185 + i/4, bgpulse, [185 + i/4, 0, 0, 0.125, off, [125 + 5 * (i + 1), 125 + 5 * (i + 1), 125 + 5 * (i + 1), 255], off]]);
    }
    
    for (let i = 0; i < 24; i++)
    {
        futureEffectList.unshift([189 + i/6, bgpulse, [189 + i/6, 0, 0, 0.125, off, [175 + 3 * (i + 1), 175 + 3 * (i + 1), 175 + 3 * (i + 1), 255], off]]);
    }
    
    //DROP 1 (1/4, Beat 192.5)
    
    //Background flashes    
    //Snare
    for (let i = 0; i < 30; i++)
    {
        futureEffectList.unshift([195 + 4 * i, bgpulse, [195 + 4 * i, 0, 0, 0.5, off, [255,255,255,175], off]]);
    }
    //Kicks
    kickCol = [255,255,255,100]
    for (let i = 0; i < 4; i++)
    {
        futureEffectList.unshift([194.5 + 32 * i, bgpulse, [194.5 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
        futureEffectList.unshift([197.5 + 32 * i, bgpulse, [197.5 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
        futureEffectList.unshift([198.5 + 32 * i, bgpulse, [198.5 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
        futureEffectList.unshift([202 + 32 * i, bgpulse, [202 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
        futureEffectList.unshift([206.5 + 32 * i, bgpulse, [206.5 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
        futureEffectList.unshift([207.5 + 32 * i, bgpulse, [207.5 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
        futureEffectList.unshift([208 + 32 * i, bgpulse, [208 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
        futureEffectList.unshift([208.5 + 32 * i, bgpulse, [208.5 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
        futureEffectList.unshift([210 + 32 * i, bgpulse, [210 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
        futureEffectList.unshift([210.5 + 32 * i, bgpulse, [210.5 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
        futureEffectList.unshift([212.5 + 32 * i, bgpulse, [212.5 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
        futureEffectList.unshift([214 + 32 * i, bgpulse, [214 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
        futureEffectList.unshift([214.5 + 32 * i, bgpulse, [214.5 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
        if (i < 3)
        {
            futureEffectList.unshift([218.5 + 32 * i, bgpulse, [218.5 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
            futureEffectList.unshift([220.5 + 32 * i, bgpulse, [220.5 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
            futureEffectList.unshift([222.5 + 32 * i, bgpulse, [222.5 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
            futureEffectList.unshift([223.5 + 32 * i, bgpulse, [223.5 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
            futureEffectList.unshift([224 + 32 * i, bgpulse, [224 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
            futureEffectList.unshift([224.5 + 32 * i, bgpulse, [224.5 + 32 * i, 0, 0, 0.25, off, kickCol, off]]);
        }
    }

    //Effects
    futureEffectList.push([192.5, rainbowWave, [192.5, 0, 120, 2.5, 0.5, 3000, 4, 255]]);
    futureEffectList.push([195, wave, [195, 60, 0, 0.75, 30, 2, [255,255,255], 255, 50]]);
    futureEffectList.push([195, wave, [195, 60, 120, 0.75, 30, 2, [255,255,255], 255, 50]]);
    futureEffectList.push([195, radiate, [195, 60, 20, 1, [255,255,255,255], [255,255,255,0], "quadout"]])
    
    futureEffectList.push([195.5, move, [195.5, 0, 36, 0, 0.25, 0, off, [0,85,170,255], off, "none", false]]);
    futureEffectList.push([195.75, pulse, [195.75, 35, 37, 0, 0.75, 0, 0, [0,85,170,255], off]]);
    futureEffectList.push([196, move, [196, 120, 84, 0, 0.25, 0, off, [255,170,0,255], off, "none", false]]);   
    futureEffectList.push([196.25, pulse, [196.25, 83, 85, 0, 1.25, 0, 0, [255,170,0,255], off]]);
    
    futureEffectList.push([196.5, wave, [196.5, 35, 96, 0.75, 20, 0, [0,0,255], 255, 255]]);
    futureEffectList.push([196.5, wave, [196.5, 35, 72, 0.75, 20, 0, [0,255,0], 255, 255]]);
    futureEffectList.push([197, pulse, [197, 94, 98, 0, 3, 0, 0, [0,0,255], off]]);
	futureEffectList.push([197, pulse, [197, 70, 74, 0, 2.5, 0, 0, [0,255,0], off]]);
    futureEffectList.push([197.5, wave, [197.5, 85, 24, 0.75, 20, 0, [255,0,0], 255, 255]]);
    futureEffectList.push([197.5, wave, [197.5, 85, 48, 0.75, 20, 0, [255,255,0], 255, 255]]);
    futureEffectList.push([198, pulse, [198, 22, 26, 0, 0.5, 0, 0, [255,0,0], off]]);
	futureEffectList.push([198, pulse, [198, 46, 50, 0, 1, 0, 0, [255,255,0], off]]);
    
    futureEffectList.push([198.5, move, [198.5, 24, 12, 0, 1, 0, off, [255,0,0,255], off, "cubeout", false]]);
    futureEffectList.push([199.5, move, [199.5, 12, 120, 0, 1, 0, off, [255,0,0,255], off, "cubein", false]]);
    futureEffectList.push([198.5, move, [198.5, 24, 40, 0, 1, 0, off, [255,0,0,255], off, "cubeout", false]]);
    futureEffectList.push([199.5, move, [199.5, 40, 0, 0, 1, 0, off, [255,0,0,255], off, "cubein", false]]);
    futureEffectList.push([198.5, radiate, [198.5, 24, 5, 1, [255,0,0,255], [255,0,0,0], "quadout"]])

    futureEffectList.push([199, move, [199, 48, 30, 0, 0.75, 0, off, [255,255,0,255], off, "cubeout", false]]);
    futureEffectList.push([199.75, move, [199.75, 30, 120, 0, 0.75, 0, off, [255,255,0,255], off, "cubein", false]]);
    futureEffectList.push([199, move, [199, 48, 66, 0, 0.75, 0, off, [255,255,0,255], off, "cubeout", false]]);
    futureEffectList.push([199.75, move, [199.75, 66, 0, 0, 0.75, 0, off, [255,255,0,255], off, "cubein", false]]);
    futureEffectList.push([199, radiate, [199, 48, 5, 1, [255,255,0,255], [255,255,0,0], "quadout"]])

    futureEffectList.push([199.5, move, [199.5, 72, 60, 0, 0.5, 0, off, [0,255,0,255], off, "cubeout", false]]);
    futureEffectList.push([200, move, [200, 60, 120, 0, 0.5, 0, off, [0,255,0,255], off, "cubein", false]]);
    futureEffectList.push([199.5, move, [199.5, 72, 84, 0, 0.5, 0, off, [0,255,0,255], off, "cubeout", false]]);
    futureEffectList.push([200, move, [200, 84, 0, 0, 0.5, 0, off, [0,255,0,255], off, "cubein", false]]);
    futureEffectList.push([199.5, radiate, [199.5, 72, 5, 1, [0,255,0,255], [0,255,0,0], "quadout"]])

    futureEffectList.push([200, move, [200, 96, 120, 0, 0.5, 0, off, [0,0,255,255], off, "cubein", false]]);
    futureEffectList.push([200, move, [200, 96, 0, 0, 0.5, 0, off, [0,0,255,255], off, "cubein", false]]);
    futureEffectList.push([200, radiate, [200, 96, 5, 1, [0,0,255,255], [0,0,255,0], "quadout"]])

    futureEffectList.push([200.5, rainbowWave, [200.5, 0, 60, 1.5, 0.25, 3000, 4, 255]]);
    futureEffectList.push([200.5, rainbowWave, [200.5, 120, 60, 1.5, 0.25, 3000, 4, 255]]);
    
    futureEffectList.push([201.5, move, [201.5, 0, 44, 0, 0.75, 0, off, [255,255,255,255], off, "cubeout", false]]);
    futureEffectList.push([201.6, move, [201.6, 0, 42, 0, 0.65, 0, off, [255,255,255,255], off, "cubeout", false]]);
    futureEffectList.push([201.7, move, [201.7, 0, 40, 0, 0.55, 0, off, [255,255,255,255], off, "cubeout", false]]);
    futureEffectList.push([201.5, move, [201.5, 120, 76, 0, 0.75, 0, off, [255,255,255,255], off, "cubeout", false]]);
    futureEffectList.push([201.5, move, [201.6, 120, 78, 0, 0.65, 0, off, [255,255,255,255], off, "cubeout", false]]);
    futureEffectList.push([201.5, move, [201.7, 120, 80, 0, 0.55, 0, off, [255,255,255,255], off, "cubeout", false]]);
    futureEffectList.push([202, rainbowWave, [202, 60, 0, 1, 0, 3000, 4, 255]]);
    futureEffectList.push([202, rainbowWave, [202, 60, 120, 1, 0, 3000, 4, 255]]);
    futureEffectList.push([202.25, move, [202.25, 44, 0, 0, 0.75, 0, off, [255,255,255,255], off, "cubein", false]]);
    futureEffectList.push([202.25, move, [202.25, 42, 0, 0, 0.75, 0, off, [255,255,255,255], off, "cubein", false]]);
    futureEffectList.push([202.25, move, [202.25, 40, 0, 0, 0.75, 0, off, [255,255,255,255], off, "cubein", false]]);
    futureEffectList.push([202.25, move, [202.25, 76, 120, 0, 0.75, 0, off, [255,255,255,255], off, "cubein", false]]);
    futureEffectList.push([202.25, move, [202.25, 78, 120, 0, 0.75, 0, off, [255,255,255,255], off, "cubein", false]]);
    futureEffectList.push([202.25, move, [202.25, 80, 120, 0, 0.75, 0, off, [255,255,255,255], off, "cubein", false]]);
    
    futureEffectList.push([203, radiate, [203, 0, 15, 1, [255,255,255,255], [255,255,255,0], "quadout"]]);
    futureEffectList.push([203, radiate, [203, 0, 25, 1, [255,255,255,200], [255,255,255,0], "quadout"]]);
    futureEffectList.push([203, radiate, [203, 0, 35, 1, [255,255,255,150], [255,255,255,0], "quadout"]]);
    futureEffectList.push([203, wave, [203, 0, 50, 1, 10, 0, [255,255,255], 100, 0]]);
    futureEffectList.push([203, radiate, [203, 120, 15, 1, [255,255,255,255], [255,255,255,0], "quadout"]]);
    futureEffectList.push([203, radiate, [203, 120, 25, 1, [255,255,255,200], [255,255,255,0], "quadout"]]);
    futureEffectList.push([203, radiate, [203, 120, 35, 1, [255,255,255,150], [255,255,255,0], "quadout"]]);
    futureEffectList.push([203, wave, [203, 120, 70, 1, 10, 0, [255,255,255], 100, 0]]);
    
    //Left Side
    for (let i = 0; i < 4; i++)
    {
        futureEffectList.push([203, move, [203, 0 - i, 30 - i, 0, 0.5, 0, off, [0,0,255,50], off, "linear", false]]);
        futureEffectList.push([203.5, move, [203.5, 30 - i, 50 - i, 0, 1, 0, off, [0,0,255,255], off, "quadout", false]]);
        futureEffectList.push([204.5, move, [204.5, 50 - i, 30 - i, 0, 1, 0, off, [0,0,255,255], off, "quadin", false]]);
        futureEffectList.push([205.5, move, [205.5, 30 - i, 20 - i, 0, 0.75, 0, off, [0,0,255,255], off, "quadout", false]]);
        futureEffectList.push([206.25, move, [206.25, 20 - i, 60 - i, 0, 2.25, 0, off, [0,0,255,255], off, "quadin", false]]);
    }
    
    //Right Side
    for (let i = 0; i < 4; i++)
    {
        futureEffectList.push([203, move, [203, 120 + i, 90 + i, 0, 1, 0, off, [255,127,0,100], off, "linear", false]]);
        futureEffectList.push([204, move, [204, 90 + i, 70 + i, 0, 0.75, 0, off, [255,127,0,255], off, "quadout", false]]);
        futureEffectList.push([204.75, move, [204.75, 70 + i, 90 + i, 0, 0.75, 0, off, [255,127,0,255], off, "quadin", false]]);
        futureEffectList.push([205.5, move, [205.5, 90 + i, 100 + i, 0, 0.75, 0, off, [255,127,0,255], off, "quadout", false]]);
        futureEffectList.push([206.25, move, [206.25, 100 + i, 60 + i, 0, 2.25, 0, off, [255,127,0,255], off, "quadin", false]]);
    }
    
    //Teleporting light(s)
    for (let i = 0; i < 4; i++)
    {
        futureEffectList.push([203.25, move, [203.25, 0 - i, 50 - i, 0, 1.25, 0, off, [255,255,255,255], off, "quadin", false]]);
        futureEffectList.push([204.5, move, [204.5, 80 + i, 100 + i, 0, 0.5, 0, off, [255,255,255,255], off, "quadout", false]]);
        futureEffectList.push([205, move, [205, 100 + i, 90 + i, 0, 0.5, 0, off, [255,255,255,255], off, "quadin", false]]);
        futureEffectList.push([205.5, move, [205.5, 30 - i, 10 - i, 0, 0.5, 0, off, [255,255,255,255], off, "quadout", false]]);
        futureEffectList.push([206, move, [206, 10 - i, 20 - i, 0, 0.5, 0, off, [255,255,255,255], off, "quadin", false]]);
        //Left
        futureEffectList.push([206.5, move, [206.5, 20 - i, 5 - i, 0, 0.75, 0, off, [255,255,255,255], off, "quadout", false]]);
        futureEffectList.push([207.25, move, [207.25, 5 - i, 60 - i, 0, 1.25, 0, off, [255,255,255,255], off, "quadin", false]]);
        //Right
        futureEffectList.push([206.5, move, [206.5, 100 + i, 115 + i, 0, 0.75, 0, off, [255,255,255,255], off, "quadout", false]]);
        futureEffectList.push([207.25, move, [207.25, 115 + i, 60 + i, 0, 1.25, 0, off, [255,255,255,255], off, "quadin", false]]);
    }
    
    //Effects
    futureEffectList.push([204.5, wave, [204.5, 50, 80, 1, 10, 0, [0,0,255], 255, 0]]);
    futureEffectList.push([205.5, wave, [205.5, 90, 60, 1, 10, 0, [255,127,0], 255, 0]]);
	futureEffectList.push([206.5, wave, [206.5, 20, 50, 1, 10, 0, [0,0,255], 255, 0]]);
    futureEffectList.push([206.5, wave, [206.5, 100, 70, 1, 10, 0, [255,127,0], 255, 0]]);
    
    futureEffectList.push([208.5, gradientWave, [208.5, 60, 0, 1.5, 0.333, 1300, 0.75, [0,0,255], [0,100,255]]]);
    futureEffectList.push([208.5, gradientWave, [208.5, 60, 120, 1.5, 0.333, 1300, 0.75, [255,127,0], [255,200,0]]]);
	
    for (let i = 0; i < 4; i++)
    {
        futureEffectList.push([210, move, [210, 20 - i, 60 - i, 0.25, 0.75, 0, off, [255,255,255,255], off, "quadin", false]]);
        futureEffectList.push([210.5, move, [210.5, 100 + i, 60 + i, 0.25, 0.25, 0, off, [255,255,255,255], off, "cubein", false]]);
        futureEffectList.push([211, move, [211, 60 - i, 30 - i, 0, 0, 1.5, off, [255,255,255,255], off, "quadout", false]]);
        futureEffectList.push([211, move, [211, 60 + i, 90 + i, 0, 0, 1.5, off, [255,255,255,255], off, "quadout", false]]);
        futureEffectList.push([211.5, move, [211.5, 20 - i, 90 - i, 0.25, 1.25, 0, off, [255,255,255,255], off, "quadin", false]]);
        futureEffectList.push([212, move, [212, 15 - i, 80 - i, 0.25, 0.75, 0, off, [255,255,255,255], off, "quadin", false]]);
        futureEffectList.push([212.5, move, [212.5, 10 - i, 70 - i, 0.25, 0.25, 0, off, [255,255,255,255], off, "quadin", false]]);
        futureEffectList.push([214, move, [214, 90 - i, 0 - i, 0, 1, 0, off, [0,0,0,255], off, "quadin", false]]);
        futureEffectList.push([214, move, [214, 80 - i, 0 - i, 0, 1, 0, off, [0,0,0,255], off, "quadin", false]]);
        futureEffectList.push([214, move, [214, 70 - i, 0 - i, 0, 1, 0, off, [0,0,0,255], off, "quadin", false]]);
        futureEffectList.push([215, move, [215, 0 - i, 20 - i, 0, 0, 1, off, [0,0,0,255], off, "quadout", false]]);
        futureEffectList.push([215, move, [215, 0 - i, 35 - i, 0, 0, 1, off, [0,0,0,255], off, "quadout", false]]);
        futureEffectList.push([215, move, [215, 0 - i, 50 - i, 0, 0, 1, off, [0,0,0,255], off, "quadout", false]]);
    }
    
    futureEffectList.push([211, radiate, [211, 60, 40, 1, [255,255,255,255], [255,255,255,100], "quadout"]]);
    futureEffectList.push([211, radiate, [211, 60, 50, 1, [255,255,255,255], [255,255,255,100], "quadout"]]);

    futureEffectList.push([213, pulse, [213, 86, 90, 0, 1, 0, off, [255,255,255,255], off]]);
    futureEffectList.push([213, pulse, [213, 76, 80, 0, 1, 0, off, [255,255,255,255], off]]);
    futureEffectList.push([213, pulse, [213, 66, 70, 0, 1, 0, off, [255,255,255,255], off]]);
    futureEffectList.push([213, invertColors, [213, 0, 120, 0.25]]);
    futureEffectList.push([213.5, invertColors, [213.5, 0, 120, 3]]);
    futureEffectList.push([215, wave, [215, 0, 120, 1.5, 20, 0, [0,0,0], 255, 0]]);
    futureEffectList.push([215.5, invertColors, [215.5, 80, 120, 1]]);
    futureEffectList.push([216, invertColors, [216, 0, 40, 0.5]]);
    
    futureEffectList.push([216.5, pulse, [216.5, 41, 60, 0, 1, 0, off, [255,255,255,255], off]]);
    futureEffectList.push([216.5, wave, [216.5, 60, 95, 1, 20, 0, [0,200,255], 255, 255]]);
    futureEffectList.push([217, pulse, [217, 85, 95, 0, 1.5, 0, off, [0,200,255,255], off]]);
    futureEffectList.push([217.5, wave, [217.5, 60, 25, 1, 20, 0, [255,77,216], 255, 255]]);
    futureEffectList.push([218, pulse, [218, 25, 35, 0, 1.5, 0, off, [255,77,216,255], off]]);
    
    futureEffectList.push([218.5, pulse, [218.5, 90, 95, 0, 0.5, 0, off, [255,77,216,255], off]]);
    futureEffectList.push([218.5, pulse, [218.5, 25, 35, 0, 0.5, 0, off, [0,200,255,255], off]]);
	futureEffectList.push([219, pulse, [219, 25, 35, 0, 0.5, 0, off, [255,77,216,255], off]]);
    futureEffectList.push([219.5, pulse, [219.5, 25, 30, 0, 0.5, 0, off, [0,200,255,255], off]]);
    for (let i = 0; i < 5; i++)
    {
        futureEffectList.push([218.5, move, [218.5, 90 + i, 25 + i, 0, 2, 0, off, [255,77,216,255], off, "quadout", false]]);
        futureEffectList.push([219, move, [219, 85 + i, 50 + i, 0, 1.5, 0, off, [0,200,255,255], off, "quadout", false]]);
        futureEffectList.push([219.5, move, [219.5, 35 - i, 75 - i, 0, 1, 0, off, [255,77,216,255], off, "quadout", false]]);
        futureEffectList.push([220, move, [220, 30 - i, 100 - i, 0, 0.5, 0, off, [0,200,255,255], off, "quadout", false]]);
    }
    futureEffectList.push([220.5, gradientWave, [220.5, 0, 120, 1.5, 0.5, 1300, 0.75, [200,200,200,255], [255,255,255,255]]]);
    
    futureEffectList.push([220.5, pulse, [220.5, 25, 30, 0, 1.5, 0, off, [255,77,216,255], off]]);
    futureEffectList.push([220.5, pulse, [220.5, 50, 55, 0, 1.5, 0, off, [0,200,255,255], off]]);
    futureEffectList.push([220.5, pulse, [220.5, 70, 75, 0, 1.5, 0, off, [255,77,216,255], off]]);
    futureEffectList.push([220.5, pulse, [220.5, 95, 100, 0, 1.5, 0, off, [0,200,255,255], off]]);
    
    futureEffectList.push([220.675, gradientWave, [220.675, 25, 50, 1.375, 0.125, 1300, 0.75, [255,77,216,255], [255,100,216,255]]]);
    futureEffectList.push([220.75, gradientWave, [220.75, 50, 75, 1.25, 0.125, 1300, 0.75, [0,200,255,255], [0,100,255,255]]]);
    futureEffectList.push([220.875, gradientWave, [220.875, 75, 100, 1.125, 0.125, 1300, 0.75, [255,77,216,255], [255,100,216,255]]]);
    futureEffectList.push([221, gradientWave, [221, 100, 120, 1, 0.125, 1300, 0.75, [0,200,255,255], [0,100,255,255]]]);
    
    futureEffectList.push([222, gradientWave, [222, 120, 0, 0.5, 0.5, 1300, 0.75, [200,200,200,255], [255,255,255,255]]]);
    
    futureEffectList.push([222, pulse, [222, 25, 30, 0, 1.5, 0, off, [0,255,0,255], off]]);
    futureEffectList.push([222, pulse, [222, 50, 55, 0, 1.75, 0, off, [0,0,255,255], off]]);
    futureEffectList.push([222, pulse, [222, 70, 75, 0, 1, 0, off, [0,255,0,255], off]]);
    futureEffectList.push([222, pulse, [222, 95, 100, 0, 1.75, 0, off, [0,0,255,255], off]]);
    
    futureEffectList.push([222, gradientWave, [222, 25, 0, 0.5, 0, 1300, 0.75, [0,255,0,255], [0,150,0,255]]]);
    futureEffectList.push([222, gradientWave, [222, 50, 25, 0.5, 0, 1300, 0.75, [0,0,255,255], [0,200,255,255]]]);
    futureEffectList.push([222, gradientWave, [222, 75, 50, 0.5, 0, 1300, 0.75, [0,255,0,255], [0,150,0,255]]]);
    futureEffectList.push([222, gradientWave, [222, 100, 75, 0.5, 0, 1300, 0.75, [0,0,255,255], [0,200,255,255]]]);
     
	for (let i = 0; i < 5; i++)
    {
        futureEffectList.push([223, move, [223, 70 + i, 90 + i, 0, 0.75, 0, off, [0,255,0,255], off, "cubeout", false]]);
        futureEffectList.push([223.5, move, [223.5, 25 + i, 40 + i, 0, 0.25, 0, off, [0,255,0,255], off, "cubeout", false]]);
        futureEffectList.push([223.75, move, [223.75, 90 + i, 0 + i, 0, 0.75, 0, off, [0,255,0,255], off, "quadin", false]]);
        futureEffectList.push([223.75, move, [223.75, 40 + i, 0 + i, 0, 0.75, 0, off, [0,255,0,255], off, "quadin", false]]);
        futureEffectList.push([223.5, move, [223.5, 50 + i, 120 + i, 0, 1, 0, off, [0,0,255,255], off, "cubein", false]]);
        futureEffectList.push([223.5, move, [223.5, 95 + i, 120 + i, 0, 1, 0, off, [0,0,255,255], off, "cubein", false]]);
    }
    
    futureEffectList.push([224.5, gradientWave, [224.5, 0, 60, 2.5, 0.5, 1300, 0.75, [0,255,0,255], [0,150,0,255]]]);
    futureEffectList.push([224.5, gradientWave, [224.5, 120, 60, 2.5, 0.5, 1300, 0.75, [0,0,255,255], [0,200,255,255]]]);

	//DROP 1 (2/4, Beat 224.5)
    for (let i = 0; i < 4; i++)
    {
        futureEffectList.push([225, move, [225, 0 - i, 60 - i, 0, 1.25, 0, off, [255,0,0,255], off, "cubeout", false]]);
        futureEffectList.push([225, move, [225, 120 + i, 60 + i, 0, 1.25, 0, off, [255,0,0,255], off, "cubeout", false]]);
    }
    futureEffectList.push([226, move, [226, 60, 0, 0, 1, 0, off, [255,0,0,255], off, "cubein", true]]);
    futureEffectList.push([226, move, [226, 60, 120, 0, 1, 0, off, [255,0,0,255], off, "cubein", true]]);
    futureEffectList.push([227, wave, [227, 120, 60, 1, 20, 0, [255,0,0], 200, 0]]);
    futureEffectList.push([227, wave, [227, 0, 60, 1, 20, 0, [255,0,0], 200, 0]]);   
    futureEffectList.push([227, move, [227, 0, 12, 0, 0, 0.5, off, [255,127,0,255], [255,127,0,255], "quadout", false]]);
    futureEffectList.push([227, move, [227, 0, 24, 0, 0, 0.5, off, [255,255,0,255], [255,255,0,255], "quadout", false]]);
    futureEffectList.push([227, move, [227, 120, 105, 0, 0, 1, off, [255,127,0,255], [255,127,0,255], "quadout", false]]);
    futureEffectList.push([227, move, [227, 120, 85, 0, 0, 1, off, [255,255,0,255], [255,255,0,255], "quadout", false]]);
    futureEffectList.push([227.5, pulse, [227.5, 12, 13, 0, 1, 0, 0, [255,0,255], off]]);
    futureEffectList.push([227.5, pulse, [227.5, 24, 25, 0, 1, 0, 0, [255,0,255], off]]);
	futureEffectList.push([228, pulse, [228, 104, 105, 0, 1.5, 0, 0, [255,255,0], off]]);
    futureEffectList.push([228, pulse, [228, 85, 86, 0, 1.5, 0, 0, [255,255,0], off]]);
    
    futureEffectList.push([228.5, wave, [228.5, 12, 75, 0.75, 20, 0, [255,0,255], 255, 255]]);
    futureEffectList.push([228.5, wave, [228.5, 24, 100, 0.75, 20, 0, [255,0,255], 255, 255]]);
    futureEffectList.push([229, pulse, [229, 71, 75, 0, 2, 0, 0, [255,0,255], off]]);
	futureEffectList.push([229, pulse, [229, 96, 100, 0, 1.5, 0, 0, [255,0,255], off]]);
    
    futureEffectList.push([229.5, wave, [229.5, 105, 50, 0.75, 20, 0, [255,255,0], 255, 255]]);
    futureEffectList.push([229.5, wave, [229.5, 85, 25, 0.75, 20, 0, [255,255,0], 255, 255]]);
    futureEffectList.push([230, pulse, [230, 25, 29, 0, 2, 0, 0, [255,255,0], off]]);
	futureEffectList.push([230, pulse, [230, 50, 54, 0, 1.5, 0, 0, [255,255,0], off]]);
    
    for (let i = 0; i < 2; i++)
    {
        futureEffectList.push([230.5, radiate, [230.5, 98, 4 + 7 * i, 1, [255,0,255,255], [255,0,255,0], "quadout"]])
        futureEffectList.push([231, radiate, [231, 73, 8 + 10 * i, 0.75, [255,0,255,255], [255,0,255,255 * i], "quadout"]])
        futureEffectList.push([231.5, radiate, [231.5, 52, 4 + 7 * i, 1, [255,255,0,255], [255,255,0,0], "quadout"]])
        futureEffectList.push([232, radiate, [232, 27, 4 + 7 * i, 1, [255,255,0,255], [255,255,0,0], "quadout"]])
    }
    futureEffectList.push([231.75, move, [231.75, 91, 73, 0, 0, 0.75, off, [255,100,255,255], [255,100,255,255], "quadin", false]]);
    futureEffectList.push([231.75, move, [231.75, 55, 73, 0, 0, 0.75, off, [255,100,255,255], [255,100,255,255], "quadin", false]]);
    futureEffectList.push([231, vibrate, [231, 71, 75, 0, 0, 1.5, off, [255,0,255,255], [255,150,255,255], 1, 20]]);
    futureEffectList.push([232.5, rainbowWave, [232.5, 73, 0, 1.5, 0.5, 3000, 4, 255]]);
    futureEffectList.push([232.5, rainbowWave, [232.5, 73, 73*2, 1.5, 0.5, 3000, 4, 255]]);
    futureEffectList.push([234, rainbowWave, [234, 0, 73, 1, 0, 3000, 4, 255]]);
    futureEffectList.push([234, rainbowWave, [234, 73*2, 73, 1, 0, 3000, 4, 255]]);
    for (let i = 0; i < 4; i++)
    {
        futureEffectList.push([233, move, [233, 73 - i, 30 - i, 0, 1, 0, off, white, off, "quadin", false]]);
        futureEffectList.push([233.25, move, [233.25, 73 - i, 40 - i, 0, 0.75, 0, off, white, off, "quadin", false]]);
        futureEffectList.push([233.5, move, [233.5, 74 - i, 50 - i, 0, 0.5, 0, off, white, off, "quadin", false]]);
        futureEffectList.push([234, move, [234, 30 - i, 25 - i, 0, 0.25, 0, off, white, off, "quadout", false]]);
        futureEffectList.push([234, move, [234, 40 - i, 35 - i, 0, 0.25, 0, off, white, off, "quadout", false]]);
        futureEffectList.push([234, move, [234, 50 - i, 45 - i, 0, 0.25, 0, off, white, off, "quadout", false]]);
        futureEffectList.push([234.25, move, [234.25, 45 - i, 73 - i, 0, 0.75, 0, off, white, off, "quadin", false]]);
        futureEffectList.push([234.25, move, [234.25, 35 - i, 73 - i, 0, 0.75, 0, off, white, off, "quadin", false]]);
        futureEffectList.push([234.25, move, [234.25, 25 - i, 73 - i, 0, 0.75, 0, off, white, off, "quadin", false]]);
    }
    
    futureEffectList.push([235, wave, [235, 73, 120, 0.5, 20, 0, [255,255,255], 150, 50]]);
    futureEffectList.push([235, move, [235, 73 - i, 50 - i, 0, 0, 1, off, white, off, "quadout", false]]);
    futureEffectList.push([235, move, [235, 73 - i, 40 - i, 0, 0, 1, off, white, off, "quadout", false]]);
    futureEffectList.push([235, move, [235, 73 - i, 30 - i, 0, 0, 1, off, white, off, "cubeout", false]]);
    
    for (let i = 0; i < 3; i++)
    {
        futureEffectList.push([235.5, move, [235.5, -1 - i, 40 - i, 0, 1, 0, off, [255,0,255,255], off, "quadout", false]]);
        futureEffectList.push([235.5, move, [235.5, 0 + i, 41 + i, 0, 1, 0, off, [255,255,0,255], off, "quadout", false]]);
        futureEffectList.push([235.75, move, [235.75, 121 + i, 91 + i, 0, 0.75, 0, off, [255,0,255,255], off, "quadout", false]]);
        futureEffectList.push([235.75, move, [235.75, 120 - i, 90 - i, 0, 0.75, 0, off, [255,255,0,255], off, "quadout", false]]);
        
        futureEffectList.push([236.5, move, [236.5, 40 - i, 80 - i, 0, 1, 0, off, [255,0,255,255], off, "quadinout", false]]);
        futureEffectList.push([236.5, move, [236.5, 41 + i, 81 + i, 0, 1, 0, off, [255,255,0,255], off, "quadinout", false]]);
        futureEffectList.push([236.5, move, [236.5, 90 - i, 30 - i, 0.25, 0.75, 0, [255,255,0,255], [255,0,255,255], off, "quadinout", false]]);
        futureEffectList.push([236.5, move, [236.5, 91 + i, 31 + i, 0.25, 0.75, 0, [255,0,255,255], [255,255,0,255], off, "quadinout", false]]);
        
        futureEffectList.push([237.5, move, [237.5, 80 - i, 80 - i, 0.25, 0.75, 0, [255,0,255,255], [255,255,0,255], off, "quadinout", false]]);
        futureEffectList.push([237.5, move, [237.5, 81 + i, 81 + i, 0.25, 0.75, 0, [255,255,0,255], [255,0,255,255], off, "quadinout", false]]);
        futureEffectList.push([237.5, move, [237.5, 30 - i, 40 - i, 0, 1, 0, off, [255,0,255,255], off, "quadinout", false]]);
        futureEffectList.push([237.5, move, [237.5, 31 + i, 41 + i, 0, 1, 0, off, [255,255,0,255], off, "quadinout", false]]);
        
        futureEffectList.push([238.5, move, [238.5, 80 - i, 100 - i, 0, 2, 0, off, [255,255,0,255], off, "quadinout", false]]);
        futureEffectList.push([238.5, move, [238.5, 81 + i, 101 + i, 0, 2, 0, off, [255,0,255,255], off, "quadinout", false]]);
        futureEffectList.push([238.5, move, [238.5, 40 - i, 20 - i, 0, 2, 0, off, [255,0,255,255], off, "quadinout", false]]);
        futureEffectList.push([238.5, move, [238.5, 41 + i, 21 + i, 0, 2, 0, off, [255,255,0,255], off, "quadinout", false]]);
    }
    
    //Teleporting light v2
    for (let i = 0; i < 4; i++)
    {
        futureEffectList.push([235.5, move, [235.5, 0 - i, 40 - i, 0, 1, 0, off, [255,255,255,255], off, "quadin", false]]);
        futureEffectList.push([236.5, move, [236.5, 90 + i, 110 + i, 0, 0.5, 0, off, [255,255,255,255], off, "quadout", false]]);
        futureEffectList.push([237, move, [237, 110 + i, 80 + i, 0, 0.5, 0, off, [255,255,255,255], off, "quadin", false]]);
        futureEffectList.push([237.5, move, [237.5, 31 + i, 51 + i, 0, 0.5, 0, off, [255,255,255,255], off, "quadout", false]]);
        futureEffectList.push([238, move, [238, 51 + i, 41 + i, 0, 0.5, 0, off, [255,255,255,255], off, "quadin", false]]);
        
        //"Fast" Teleports
        futureEffectList.push([238.5, move, [238.5, 80 + i, 36 + i, 0, 0.5, 0, off, [255,255,255,255], off, "linear", false]]);
        futureEffectList.push([239, move, [239, 85 + i, 31 + i, 0, 0.5, 0, off, [255,255,255,255], off, "linear", false]]);
        futureEffectList.push([239.5, move, [239.5, 90 + i, 26 + i, 0, 0.5, 0, off, [255,255,255,255], off, "linear", false]]);
        futureEffectList.push([240, move, [240, 95 + i, 21 + i, 0, 0.5, 0, off, [255,255,255,255], off, "linear", false]]);
    }
    
    //Effects
    futureEffectList.push([236.5, wave, [236.5, 44, 70, 0.75, 10, 0, [255,0,255], 255, 0]]);
    futureEffectList.push([237.5, wave, [237.5, 80, 50, 1, 10, 0, [255,255,0], 255, 0]]);
    futureEffectList.push([238.5, wave, [238.5, 40, 11, 0.75, 10, 0, [255,0,255], 255, 0]]);
    futureEffectList.push([239, wave, [239, 36, 6, 0.75, 10, 0, [255,255,0], 255, 0]]);
    futureEffectList.push([239.5, wave, [239.5, 31, 1, 0.75, 10, 0, [255,0,255], 255, 0]]);
    futureEffectList.push([240, wave, [240, 26, -4, 0.75, 10, 0, [255,255,0], 255, 0]]);
    futureEffectList.push([238.5, radiate, [238.5, 80, 10, 0.5, [255,0,255,255], [255,0,255,0], easing = "cubeout"]])
    futureEffectList.push([239, radiate, [239, 87, 10, 0.5, [255,255,0,255], [255,255,0,0], easing = "cubeout"]])
    futureEffectList.push([239.5, radiate, [239.5, 94, 10, 0.5, [255,0,255,255], [255,0,255,0], easing = "cubeout"]])
    futureEffectList.push([240, radiate, [240, 99, 10, 0.5, [255,255,0,255], [255,255,0,0], easing = "cubeout"]])

    //BG Waves (for some reason the layering was a bit weird which is why some use push and some use unshift)
    futureEffectList.unshift([240.5, gradientWave, [240.5, 20, 120, 7.5, 0.5, 1300, 0.75, [255,0,255,255], [255,0,150,255]]]);
    futureEffectList.unshift([240.5, gradientWave, [240.5, 20, -80, 7.5, 0.5, 1300, 0.75, [255,0,255,255], [255,0,150,255]]]);
	futureEffectList.push([248, gradientWave, [248, 20, 120, 1, 0, 1300, 0.75, [0,255,0,255], [0,255,200,255]]]);
    futureEffectList.push([248, gradientWave, [248, 20, -80, 1, 0, 1300, 0.75, [0,255,0,255], [0,255,200,255]]]);
    futureEffectList.unshift([249, gradientWave, [249, 80, 160, 3.5, 0, 1300, 0.75, [0,0,100,255], [0,0,255,255]]]);
    futureEffectList.unshift([249, gradientWave, [249, 80, 0, 3.5, 0, 1300, 0.75, [0,0,100,255], [0,0,255,255]]]);
    futureEffectList.unshift([252.5, gradientWave, [252.5, 160, 80, 2.5, 0, 1300, 0.75, [0,50,200,255], [0,100,255,255]]]);
    futureEffectList.unshift([252.5, gradientWave, [252.5, 0, 80, 2.5, 0, 1300, 0.75, [0,50,200,255], [0,100,255,255]]]);
    //The last 2 go for longer to make the transition smoother
    futureEffectList.unshift([255, gradientWave, [255, 80, 160, 2, 0, 1300, 0.75, [0,150,255,255], [0,255,255,255]]]);
    futureEffectList.unshift([255, gradientWave, [255, 80, 0, 2, 0, 1300, 0.75, [0,150,255,255], [0,255,255,255]]]);
    
    //Laser fill
    for (let i = 0; i < 2; i++)
    {
        futureEffectList.push([240.5 + 4 * i, pulse, [240.5 + 4 * i, 60, 90, 0, 0.125, 0, off, [0, 255, 0, 255], off]]);
        futureEffectList.push([240.675 + 4 * i, vibrate, [240.675 + 4 * i, 85, 100, 0, 1.125, 0, off, [0, 255, 0, 255], off, 1, 20]]);
        futureEffectList.push([242 + 4 * i, pulse, [242 + 4 * i, 75, 95, 0, 0.25, 0, off, [0, 255, 0, 255], off]]);
        futureEffectList.push([242.5 + 4 * i, pulse, [242.5 + 4 * i, 75, 95, 0, 1.25 - 0.25 * i, 0, off, [0, 255, 0, 255], off]]);
    }   
    futureEffectList.push([244, pulse, [244, 50, 85, 0, 0.25, 0, off, [0, 255, 0, 255], off]]);
    futureEffectList.push([247.5, pulse, [247.5, 65, 90, 0, 0.5, 0, off, [0, 255, 0, 255], off]]);
    futureEffectList.push([248, pulse, [248, 55, 85, 0, 0.5, 0, off, [255, 0, 255, 255], off]]);
    futureEffectList.push([248.5, pulse, [248.5, 45, 80, 0, 0.5, 0, off, [255, 0, 255, 255], off]]);

    futureEffectList.push([249, pulse, [249, 20, 40, 0, 0.125, 0, off, [255, 255, 155, 255], off]]);
    futureEffectList.push([249.25, pulse, [249.25, 25, 50, 0, 0.5, 0, off, [255, 255, 155, 255], off]]);
    futureEffectList.push([250, pulse, [250, 20, 40, 0, 0.125, 0, off, [255, 255, 155, 255], off]]);
    futureEffectList.push([250.25, pulse, [250.25, 25, 50, 0, 0.5, 0, off, [255, 255, 155, 255], off]]);    
    futureEffectList.push([251, pulse, [251, 20, 40, 0, 0.5, 0, off, [255, 255, 155, 255], off]]);
    futureEffectList.push([251.5, pulse, [251.5, 13, 35, 0, 0.5, 0, off, [255, 255, 155, 255], off]]);
    futureEffectList.push([252, pulse, [252, 6, 30, 0, 0.5, 0, off, [255, 255, 155, 255], off]]);
    futureEffectList.push([252.5, vibrate, [252.5, 13, 35, 0, 2, 0.5, off, [255, 205, 55, 255], [255, 205, 55, 225], 1, 20]]);
    futureEffectList.push([255, vibrate, [255, 13, 35, 0, 0, 1.5, off, [255, 105, 0, 225], [255, 105, 0, 135], 1, 20]]);
    
    //Laser edges
    for (let i = 0; i < 2; i++)
    {
        futureEffectList.push([240.5 + 4 * i, pulse, [240.5 + 4 * i, 59, 60, 0, 0.125, 0, off, white, off]]);
        futureEffectList.push([240.675 + 4 * i, vibrate, [240.675 + 4 * i, 84, 85, 0, 1.125, 0, off, white, off, 1, 20]]);
        futureEffectList.push([242 + 4 * i, pulse, [242 + 4 * i, 74, 75, 0, 0.25, 0, off, white, off]]);
        futureEffectList.push([242.5 + 4 * i, pulse, [242.5 + 4 * i, 74, 75, 0, 1.25 - 0.25 * i, 0, off, white, off]]);       
        futureEffectList.push([240.5 + 4 * i, pulse, [240.5 + 4 * i, 90, 91, 0, 0.125, 0, off, white, off]]);
        futureEffectList.push([240.675 + 4 * i, vibrate, [240.675 + 4 * i, 100, 101, 0, 1.125, 0, off, white, off, 1, 20]]);
        futureEffectList.push([242 + 4 * i, pulse, [242 + 4 * i, 95, 96, 0, 0.25, 0, off, white, off]]);
        futureEffectList.push([242.5 + 4 * i, pulse, [242.5 + 4 * i, 95, 96, 0, 1.25 - 0.25 * i, 0, off, white, off]]);
    }
    
    futureEffectList.push([244, pulse, [244, 49, 50, 0, 0.25, 0, off, white, off]]);
    futureEffectList.push([247.5, pulse, [247.5, 64, 65, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([248, pulse, [248, 54, 55, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([248.5, pulse, [248.5, 44, 45, 0, 0.5, 0, off, white, off]]);  
    futureEffectList.push([244, pulse, [244, 85, 86, 0, 0.25, 0, off, white, off]]);
    futureEffectList.push([247.5, pulse, [247.5, 90, 91, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([248, pulse, [248, 85, 86, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([248.5, pulse, [248.5, 80, 81, 0, 0.5, 0, off, white, off]]);

    futureEffectList.push([249, pulse, [249, 19, 20, 0, 0.125, 0, off, white, off]]);
    futureEffectList.push([249.25, pulse, [249.25, 24, 25, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([250, pulse, [250, 19, 20, 0, 0.125, 0, off, white, off]]);
    futureEffectList.push([250.25, pulse, [250.25, 24, 25, 0, 0.5, 0, off, white, off]]);    
    futureEffectList.push([251, pulse, [251, 19, 20, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([251.5, pulse, [251.5, 12, 13, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([252, pulse, [252, 5, 6, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([252.5, vibrate, [252.5, 12, 13, 0, 2, 0.5, off, white, [255, 255, 255, 225], 1, 20]]);
    futureEffectList.push([255, vibrate, [255, 12, 13, 0, 0, 1.5, off, [255, 255, 255, 225], [255, 255, 255, 135], 1, 20]]); 
    futureEffectList.push([249, pulse, [249, 40, 41, 0, 0.125, 0, off, white, off]]);
    futureEffectList.push([249.25, pulse, [249.25, 50, 51, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([250, pulse, [250, 40, 41, 0, 0.125, 0, off, white, off]]);
    futureEffectList.push([250.25, pulse, [250.25, 50, 51, 0, 0.5, 0, off, white, off]]);    
    futureEffectList.push([251, pulse, [251, 40, 41, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([251.5, pulse, [251.5, 35, 36, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([252, pulse, [252, 30, 31, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([252.5, vibrate, [252.5, 35, 36, 0, 2, 0.5, off, white, [255, 255, 255, 240], 1, 20]]);
    futureEffectList.push([255, vibrate, [255, 35, 36, 0, 0, 1.5, off, [255, 255, 255, 240], [255, 255, 255, 195], 1, 20]]);
    
    //DROP 1 (3/4, Beat 256.5)
    futureEffectList.push([256.5, rainbowWave, [256.5, 24, 120, 2.5, 0.5, 3000, 4, 255]]);
    futureEffectList.push([256.5, rainbowWave, [256.5, 24, 24 - 96, 2.5, 0.5, 3000, 4, 255]]);
    futureEffectList.push([259, radiate, [259, 24, 20, 1, [255,255,255,255], [255,255,255,0], "quadout"]])
    
    futureEffectList.push([259, wave, [259, 24, 120, 0.75, 30, 2, [255,255,255], 200, 0]]);
    futureEffectList.push([259, wave, [259, 24, 24 - 120, 0.75, 30, 2, [255,255,255], 200, 0]]);
    for (let i = 0; i < 4; i++)
    {
        futureEffectList.push([259.5, move, [259.5, 0 - i, 85 - i, 0, 1, 0, off, [255,0,0,255], off, "quadout", false]]);
        futureEffectList.push([260, move, [260, 120 + i, 35 + i, 0, 1.5, 0, off, [0,150,255,255], off, "quadout", false]]);
    }
    
    //Expand
    futureEffectList.push([260.5, move, [260.5, 85, 95, 0, 0.25, 0, off, [255,0,0,255], off, "linear", true]]);
    futureEffectList.push([260.5, move, [260.5, 85, 75, 0, 0.25, 0, off, [255,0,0,255], off, "linear", true]]);
    futureEffectList.push([260.75, pulse, [260.75, 75, 85, 0, 2.25, 0, off, [255,0,0,255], off]]);
    futureEffectList.push([260.75, pulse, [260.75, 85, 95, 0, 3.25, 0, off, [255,0,0,255], off]]);
    futureEffectList.push([260.75, move, [260.75, 95, 110, 0, 0, 1, off, [255,0,0,255], off, "quadout", false]]);
    futureEffectList.push([260.75, move, [260.75, 75, 60, 0, 0, 1, off, [255,0,0,255], off, "quadout", false]]);
    futureEffectList.push([261.5, move, [261.5, 35, 45, 0, 0.25, 0, off, [0,150,255,255], off, "linear", true]]);
    futureEffectList.push([261.5, move, [261.5, 35, 25, 0, 0.25, 0, off, [0,150,255,255], off, "linear", true]]);
    futureEffectList.push([261.75, pulse, [261.75, 25, 35, 0, 1.75, 0, off, [0,150,255,255], off]]);
    futureEffectList.push([261.75, pulse, [261.75, 35, 45, 0, 0.75, 0, off, [0,150,255,255], off]]);
    futureEffectList.push([261.75, move, [261.75, 25, 10, 0, 0, 1, off, [0,150,255,255], off, "quadout", false]]);
    futureEffectList.push([261.75, move, [261.75, 45, 60, 0, 0, 1, off, [0,150,255,255], off, "quadout", false]]);
    
    //Collection
    futureEffectList.push([261.5, move, [261.5, 0, 25, 0, 1, 0, off, white, off, "quadin", false]]);
    futureEffectList.push([262.5, move, [262.5, 25, 0, 0, 0.5, 0, off, white, off, "quadout", false]]);
    futureEffectList.push([263, move, [263, 120, 95, 0, 1, 0, off, white, off, "quadin", false]]);
    futureEffectList.push([264, move, [264, 95, 120, 0, 0.5, 0, off, white, off, "quadout", false]]);
    
    for (let i = 0; i < 4; i++)
    {
        for (let j = 0; j < 9 && i % 2 == 0; j++)
        {
            futureEffectList.push([262.5 + i / 2, move, [262.5 + i / 2, 45 - j, 75 - j, 0, 0.5, 0, off, [0,150,255,255], off, "linear", false]]);
            futureEffectList.push([262.5 + i / 2, move, [262.5 + i / 2, 45 - j - 10 * i / 2, 75 - j - 10 * i / 2, 0, 0.5, 0, off, [0,150,255,255], off, "linear", false]]);
        }
        
        for (let j = 0; j < 9 && i % 2 != 0; j++)
        {
            futureEffectList.push([263 + int(i / 2), move, [263 + int(i / 2), 75 - j, (45 - j) - 45 * (i == 1 ? 0 : 1), 0, 0.5, 0, off, [0,150,255,255], off, "linear", false]]);
            futureEffectList.push([263 + int(i / 2), move, [263 + int(i / 2), 75 - j - 10 * int(i / 2), (45 - j - 10 * int(i / 2)) - 45 * (i == 1 ? 0 : 1), 0, 0.5, 0, off, [0,150,255,255], off, "linear", false]]);
        }
    }
    
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 9 && i % 2 == 0; j++)
        {
            futureEffectList.push([263 + i / 2, move, [263 + i / 2, 75 + j, (45 + j) - 45 * (i == 0 ? 0 : 1), 0, 0.5, 0, off, [255,0,0,255], off, "linear", false]]);
            futureEffectList.push([263 + i / 2, move, [263 + i / 2, 75 + j + 10 * i / 2, (45 + j + 10 * i / 2) - 45 * (i == 0 ? 0 : 1), 0, 0.5, 0, off, [255,0,0,255], off, "linear", false]]);
        }
        
        for (let j = 0; j < 9 && i % 2 != 0; j++)
        {
            futureEffectList.push([263.5 + int(i / 2), move, [263.5 + int(i / 2), 45 + j, 75 + j, 0, 0.5, 0, off, [255,0,0,255], off, "linear", false]]);
        }
    }
    
    //Effects
    futureEffectList.push([262.5, move, [262.5, 25, 15, 0, 0, 1, off, [0,150,255,255], off, "quadout", false]]);
    futureEffectList.push([262.5, move, [262.5, 45, 55, 0, 0, 1, off, [0,150,255,255], off, "quadout", false]]);
    futureEffectList.push([263.5, move, [263.5, 25, 15, 0, 0, 1, off, [0,150,255,255], off, "quadout", false]]);
	futureEffectList.push([263.5, move, [263.5, 35, 45, 0, 0, 1, off, [0,150,255,255], off, "quadout", false]]);
    futureEffectList.push([263, move, [263, 95, 105, 0, 0, 1, off, [255,0,0,255], off, "quadout", false]]);
    futureEffectList.push([263, move, [263, 75, 65, 0, 0, 1, off, [255,0,0,255], off, "quadout", false]]);
    futureEffectList.push([264, move, [264, 95, 105, 0, 0, 1, off, [255,0,0,255], off, "quadout", false]]);
	futureEffectList.push([264, move, [264, 85, 75, 0, 0, 1, off, [255,0,0,255], off, "quadout", false]]);
 
    futureEffectList.push([264.5, rainbowWave, [264.5, 0, 120, 1.5, 0.5, 3000, 4, 255]]);
    futureEffectList.push([266, rainbowWave, [266, 120, 0, 1, 0, 3000, 4, 255]]);
    
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 4; j++)
        {
            futureEffectList.push([264.5 + 0.25 * i, move, [264.5 + 0.25 * i, 0 - j, 120 - j, 0, 1, 0, off, white, off, "quadin", false]]);
            futureEffectList.push([265.5 + 0.25 * i, move, [265.5 + 0.25 * i, 120 - j, 90 - j, 0, 0.5, 0, off, white, off, "quadout", false]]);
            futureEffectList.push([266 + 0.25 * i, move, [266 + 0.25 * i, 90 - j, 0 - j, 0, 1 - 0.25 * i, 0, off, white, off, "quadin", false]]);
        }
    }
    
    futureEffectList.push([267, radiate, [267, 0, 25, 1, [255,255,255,255], [255,255,255,0], "quadout"]]);
    futureEffectList.push([267, radiate, [267, 0, 35, 1, [255,255,255,200], [255,255,255,0], "quadout"]]);
    futureEffectList.push([267, radiate, [267, 0, 55, 1, [255,255,255,150], [255,255,255,0], "quadout"]]);
    for (let i = 0; i < 10; i++)
    {
        futureEffectList.push([267, move, [267, 0 + i, 70 + i, 0, 0.75, 0, off, white, off, "quadout", false]]);
        futureEffectList.push([267.75, move, [267.75, 70 + i, 30 + i, 0, 0.75, 0, off, white, off, "quadin", false]]);
        futureEffectList.push([268.5, move, [268.5, 30 + i, 90 + i, 0, 1, 0, off, white, off, "linear", false]]);
        futureEffectList.push([269.5, move, [269.5, 90 + i, 20 + i, 0, 1, 0, off, white, off, "linear", false]]);
        futureEffectList.push([270.5, move, [270.5, 20 + i, 60 + i, 0, 0.5, 0, off, white, off, "linear", false]]);
        futureEffectList.push([271, move, [271, 60 + i, 30 + i, 0, 0.5, 0, off, white, off, "linear", false]]);
        futureEffectList.push([271.5, move, [271.5, 30 + i, 80 + i, 0, 0.5, 0, off, white, off, "linear", false]]);
        futureEffectList.push([272, move, [272, 80 + i, 50 + i, 0, 0.5, 0, off, white, off, "linear", false]]);
    }
    
    for (let i = 0; i < 4; i++)
    {
        //Left
        futureEffectList.push([267.5, move, [267.5, 0 - i, 30 - i, 0, 1, 0, off, [0,255,0], off, "quadout", false]]);
        futureEffectList.push([268.5, move, [268.5, 30 - i, 20 - i, 0, 2, 0, off, [242,27,63], off, "quadinout", false]]);
        futureEffectList.push([270.5, move, [270.5, 20 - i, 30 - i, 0, 1, 0, off, [255,153,20], off, "quadinout", false]]);
        futureEffectList.push([271.5, move, [271.5, 30 - i, 50 - i, 0, 1, 0, off, [8,189,189], off, "quadinout", false]]);
        
        //Right
        futureEffectList.push([268.5, move, [268.5, 120 + i, 90 + i + 10, 0, 1, 0, off, [0,0,255], off, "quadout", false]]);
        futureEffectList.push([269.5, move, [269.5, 90 + i + 10, 60 + i + 10, 0, 1.5, 0, off, [255,242,117], off, "quadinout", false]]);
        futureEffectList.push([271, move, [271, 60 + i + 10, 80 + i + 10, 0, 1, 0, off, [102,153,204], off, "quadinout", false]]);
        futureEffectList.push([272, move, [272, 80 + i + 10, 55 + i + 10, 0, 1, 0, off, [111,120,183], off, "quadinout", false]]);
    }
    
    futureEffectList.push([268.5, wave, [268.5, 30, 0, 0.75, 30, 2, [242,27,63], 200, 0]]);
    futureEffectList.push([269.5, wave, [269.5, 95, 125, 0.75, 30, 2, [255,242,117], 200, 0]]);
    futureEffectList.push([270.5, wave, [270.5, 20, -10, 0.75, 30, 2, [255,153,20], 200, 0]]);
    futureEffectList.push([271, wave, [271, 75, 115, 0.75, 30, 2, [102,153,204], 200, 0]]);
    futureEffectList.push([271.5, wave, [271.5, 30, 0, 0.75, 30, 2, [8,189,189], 200, 0]]);
    futureEffectList.push([272, wave, [272, 95, 135, 0.75, 30, 2, [111,120,183], 200, 0]]);
    futureEffectList.unshift([272.5, gradientWave, [272.5, 55, 0, 1.5, 0.5, 1300, 0.75, [8,189,189,255], [108,239,239,255]]]);
    futureEffectList.unshift([272.5, gradientWave, [272.5, 55, 120, 1.5, 0.5, 1300, 0.75, [111,120,183,255], [211,220,233,255]]]);
	
    for (let i = 0; i < 4; i++)
    {
        //Main lights
        futureEffectList.push([274, move, [274, 10 - i, 40 - i, 0, 1, 0, off, white, off, "quadin", false]]);
        futureEffectList.push([275, move, [275, 40 - i, 10 - i, 0, 1, 0, off, white, off, "quadout", false]]);
        futureEffectList.push([276, move, [276, 10 - i, 10 - i, 0, 2, 0, off, white, off, "linear", false]]);
        futureEffectList.push([278, move, [278, 10 - i, 40 - i, 0, 1, 0, off, [0,0,0,255], off, "quadin", false]]);
        futureEffectList.push([279, move, [279, 40 - i, 0 - i, 0, 1, 0, off, [0,0,0,255], off, "quadout", false]]);

        //Other lights
        futureEffectList.push([274.5, move, [274.5, 60 + i, 40 + i, 0, 0.5, 0, off, white, off, "cubein", false]]);
        futureEffectList.push([275, move, [275, 40 + i, 70 + i, 0, 1, 0, off, white, off, "quadout", false]]);

        futureEffectList.push([276, move, [276, 60 + i, 60 + i, 0, 2, 0, off, white, off, "linear", false]]);
        futureEffectList.push([276.5, move, [276.5, 74 + i, 74 + i, 0, 1.5, 0, off, white, off, "linear", false]]);
        futureEffectList.push([277, move, [277, 88 + i, 88 + i, 0, 1, 0, off, white, off, "linear", false]]);
        futureEffectList.push([277.5, move, [277.5, 102 + i, 102 + i, 0, 0.5, 0, off, white, off, "linear", false]]);

        futureEffectList.push([278, move, [278, 60 + i, 40 + i, 0, 1, 0, off, [0,0,0,255], off, "cubein", false]]);
        futureEffectList.push([278, move, [278, 74 + i, 40 + i, 0, 1, 0, off, [0,0,0,255], off, "cubein", false]]);
        futureEffectList.push([278, move, [278, 88 + i, 40 + i, 0, 1, 0, off, [0,0,0,255], off, "cubein", false]]);
        futureEffectList.push([278, move, [278, 102 + i, 40 + i, 0, 1, 0, off, [0,0,0,255], off, "cubein", false]]);
        futureEffectList.push([278, move, [278, 116 + i, 40 + i, 0, 1, 0, off, [0,0,0,255], off, "cubein", false]]);
    }
    
    //Effects
    futureEffectList.push([275, wave, [275, 40, 110, 0.75, 30, 2, white, 150, 0]]);
    futureEffectList.push([276, invertColors, [276, 0, 120, 0.5]]);
    futureEffectList.push([277, invertColors, [277, 0, 120, 0.5]]);
    futureEffectList.push([278, bgpulse, [278, 0, 1, 1, off, white, off]]);

    futureEffectList.push([280.5, move, [280.5, 120, 20, 0, 2.5, 0.5, off, white, off, "quadinout", false]]);
    futureEffectList.push([281.5, pulse, [281.5, 97, 98, 0, 3, 0, off, [0,0,255,255], off]]);
    futureEffectList.push([282, pulse, [282, 70, 71, 0, 2, 0, off, [0,255,0,255], off]]);
    futureEffectList.push([282.5, pulse, [282.5, 42, 43, 0, 1, 0, off, [255,0,0,255], off]]);
    futureEffectList.push([283, radiate, [283, 20, 10, 3, [255,255,255,255], [255,255,255,0], easing = "cubeout"]])
    futureEffectList.push([283.5, radiate, [283.5, 42, 10, 2.5, [255,0,0,255], [255,0,0,0], easing = "cubeout"]])
    futureEffectList.push([284, radiate, [284, 70, 10, 2, [0,255,0,255], [0,255,0,0], easing = "cubeout"]])
    futureEffectList.push([284.5, radiate, [284.5, 97, 12, 1.5, [0,0,255,255], [0,0,255,0], easing = "cubeout"]])
    
    //Invert
    for (let i = 0; i < 2; i++)
    {
        futureEffectList.push([286, move, [286, 10 + i, 10 + i, 0, 1, 0, off, [255,255,255,255], off, "linear", false]]);
        futureEffectList.push([286, move, [286, 30 + i, 30 + i, 0, 1, 0, off, [255,255,255,255], off, "linear", false]]);
        futureEffectList.push([286, move, [286, 32 + i, 32 + i, 0, 1.5, 0, off, [0,255,255,255], off, "linear", false]]);
        futureEffectList.push([286, move, [286, 52 + i, 52 + i, 0, 1.5, 0, off, [0,255,255,255], off, "linear", false]]);
        futureEffectList.push([286, move, [286, 60 + i, 60 + i, 0, 1.5, 0, off, [255,0,255,255], off, "linear", false]]);
        futureEffectList.push([286, move, [286, 80 + i, 80 + i, 0, 1.5, 0, off, [255,0,255,255], off, "linear", false]]);
        futureEffectList.push([286, move, [286, 85 + i, 85 + i, 0, 2, 0, off, [255,255,0,255], off, "linear", false]]);
        futureEffectList.push([286, move, [286, 109 + i, 109 + i, 0, 2, 0, off, [255,255,0,255], off, "linear", false]]);
        
        futureEffectList.push([287, move, [287, 10 + i, 97, 0, 1.5, 0, off, [255,255,255,255], off, "quadin", false]]);
        futureEffectList.push([287, move, [287, 30 + i, 97, 0, 1.5, 0, off, [255,255,255,255], off, "quadin", false]]);
        futureEffectList.push([287.5, move, [287.5, 32 + i, 97, 0, 1, 0, off, [0,255,255,255], off, "quadin", false]]);
        futureEffectList.push([287.5, move, [287.5, 52 + i, 97, 0, 1, 0, off, [0,255,255,255], off, "quadin", false]]);
        futureEffectList.push([287.5, move, [287.5, 60 + i, 97, 0, 1, 0, off, [255,0,255,255], off, "quadin", false]]);
        futureEffectList.push([287.5, move, [287.5, 80 + i, 97, 0, 1, 0, off, [255,0,255,255], off, "quadin", false]]);
        futureEffectList.push([288, move, [288, 85 + i, 97, 0, 0.5, 0, off, [255,255,0,255], off, "cubein", false]]);
        futureEffectList.push([288, move, [288, 109 + i, 97, 0, 0.5, 0, off, [255,255,0,255], off, "cubein", false]]);
    }
    
    futureEffectList.push([288.5, rainbowWave, [288.5, 97, 0, 2.5, 0.5, 3000, 4, 255]]);
    futureEffectList.push([288.5, rainbowWave, [288.5, 97, 194, 2.5, 0.5, 3000, 4, 255]]);

    //DROP 1 (4/4, Beat 288.5)
    futureEffectList.push([291, radiate, [291, 97, 20, 1, [255,255,255,255], [255,255,255,0], "quadout"]])
    
    futureEffectList.push([291, wave, [291, 97, 0, 0.75, 30, 2, [255,255,255], 200, 0]]);
    futureEffectList.push([291, wave, [291, 97, 194, 0.75, 30, 2, [255,255,255], 200, 0]]);
    
    for (let i = 0; i < 4; i++)
    {
        futureEffectList.push([291, move, [291, 97 + i, 67 + i, 0, 0.75, 0, off, [200,0,240,255], off, "quadout", false]]);
        futureEffectList.push([291.75, move, [291.75, 67 + i, 97 + i, 0, 0.75, 0, off, [200,0,240,255], off, "quadin", false]]);
    }
    futureEffectList.push([292.5, wave, [292.5, 97, 30, 0.75, 10, 2, [217,11,117], 255, 255]]);
    futureEffectList.push([292.5, wave, [292.5, 97, 80, 0.75, 10, 2, [126,11,217], 255, 255]]);
    futureEffectList.push([293, pulse, [293, 25, 29, 0, 1.5, 0, off, [217,11,117,255], off]]);
    futureEffectList.push([293, pulse, [293, 75, 79, 0, 2.5, 0, off, [126,11,217,255], off]]);
	futureEffectList.push([293.5, wave, [293.5, 25, 50, 0.75, 10, 2, [200,0,240], 255, 255]]);
    futureEffectList.push([293.5, wave, [293.5, 75, 100, 0.75, 10, 2, [80,12,248], 255, 255]]);
    futureEffectList.push([294, pulse, [294, 50, 54, 0, 1, 0, off, [200,0,240,255], off]]);
    futureEffectList.push([294, pulse, [294, 100, 104, 0, 2, 0, off, [80,12,248,255], off]]);
    
    for (let i = 0; i < 2; i++)
    {
        futureEffectList.push([294.5, move, [294.5, 25 + i, 15 + i, 0, 1, 0, off, [217,11,117,255], off, "quadout", false]]);
        futureEffectList.push([294.5, move, [294.5, 27 + i, 37 + i, 0, 1, 0, off, [217,11,117,255], off, "quadout", false]]);
        futureEffectList.push([295.5, move, [295.5, 15 + i, 60 + i, 0, 1, 0, off, [217,11,117,255], off, "quadin", false]]);
        futureEffectList.push([295.5, move, [295.5, 37 + i, 60 + i, 0, 1, 0, off, [217,11,117,255], off, "quadin", false]]);
        
        futureEffectList.push([295, move, [295, 50 + i, 70 + i, 0, 0.75, 0, off, [200,0,240,255], off, "quadout", false]]);
        futureEffectList.push([295, move, [295, 52 + i, 42 + i, 0, 0.75, 0, off, [200,0,240,255], off, "quadout", false]]);
        futureEffectList.push([295.75, move, [295.75, 42 + i, 60 + i, 0, 0.75, 0, off, [200,0,240,255], off, "quadin", false]]);
        futureEffectList.push([295.75, move, [295.75, 70 + i, 60 + i, 0, 0.75, 0, off, [200,0,240,255], off, "quadin", false]]);
        
        futureEffectList.push([295.5, move, [295.5, 75 + i, 55 + i, 0, 0.5, 0, off, [126,11,217,255], off, "quadout", false]]);
        futureEffectList.push([295.5, move, [295.5, 77 + i, 87 + i, 0, 0.5, 0, off, [126,11,217,255], off, "quadout", false]]);
        futureEffectList.push([296, move, [296, 55 + i, 60 + i, 0, 0.5, 0, off, [126,11,217,255], off, "quadin", false]]);
        futureEffectList.push([296, move, [296, 87 + i, 60 + i, 0, 0.5, 0, off, [126,11,217,255], off, "quadin", false]]);
        
        futureEffectList.push([296, move, [296, 100 + i, 90 + i, 0, 0.25, 0, off, [80,12,248,255], off, "quadout", false]]);
        futureEffectList.push([296, move, [296, 102 + i, 112 + i, 0, 0.25, 0, off, [80,12,248,255], off, "quadout", false]]);
        futureEffectList.push([296.25, move, [296.25, 90 + i, 60 + i, 0, 0.25, 0, off, [80,12,248,255], off, "quadin", false]]);
        futureEffectList.push([296.25, move, [296.25, 112 + i, 60 + i, 0, 0.25, 0, off, [80,12,248,255], off, "quadin", false]]);
    }
    
    //Effects
    futureEffectList.push([294.5, radiate, [294.5, 27, 5, 0.5, [255,0,0,255], [255,0,0,0], "quadout"]])
    futureEffectList.push([295, radiate, [295, 52, 5, 0.5, [255,127,0,255], [255,127,0,0], "quadout"]])
    futureEffectList.push([295.5, radiate, [295.5, 77, 5, 0.5, [255,255,0,255], [255,255,0,0], "quadout"]])
    futureEffectList.push([296, radiate, [296, 102, 5, 0.5, [0,0,255,255], [0,0,255,0], "quadout"]])

    futureEffectList.push([296.5, rainbowWave, [296.5, 60, 0, 1.5, 0.5, 3000, 4, 255]]);
    futureEffectList.push([296.5, rainbowWave, [296.5, 60, 120, 1.5, 0.5, 3000, 4, 255]]);
    futureEffectList.push([298, rainbowWave, [298, 0, 60, 1, 0, 3000, 4, 255]]);
    futureEffectList.push([298, rainbowWave, [298, 120, 60, 1, 0, 3000, 4, 255]]);
    
    for (let i = 0; i < 2; i++)
    {
        futureEffectList.push([297, move, [297, 60 + i, 20 + i, 0, 1, 0, off, white, off, "quadin", false]]);
        futureEffectList.push([297, move, [297, 60 - i, 100 - i, 0, 1, 0, off, white, off, "quadin", false]]);
        futureEffectList.push([297.5, move, [297.5, 60 + i, 40 + i, 0, 0.5, 0, off, white, off, "quadin", false]]);
        futureEffectList.push([297.5, move, [297.5, 60 - i, 80 - i, 0, 0.5, 0, off, white, off, "quadin", false]]);
        
        futureEffectList.push([298, move, [298, 20 + i, 15 + i, 0, 0.25, 0, off, white, off, "cubeout", false]]);
        futureEffectList.push([298, move, [298, 100 - i, 105 - i, 0, 0.25, 0, off, white, off, "cubeout", false]]);
        futureEffectList.push([298, move, [298, 40 + i, 35 + i, 0, 0.25, 0, off, white, off, "cubeout", false]]);
        futureEffectList.push([298, move, [298, 80 - i, 85 - i, 0, 0.25, 0, off, white, off, "cubeout", false]]);
        
        futureEffectList.push([298.25, move, [298.25, 15 + i, 60 + i, 0, 0.75, 0, off, white, off, "cubein", false]]);
        futureEffectList.push([298.25, move, [298.25, 105 - i, 60 - i, 0, 0.75, 0, off, white, off, "cubein", false]]);
        futureEffectList.push([298.25, move, [298.25, 35 + i, 60 + i, 0, 0.75, 0, off, white, off, "cubein", false]]);
        futureEffectList.push([298.25, move, [298.25, 85 - i, 60 - i, 0, 0.75, 0, off, white, off, "cubein", false]]);
    }
    
    futureEffectList.push([299, radiate, [299, 60, 10, 1, white, off, "quadout"]])
    futureEffectList.push([299, radiate, [299, 60, 20, 1, white, off, "quadout"]])
    futureEffectList.push([299, wave, [299, 60, 0, 0.75, 30, 2, [255,255,255], 200, 0]]);
    futureEffectList.push([299, wave, [299, 60, 120, 0.75, 30, 2, [255,255,255], 200, 0]]);
    
    //Main lights
    for (let i = 0; i < 10; i++)
    {
        futureEffectList.push([299.5, move, [299.5, 0 - i, 80 - i, 0, 1, 0.5, off, white, [255,0,0,255], "quadinout", false]]);
        futureEffectList.push([301, move, [301, 80 - i, 60 - i, 0, 0.75, 0.25, off, [255,0,0,255], [255,127,0,255], "quadinout", false]]);
        futureEffectList.push([302, move, [302, 60 - i, 70 - i, 0, 0.5, 0.25, off, [255,127,0,255], [255,255,0,255], "quadinout", false]]);
        futureEffectList.push([302.75, move, [302.75, 70 - i, 30 - i, 0.5, 0.25, 1.25, [255,255,0,255], [0,255,0,255], [0,0,255,255], "quadin", false]]);
    }
    
    //Color-changing laser
    for (let i = 0; i < 4; i++)
    {
        futureEffectList.push([299.75, move, [299.75, 120 + i, 40 + i, 0, 1, 0.25, off, [255,0,0,255], [255,127,0,255], "quadinout", false]]);
        futureEffectList.push([301, move, [301, 40 + i, 80 + i, 0, 1, 0.25, off, [255,127,0,255], [255,255,0,255], "quadinout", false]]);
        futureEffectList.push([302, move, [302, 75 + i, 90 + i, 0, 1, 0, off, [0,255,0,255], off, "quadout", false]]);
        futureEffectList.push([302, move, [302, 75 + i, 100 + i, 0, 1, 0, off, [0,255,255,255], off, "quadout", false]]);
        futureEffectList.push([302, move, [302, 75 + i, 110 + i, 0, 1, 0, off, [0,0,255,255], off, "quadout", false]]);
        futureEffectList.push([302, move, [302, 75 + i, 120 + i, 0, 1, 0, off, [255,0,255,255], off, "quadout", false]]);
        
        futureEffectList.push([302.25, move, [302.25, 80 + i, 0 + i, 0, 1.5, 0, off, [255,255,0,255], off, "quadin", false]]);
        futureEffectList.push([302.75, move, [302.75, 90 + i, 0 + i, 0, 1.25, 0, off, [0,255,0,255], off, "quadin", false]]);
        futureEffectList.push([303.25, move, [303.25, 100 + i, 0 + i, 0, 1, 0, off, [0,255,255,255], off, "quadin", false]]);
        futureEffectList.push([303.75, move, [303.75, 110 + i, 0 + i, 0, 0.75, 0, off, [0,0,255,255], off, "quadin", false]]);
        futureEffectList.push([304.25, move, [304.25, 120 + i, 0 + i, 0, 0.5, 0, off, [255,0,255,255], off, "quadin", false]]);
    }
    
    futureEffectList.push([304.5, rainbowWave, [304.5, 25, 120, 4, 0.5, 3000, 4, 255]]);
    futureEffectList.push([304.5, rainbowWave, [304.5, 25, -70, 4, 0.5, 3000, 4, 255]]);
    
    futureEffectList.push([308.5, rainbowWave, [308.5, 120, 25, 4.5, 0, 3000, 4, 255]]);
    futureEffectList.push([308.5, rainbowWave, [308.5, -70, 95, 4.5, 0, 3000, 4, 255]]);
    //futureEffectList.push([311.5, pulse, [311.5, 0, 120, 1, 0, 0, off, [255,255,255,200], off]]);
    
    //Laser fill pt. 2
    for (let i = 0; i < 2; i++)
    {
        futureEffectList.push([304.5 + 4 * i, pulse, [304.5 + 4 * i, 60, 90, 0, 0.125, 0, off, [0, 0, 255, 255], off]]);
        futureEffectList.push([304.675 + 4 * i, vibrate, [304.675 + 4 * i, 85, 100, 0, 1.125, 0, off, [0, 0, 255, 255], off, 1, 20]]);
        futureEffectList.push([306 + 4 * i, pulse, [306 + 4 * i, 75, 95, 0, 0.25, 0, off, [0, 0, 255, 255], off]]);
        futureEffectList.push([306.5 + 4 * i, pulse, [306.5 + 4 * i, 75, 95, 0, 1.25 - 0.25 * i, 0, off, [0, 0, 255, 255], off]]);
    }   
    futureEffectList.push([308, pulse, [308, 50, 85, 0, 0.25, 0, off, [0, 255, 0, 255], off]]);
    futureEffectList.push([311.5, pulse, [311.5, 65, 90, 0, 0.5, 0, off, [0, 255, 0, 255], off]]);
    futureEffectList.push([312, pulse, [312, 55, 85, 0, 0.5, 0, off, [0, 255, 0, 255], off]]);
    futureEffectList.push([312.5, pulse, [312.5, 45, 80, 0, 0.5, 0, off, [0, 255, 0, 255], off]]);
    
    //Laser edges pt. 2
    for (let i = 0; i < 2; i++)
    {
        futureEffectList.push([304.5 + 4 * i, pulse, [304.5 + 4 * i, 59, 60, 0, 0.125, 0, off, white, off]]);
        futureEffectList.push([304.675 + 4 * i, vibrate, [304.675 + 4 * i, 84, 85, 0, 1.125, 0, off, white, off, 1, 20]]);
        futureEffectList.push([306 + 4 * i, pulse, [306 + 4 * i, 74, 75, 0, 0.25, 0, off, white, off]]);
        futureEffectList.push([306.5 + 4 * i, pulse, [306.5 + 4 * i, 74, 75, 0, 1.25 - 0.25 * i, 0, off, white, off]]);       
        futureEffectList.push([304.5 + 4 * i, pulse, [304.5 + 4 * i, 90, 91, 0, 0.125, 0, off, white, off]]);
        futureEffectList.push([304.675 + 4 * i, vibrate, [304.675 + 4 * i, 100, 101, 0, 1.125, 0, off, white, off, 1, 20]]);
        futureEffectList.push([306 + 4 * i, pulse, [306 + 4 * i, 95, 96, 0, 0.25, 0, off, white, off]]);
        futureEffectList.push([306.5 + 4 * i, pulse, [306.5 + 4 * i, 95, 96, 0, 1.25 - 0.25 * i, 0, off, white, off]]);
    }
    
    futureEffectList.push([308, pulse, [308, 49, 50, 0, 0.25, 0, off, white, off]]);
    futureEffectList.push([311.5, pulse, [311.5, 64, 65, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([312, pulse, [312, 54, 55, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([312.5, pulse, [312.5, 44, 45, 0, 0.5, 0, off, white, off]]);  
    futureEffectList.push([308, pulse, [308, 85, 86, 0, 0.25, 0, off, white, off]]);
    futureEffectList.push([311.5, pulse, [311.5, 90, 91, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([312, pulse, [312, 85, 86, 0, 0.5, 0, off, white, off]]);
    futureEffectList.push([312.5, pulse, [312.5, 80, 81, 0, 0.5, 0, off, white, off]]);
    
    futureEffectList.push([313, pulse, [313, 100, 101, 0.5, 2.5, 0, off, white, off]]);
    futureEffectList.push([313.5, pulse, [313.5, 75, 76, 0.5, 2.5, 0, off, white, off]]);
    futureEffectList.push([314, pulse, [314, 50, 51, 0.5, 1, 0, off, white, off]]);
    futureEffectList.push([314.5, pulse, [314.5, 25, 26, 0.5, 0, 0, off, white, off]]);

    futureEffectList.push([315, radiate, [315, 25, 5, 2, white, off, "quadout"]])
    futureEffectList.push([315.5, radiate, [315.5, 50, 5, 2, white, off, "quadout"]])
    futureEffectList.push([316, radiate, [316, 100, 5, 2, white, off, "quadout"]])
    futureEffectList.push([316.5, radiate, [316.5, 75, 15, 3, white, off, "quadout"]])
    futureEffectList.push([316.5, radiate, [316.5, 75, 5, 3, white, off, "quadout"]])
    
    futureEffectList.push([319, bgpulse, [319, 2, 0, 0, off, [50,50,50,255], off]]);
    for (let i = 0; i < 3; i++)
    {
        futureEffectList.push([319 + 0.25 * i, move, [319 + 0.5 * i, -1, 60, 0, 2 - 0.5 * i, 0, off, [255,255,255,255], off, "quadin", false]]);
        futureEffectList.push([319 + 0.25 * i, move, [319 + 0.5 * i, 121, 60, 0, 2 - 0.5 * i, 0, off, [255,255,255,255], off, "quadin", false]]);
    }
    
    futureEffectList.push([321, bgpulse, [321, 0, 0, 8, off, [150,150,150,255], off]]);
    futureEffectList.push([321, radiate, [321, 60, 40, 7.5, white, off, "quadout"]])
    futureEffectList.push([321.25, radiate, [321.25, 60, 25, 7.75, white, off, "quadout"]])
    futureEffectList.push([321.5, radiate, [321.5, 60, 15, 8, white, off, "quadout"]])

    for (let i = 0; i < 4; i++)
    {
        futureEffectList.push([321 + 2 * i, wave, [321 + 2 * i, 60, 0, 2, 30, 2, [255,255,255], 50 - 12 * i, 0]]);
        futureEffectList.push([321 + 2 * i, wave, [321 + 2 * i, 60, 120, 2, 30, 2, [255,255,255], 50 - 12 * i, 0]]);
    }
}

function pulse(startingBeat, startLight, endLight, fadeInTime, holdTime, fadeOutTime, startCol, holdCol, endCol)
{
    let r, g, b, a;
    if (beat <= startingBeat + fadeInTime + holdTime + fadeOutTime)
    {
        if (beat <= startingBeat + fadeInTime)
        {
            r = startCol[0] * (1 - (beat - startingBeat) / fadeInTime) + holdCol[0] * ((beat - startingBeat) / fadeInTime);
            g = startCol[1] * (1 - (beat - startingBeat) / fadeInTime) + holdCol[1] * ((beat - startingBeat) / fadeInTime);
            b = startCol[2] * (1 - (beat - startingBeat) / fadeInTime) + holdCol[2] * ((beat - startingBeat) / fadeInTime);           
            a = startCol[3] * (1 - (beat - startingBeat) / fadeInTime) + holdCol[3] * ((beat - startingBeat) / fadeInTime);           
        }

        else if (beat <= startingBeat + fadeInTime + holdTime)
        {
            r = holdCol[0];
            g = holdCol[1];
            b = holdCol[2];
            a = holdCol[3];
        }

        else
        {
            r = holdCol[0] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[0] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
            g = holdCol[1] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[1] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
            b = holdCol[2] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[2] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
            a = holdCol[3] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[3] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
        }
        fill(r, g, b, a);
        rect(((endLight - startLight - 1) / 2 + startLight) / lightCount * width, midHeight, (endLight - startLight + 1) / lightCount * width, height);
    }
    
    else 
    {
        //Add the effect to a separate list to be removed when all lights are done for the frame
        for (let i = 0; i < currentEffectList.length; i++)
        {
            if (currentEffectList[i][0] == startingBeat && currentEffectList[i][1] == pulse && [startingBeat, startLight, endLight, fadeInTime, holdTime, fadeOutTime, startCol, holdCol, endCol].every((val, index) => val === currentEffectList[i][2][index]))
            {
                effectsToRemove.push(i);
                return;
            }
        }
    }
}

function bgpulse(startingBeat, fadeInTime, holdTime, fadeOutTime, startCol, holdCol, endCol)
{
    let r, g, b;
    if (beat <= startingBeat + fadeInTime + holdTime + fadeOutTime)
    {
        if (beat <= startingBeat + fadeInTime)
        {
            r = startCol[0] * (1 - (beat - startingBeat) / fadeInTime) + holdCol[0] * ((beat - startingBeat) / fadeInTime);
            g = startCol[1] * (1 - (beat - startingBeat) / fadeInTime) + holdCol[1] * ((beat - startingBeat) / fadeInTime);
            b = startCol[2] * (1 - (beat - startingBeat) / fadeInTime) + holdCol[2] * ((beat - startingBeat) / fadeInTime);      
            a = startCol[3] * (1 - (beat - startingBeat) / fadeInTime) + holdCol[3] * ((beat - startingBeat) / fadeInTime);           
        }

        else if (beat <= startingBeat + fadeInTime + holdTime)
        {
            r = holdCol[0]
            g = holdCol[1]
            b = holdCol[2]
            a = holdCol[3]
        }

        else
        {
            r = holdCol[0] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[0] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
            g = holdCol[1] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[1] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
            b = holdCol[2] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[2] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
            a = holdCol[3] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[3] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
        }
        background(r, g, b, a);
    }
    else 
    {
        //Add the effect to a separate list to be removed when all lights are done for the frame
        for (let i = 0; i < currentEffectList.length; i++)
        {
            if (currentEffectList[i][0] == startingBeat && currentEffectList[i][1] == bgpulse && [startingBeat, fadeInTime, holdTime, fadeOutTime, startCol, holdCol, endCol].every((val, index) => val === currentEffectList[i][2][index]))
            {
                effectsToRemove.push(i);
                return;
            }
        }
    }
}

function wave(startingBeat, startLight, endLight, duration, width, smoothing, col, startOpacity, endOpacity)
{
    if (beat <= startingBeat + duration)
    {
        let a = ((beat - startingBeat) / duration) * (endOpacity - startOpacity) + startOpacity ;
        for (let i = 1; i <= (smoothing + 1); i++)
        {
            if (startLight < endLight)
            {
                let right = (startLight - i) / lightCount * this.width + ((endLight - startLight + width) / lightCount * this.width) * ((beat - startingBeat) / duration);
                let left = right - (width - 2 * i) / lightCount * this.width;

                //Clamp the values
                if (right > endLight / lightCount * this.width) {right = endLight / lightCount * this.width;}
                if (left < startLight / lightCount * this.width) {left = startLight / lightCount * this.width;}
            }
            
            else
            {
                let left = (startLight - i) / lightCount * this.width - ((startLight - endLight + width) / lightCount * this.width) * ((beat - startingBeat) / duration);
                let right = left + (width - 2 * i) / lightCount * this.width;

                //Clamp the values
                if (right > startLight / lightCount * this.width) {right = startLight / lightCount * this.width;}
                if (left < endLight / lightCount * this.width) {left = endLight / lightCount * this.width;}
            }
            
            //Draw the dimmer rectangles before the more visible ones
            rectMode(CORNERS);
            fill(col[0] * (i / (smoothing + 1)), col[1] * (i / (smoothing + 1)), col[2] * (i / (smoothing + 1)), a);
            rect(left, 0, right, height)
            rectMode(CENTER);
        }
    }
    
    else 
    {
        //Add the effect to a separate list to be removed when all lights are done for the frame
        for (let i = 0; i < currentEffectList.length; i++)
        {
            if (currentEffectList[i][0] == startingBeat && currentEffectList[i][1] == wave && [startingBeat, startLight, endLight, duration, width, smoothing, col, startOpacity, endOpacity].every((val, index) => val === currentEffectList[i][2][index]))
            {
                effectsToRemove.push(i);
                return;
            }
        }
    }
}

function gradientWave(startingBeat, startLight, endLight, duration, extensionSpeed, gradientSpeed, gradientWidth, color1, color2)
{
    rectMode(CORNERS);
    let gradientVal = (startingBeat - (millis() / 1000)) * gradientSpeed
        
    if (startLight < endLight)
    {
        let left = startLight / lightCount * width;
        let right = ((beat - startingBeat) / extensionSpeed) * (endLight - startLight) / lightCount * width + left;
        for (let i = 0; i < (right - left) && i < (endLight - startLight) / lightCount * width; i++)
        {
            let val = -abs(((gradientVal + i) / gradientWidth) % 360 - 180) / 180 + 1;
        	let c = lerpColor(color(color1), color(color2), val);
            fill(c);
            rect(left + i, 0, left + (i + 1), height)
        }
    }
    
    else
    {
        let right = startLight / lightCount * width;
        let left = right - ((beat - startingBeat) / extensionSpeed) * (startLight - endLight) / lightCount * width;
        for (let i = 0; i < (right - left) && i < (startLight - endLight) / lightCount * width; i++)
        {
            let val = -abs(((gradientVal + i) / gradientWidth) % 360 - 180) / 180 + 1;
        	let c = lerpColor(color(color1), color(color2), val);
            fill(c);
            rect(right - i, 0, right - (i + 1), height)
        }
    }
    rectMode(CENTER);
    
    if (beat > startingBeat + duration)
    {
        //Add the effect to a separate list to be removed when all lights are done for the frame
        for (let i = 0; i < currentEffectList.length; i++)
        {
            if (currentEffectList[i][0] == startingBeat && currentEffectList[i][1] == gradientWave && [startingBeat, startLight, endLight, duration, extensionSpeed, gradientSpeed, gradientWidth, color1, color2].every((val, index) => val === currentEffectList[i][2][index]))
            {
                effectsToRemove.push(i);
                return;
            }
        }
    }
}

function rainbowWave(startingBeat, startLight, endLight, duration, extensionSpeed, rainbowSpeed, rainbowWidth, opacity)
{
    rectMode(CORNERS);
    colorMode(HSB);
    let rainbowVal = (startingBeat - (millis() / 1000)) * rainbowSpeed
        
    if (startLight < endLight)
    {
        let left = startLight / lightCount * width;
        let right = ((beat - startingBeat) / extensionSpeed) * (endLight - startLight) / lightCount * width + left;
        for (let i = 0; i < (right - left) && i < endLight / lightCount * width; i++)
        {
            fill(((rainbowVal + i) / rainbowWidth) % 360, 100, 100, opacity);
            rect(left + i, 0, left + (i + 1), height)
        }
    }
    
    else
    {
        let right = startLight / lightCount * width;
        let left = right - ((beat - startingBeat) / extensionSpeed) * (startLight - endLight) / lightCount * width;
        for (let i = 0; i < (right - left) && i < (startLight - endLight) / lightCount * width; i++)
        {
            fill(((rainbowVal + i) / rainbowWidth) % 360, 100, 100, opacity);
            rect(right - i, 0, right - (i + 1), height)
        }
    }
    
    colorMode(RGB);
    rectMode(CENTER);
    
    if (beat > startingBeat + duration)
    {
        //Add the effect to a separate list to be removed when all lights are done for the frame
        for (let i = 0; i < currentEffectList.length; i++)
        {
            if (currentEffectList[i][0] == startingBeat && currentEffectList[i][1] == rainbowWave && [startingBeat, startLight, endLight, duration, extensionSpeed, rainbowSpeed, rainbowWidth, opacity].every((val, index) => val === currentEffectList[i][2][index]))
            {
                effectsToRemove.push(i);
                return;
            }
        }
    }
}

function vibrate(startingBeat, startLight, endLight, fadeInTime, holdTime, fadeOutTime, startCol, holdCol, endCol, vibrationAmount, vibrationSpeed)
{
    let offsetInterval = 1 / vibrationSpeed * 1000;
    let sectionOffset;
    //Convert from beat back to time (in milliseconds)
    if (((beat - startingBeat) / BPM * 60 * 1000 % offsetInterval) < offsetInterval / 2) {sectionOffset = vibrationAmount;}
    else {sectionOffset = -vibrationAmount; }

    let r, g, b, a;
    if (beat <= startingBeat + fadeInTime + holdTime + fadeOutTime)
    {
        if (beat <= startingBeat + fadeInTime)
        {
            r = startCol[0] * (1 - (beat - startingBeat) / fadeInTime) + holdCol[0] * ((beat - startingBeat) / fadeInTime);
            g = startCol[1] * (1 - (beat - startingBeat) / fadeInTime) + holdCol[1] * ((beat - startingBeat) / fadeInTime);
            b = startCol[2] * (1 - (beat - startingBeat) / fadeInTime) + holdCol[2] * ((beat - startingBeat) / fadeInTime);           
            a = startCol[3] * (1 - (beat - startingBeat) / fadeInTime) + holdCol[3] * ((beat - startingBeat) / fadeInTime);           
        }

        else if (beat <= startingBeat + fadeInTime + holdTime)
        {
            r = holdCol[0];
            g = holdCol[1];
            b = holdCol[2];
            a = holdCol[3];
        }

        else
        {
            r = holdCol[0] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[0] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
            g = holdCol[1] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[1] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
            b = holdCol[2] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[2] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
            a = holdCol[3] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[3] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
        }
        fill(r, g, b, a);
        rect(((endLight - startLight - 1) / 2 + startLight + sectionOffset) / lightCount * width, midHeight, (endLight - startLight + 1) / lightCount * width, height)    }
    
    else 
    {
        //Add the effect to a separate list to be removed when all lights are done for the frame
        for (let i = 0; i < currentEffectList.length; i++)
        {
            if (currentEffectList[i][0] == startingBeat && currentEffectList[i][1] == vibrate && [startingBeat, startLight, endLight, fadeInTime, holdTime, fadeOutTime, startCol, holdCol, endCol, vibrationAmount, vibrationSpeed].every((val, index) => val === currentEffectList[i][2][index]))
            {
                effectsToRemove.push(i);
                return;
            }
        }
    }
}

function randomPulses(startingBeat, startLight, endLight, duration, pulseDuration, width, speed, randomSeed, startCol, holdCol, endCol)
{   
    let positions = [];
    let nextSeed = randomSeed * 2.5 * 100 - Math.floor(randomSeed * 2.5 * 100);
    let savedSeed = randomSeed; //For the finish condition check later
    
    //Speed is how many times they should occur per beat
    for (let i = 0; i < (duration - pulseDuration) * speed; i++)
    {
        randomSeed *= 100;
        positions.push(Math.floor(randomSeed));
        randomSeed = randomSeed - Math.floor(randomSeed);
        
        if (randomSeed <= 0)
        {
            randomSeed = nextSeed;
            nextSeed = randomSeed * 2.5 * 100 - Math.floor(randomSeed * 2.5 * 100);
        }
    }
    
    let currentIndex = Math.round(((beat - startingBeat) / duration) * positions.length);    
    for (let i = 0; i <= currentIndex && i < positions.length && (i / positions.length) * duration <= duration - pulseDuration; i++)
    {
        let leftPos = Math.floor(positions[i]/100 * (endLight - startLight - width) + startLight)
        pulse(startingBeat + (i / positions.length) * duration, leftPos, leftPos + width, pulseDuration / 2, 0, pulseDuration / 2, startCol, holdCol, endCol);
    }
    
    if (beat > startingBeat + duration)
    {
        //Add the effect to a separate list to be removed when all lights are done for the frame
        for (let i = 0; i < currentEffectList.length; i++)
        {
            if (currentEffectList[i][0] == startingBeat && currentEffectList[i][1] == randomPulses && [startingBeat, startLight, endLight, duration, pulseDuration, width, speed, savedSeed, startCol, holdCol, endCol].every((val, index) => val === currentEffectList[i][2][index]))
            {
                effectsToRemove.push(i);
                return;
            }
        }
    }
}

function move(startingBeat, startLight, endLight, fadeInTime, holdTime, fadeOutTime, startCol, midCol, endCol, easing = "none", sustain = false)
{
    let position;
    let x = (beat - startingBeat) / (fadeInTime + holdTime + fadeOutTime)
    if (easing == "cubein") { position = (endLight - startLight) * Math.pow(x, 3); }
    else if (easing == "cubeout") { position = (endLight - startLight) * (1 - Math.pow(1 - x, 3)); }
    else if (easing == "quadin") { position = (endLight - startLight) * Math.pow(x, 2); }
    else if (easing == "quadout") { position = (endLight - startLight) * (1 - Math.pow(1 - x, 2)); }
    else if (easing == "quadinout") { position = (endLight - startLight) * ((x < 0.5) ? 2 * Math.pow(x, 2) : 1 - Math.pow(-2 * x + 2, 2) / 2); }
    else { position = (endLight - startLight) * x; }
    
    let r, g, b, a;
    if (beat <= startingBeat + fadeInTime + holdTime + fadeOutTime)
    {
        if (beat <= startingBeat + fadeInTime)
        {
            r = startCol[0] * (1 - (beat - startingBeat) / fadeInTime) + midCol[0] * ((beat - startingBeat) / fadeInTime);
            g = startCol[1] * (1 - (beat - startingBeat) / fadeInTime) + midCol[1] * ((beat - startingBeat) / fadeInTime);
            b = startCol[2] * (1 - (beat - startingBeat) / fadeInTime) + midCol[2] * ((beat - startingBeat) / fadeInTime);           
            a = startCol[3] * (1 - (beat - startingBeat) / fadeInTime) + midCol[3] * ((beat - startingBeat) / fadeInTime);           
        }

        else if (beat <= startingBeat + fadeInTime + holdTime)
        {
            r = midCol[0];
            g = midCol[1];
            b = midCol[2];
            a = midCol[3];
        }

        else
        {
            r = midCol[0] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[0] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
            g = midCol[1] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[1] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
            b = midCol[2] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[2] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
            a = midCol[3] * (1 - (beat - startingBeat - fadeInTime - holdTime) / fadeOutTime) + endCol[3] * ((beat - startingBeat - fadeInTime - holdTime) / fadeOutTime);
        }
        fill(r, g, b, a);
        if (!sustain) { rect((startLight + position) / lightCount * width, midHeight, 2 / lightCount * width, height); }
        else 
        { 
            rectMode(CORNERS);
            rect((startLight + position) / lightCount * width, 0, startLight / lightCount * width, height);
            rectMode(CENTER);
        }
    }
    
    else 
    {
        //Add the effect to a separate list to be removed when all lights are done for the frame
        for (let i = 0; i < currentEffectList.length; i++)
        {
            if (currentEffectList[i][0] == startingBeat && currentEffectList[i][1] == move && [startingBeat, startLight, endLight, fadeInTime, holdTime, fadeOutTime, startCol, midCol, endCol].every((val, index) => val === currentEffectList[i][2][index]))
            {
                effectsToRemove.push(i);
                return;
            }
        }
    }
}

function radiate(startingBeat, startLight, width, fadeTime, startCol, endCol, easing = "none")
{
    if (beat <= startingBeat + fadeTime)
    {
        let pos;      
        if (easing == "cubein"){ pos = Math.pow((beat - startingBeat) / fadeTime, 3) * width; }
        else if (easing == "cubeout"){ pos = (1 - Math.pow(1 - (beat - startingBeat) / fadeTime, 3)) * width; }
        else if (easing == "quadin"){ pos = Math.pow((beat - startingBeat) / fadeTime, 2) * width; }
        else if (easing == "quadout"){ pos = (1 - Math.pow(1 - (beat - startingBeat) / fadeTime, 2)) * width; }
        else { pos = ((beat - startingBeat) / fadeTime) * width; }
        
        r = startCol[0] * (1 - (beat - startingBeat) / fadeTime) + endCol[0] * ((beat - startingBeat) / fadeTime);
        g = startCol[1] * (1 - (beat - startingBeat) / fadeTime) + endCol[1] * ((beat - startingBeat) / fadeTime);
        b = startCol[2] * (1 - (beat - startingBeat) / fadeTime) + endCol[2] * ((beat - startingBeat) / fadeTime);           
        a = startCol[3] * (1 - (beat - startingBeat) / fadeTime) + endCol[3] * ((beat - startingBeat) / fadeTime);           

        fill(r, g, b, a);
        rect((startLight + pos) / lightCount * this.width, midHeight, 2 / lightCount * this.width, height)
        rect((startLight - pos) / lightCount * this.width, midHeight, 2 / lightCount * this.width, height)
    }
    
    else 
    {
        //Add the effect to a separate list to be removed when all lights are done for the frame
        for (let i = 0; i < currentEffectList.length; i++)
        {
            if (currentEffectList[i][0] == startingBeat && currentEffectList[i][1] == radiate && [startingBeat, startLight, width, fadeTime, startCol, endCol, easing].every((val, index) => val === currentEffectList[i][2][index]))
            {
                effectsToRemove.push(i);
                return;
            }
        }
    }
}

function invertColors(startingBeat, startLight, endLight, duration)
{
    let initialPos = int(startLight / lightCount * width);
    let endPos = int(endLight / lightCount * width);
    for (let i = initialPos; i <= endPos; i++)
    {
        let initialColor = get(i, midHeight);
        fill(255 - initialColor[0], 255 - initialColor[1], 255 - initialColor[2]);
        rect(i, 50, 2, 100);
    }
    
    if (beat > startingBeat + duration)
    {
        for (let i = 0; i < currentEffectList.length; i++)
        {
            if (currentEffectList[i][0] == startingBeat && currentEffectList[i][1] == invertColors && [startingBeat, startLight, endLight, duration].every((val, index) => val === currentEffectList[i][2][index]))
            {
                effectsToRemove.push(i);
                return;
            }
        }
    }
}

function useAPI()
{
    //This is only used to control the waves that go from beat 65 - 129
    
    /* This program uses the stormglass.IO API (https://stormglass.io/)
    I can only use 10 requests per day so I'm going to create a file to store and call
    the data, that way I use less than 10 requests while still getting up-to-date 
    information*/
    
    //Also all wave data is taken at noon
    const lat = 42.3601;
    const lng = -71.0942;
    const key = "88e38048-79ee-11ed-b59d-0242ac130002-88e380d4-79ee-11ed-b59d-0242ac130002";
    const params = 'currentSpeed,swellPeriod,windWavePeriod,windSpeed';
    
    if (dataPath == "")
    {          
        fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`, {headers: { 'Authorization': key } }).then((response) => response.json()).then((jsonData) => 
        { 
            saveJSON(jsonData, 'Sail Away API Data.json');
            currentSpeed = jsonData['hours'][12]['currentSpeed']['sg'];
            swellPeriod = jsonData['hours'][12]['swellPeriod']['sg'];
            windSpeed = jsonData['hours'][12]['windSpeed']['sg'];
            windWavePeriod = jsonData['hours'][12]['windWavePeriod']['sg'];
        });
    }
    
    else
    {
        loadJSON(dataPath, getData);
        
        function getData(data)
        {
            currentSpeed = data['hours'][12]['currentSpeed']['sg'];
            swellPeriod = data['hours'][12]['swellPeriod']['sg'];
            windSpeed = data['hours'][12]['windSpeed']['sg'];
            windWavePeriod = data['hours'][12]['windWavePeriod']['sg'];            
        }        
    }    
}