/**
 * Created by Mehdi on 07/01/2018.
 */
/*global document */
/*global window */
/*global Snake */
/*global seedrandom */


function randomColor(seed = null)
{
    return '#'+Math.floor(randomNumber() * 16777215).toString(16);
}

function newDna(seed = null, dna)
{

    dna.bodyColor = randomColor(seed);

    dna.firstLeftWingColor = randomColor(seed);
    dna.firstRightWingColor = randomColor(seed);

    dna.secondLeftWingColor = randomColor(seed);
    dna.secondRightWingColor = randomColor(seed);

    console.log('new dna done');
    console.log(dna.firstLeftWingColor);
    console.log(dna.firstRightWingColor);
    console.log(dna.secondLeftWingColor);
    console.log(dna.secondRightWingColor);
}

function mutateDna()
{
    this.bodyColor = mutation(this.bodyColor);

    this.firstLeftWingColor = mutation(this.firstLeftWingColor);
    this.firstRightWingColor = mutation(this.firstRightWingColor);

    this.secondLeftWingColor = mutation(this.secondLeftWingColor);
    this.secondRightWingColor = mutation(this.secondRightWingColor);
}

function mutation(color)
{
    var randomSign = Math.random() < 0.5 ? -1 : 1;
    var hexColor = toHex(color);

    return '#' + ((randomSign * randomNumber()) + hexColor).toString();
}

function randomNumber(seed = null)
{
    return (new Math.seedrandom(seed))();
}

function toHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
}


function Dna(prevDna = null, mutator = null, seed = null)
{
    var bodyColor = "#000000";

    var firstLeftWingColor = "#000000";
    var firstRightWingColor = "#000000";

    var secondLeftWingColor = "#000000";
    var secondRightWingColor = "#000000";

    var legacySeed;

    var mutations = [];

    if(prevDna)
    {
        this.bodyColor = prevDna.bodyColor;
        this.firstLeftWingColor = prevDna.firstLeftWingColor;
        this.firstRightWingColor = prevDna.firstRightWingColor;

        this.secondLeftWingColor = prevDna.secondLeftWingColor;
        this.secondRightWingColor = prevDna.secondRightWingColor;

        this.legacySeed = prevDna.legacySeed;

        this.mutations = prevDna.mutations;
        mutateDna();
    }
    else
    {
        console.log('new dna');
        newDna(seed, this);
    }

    console.log("SnakeColor");
    console.log(this.firstLeftWingColor);
    console.log(this.firstRightWingColor);
    console.log(this.secondLeftWingColor);
    console.log(this.secondRightWingColor);
}
