const axios = require('axios');
const inquirer = require ('inquirer')
const teamInfo= require ("./teamInfo.json")
const neutralTeam= require("./neutral.json")
const fs = require ('fs')
const timeScript= require('./load_Time.js')

let runID;
let runNeutralTest= true;
// Total test time in seconds
let testLength= 10;
// Time to start neutral test in seconds
let neutralStart=10

function slowDown(){
    // Gives the other push bots an opportunity to start before running the test bot
    setTimeout(function() {
        testImpact()},neutralStart*1000)
}
function testImpact(){
    if (runNeutralTest){
    // Runs a neutral test on a different enviornment if indicated. 
    let currentTeamInfo= neutralTeam[0].loadTest
    axios.post('https://'+currentTeamInfo.name+'.'+currentTeamInfo.env+ '.pushbot.io/_/teams/'+ currentTeamInfo.name+'/runs/',
    {
    "processID": currentTeamInfo.pushBot
},
    {
    headers: {
        "cookie": currentTeamInfo.cookie
}
})
.then(function(response){
    // Stores run information for easy access by load_Time.JS
    runID= response.data.runID;
    console.log('neutral run:'+runID)
    fs.writeFile('neutralRun.json', runID, 'utf8', function(){
        console.log("stored neutral")
    })
    
})
    }
    else {
        console.log("Not running a neutral test")
    }
}

function start(){
    inquirer.prompt([{
        type: "list",
        name: "task",
        choices:["Create Teams", "Run Pushbots", "Get Times"],
        message:"What would you like to do?"
    }]).then(function(response){
        console.log(response)
        if (response.task==="Run Pushbots"){
            startLoad();
        }
        if (response.task==="Get Times"){
            timeScript()
        }
        if (response.task==="Create Teams"){
            createTeam();
        }
        else {
            console.log("**********")
            console.log( "I Cant do that yet : ( ")
            console.log("**********")
        }
    })
}

function startLoad(){
let storedRuns=[];
// Determine how many Root Runs will be executed

inquirer.prompt([{
    name: "batchNumber",
    type: "input",
    message: "How many batch process do you want to start?"
},
{
    // Determine if a neutral run will occur on a seperate environment 
    name: "neutralBool",
    type:"confirm",
    message:"Do you want to run a neutral run?"
}
]).then(function (response) {
    console.log(response)
    // Disable flag for neutral run
    if (!response.neutralBool){
        runNeutralTest= false;
    }
    console.log(runNeutralTest)
    // Create the amount of push bots indicated by user
    let interval = (testLength/response.batchNumber)*1000
    for (n=0;n<teamInfo.length;n++){
        let currentTeamInfo= teamInfo[n].loadTest
        let i=0;
        let polling= setInterval(function(){
            if (i==response.batchNumber){
                clearInterval(polling)
                fs.writeFile('loadRuns.json', JSON.stringify(storedRuns),'utf8', function() {
                    console.log("wrote active files")
                })
            }
            else {
                axios.post('https://'+currentTeamInfo.name+'.'+currentTeamInfo.env+ '.pushbot.io/_/teams/'+ currentTeamInfo.name+'/runs/',
                {
                "processID": currentTeamInfo.pushBot
        },
                {
                headers: {
                    "cookie": currentTeamInfo.cookie
            }
        })
            .then(function(response){
                runID= response.data.runID;
                console.log(runID)
                storedRuns.push({
                    currentTeamInfo,
                    run:runID
                })
            })
            i++}
        },interval)
        }        
        slowDown(); 

    })
}


function createTeam(){
    inquirer.prompt([
        {
        type: "input",
        name: "teamName",
        message:"What do you want your team to be called?"
    },
    {
        type: "input",
        name: "email",
        message:"What is your email?"
    },
    {
        type: "input",
        name: "user",
        message:"What is your user name?"
    },
    {
        type: "password",
        name: "password",
        message:"What do you want the password to be? (This is not secure)"
    },
    {
        type: "list",
        name: "env",
        choices:["cyan"],
        message:"On what Environment?"
    }
]).then(function(response){
    console.log(response)
    axios.post('https://api.'+response.env+'.pushbot.io/'+response.env+'/teams',
    {
    "teamName": response.teamName,
    "ownerUsername":response.user,
    "ownerEmail":response.email,
    "ownerPassword":response.password
    }
).then(function(data){
    console.log(data)
    importPushBot(response.env, response.teamName, )
})
})
}


function importPushBot(env, team, file, cookie){

}

function storeTeamData(env, team, pushbot, cookie){

}



start();
