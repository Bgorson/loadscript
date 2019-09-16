module.exports = function (){


const neutralInfo = require("./neutral.json")
const fs = require ('fs')
const moment = require('moment')
const axios = require('axios')
const runInfo= require("./loadRuns.json")
function getTime(){
    // Reads JSON information to be used to get run information
    for (i=0;i<runInfo.length;i++){
        let team = runInfo[i].currentTeamInfo
        let run = runInfo[i].run
        axios.get('https://'+team.name+'.'+team.env+'.pushbot.io/_/teams/'+team.name+'/runs/'+ run, 
        {
        headers:{
            "cookie": team.cookie}
        }
        )
        .then(function(response){
            // Determines the total run time
            let start= response.data.startDate;
            let end = response.data.endDate;
            start= moment(start)
            end = moment(end)
            let diff = moment.duration(end.diff(start))
            console.log("\nLoad Testing Run\nRun:" + run + ' Seconds: '+diff._milliseconds/1000)
    
        })
        .catch(function(error){
            console.log("error:"+error)
        })
        .finally(function(){
        
        })
    }

}

function getNeutralTime(runID){
    // Retrieves neutral run information
    let team= neutralInfo[0].loadTest
    axios.get('https://'+team.name+'.'+team.env+'.pushbot.io/_/teams/'+team.name+'/runs/'+ runID,
    {
    headers:{
        "cookie": team.cookie
    }
    }
    )
    .then(function(response){
        // Calculates the run time of the neutral run
        let start= response.data.startDate;
        let end = response.data.endDate;
        start= moment(start)
        end = moment(end)
        let diff = moment.duration(end.diff(start))
        console.log("\n******NEUTRAL RUN******\nRun:" + runID + ' Seconds: '+diff._milliseconds/1000+ "\n")

    })
    .catch(function(error){
        console.log("error:"+error.response.status)
    })
    .finally(function(){
    
    })
}

console.log("\n Getting Run times \n")


fs.readFile('neutralRun.json', 'utf8', function(err,data){
    // Retrieves neutral run string
    getNeutralTime(data)
})

getTime();


}

