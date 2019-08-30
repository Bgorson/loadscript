const axios = require('axios');
const inquirer = require ('inquirer')
const teamInfo= require ("./teamInfo.json")

console.log(teamInfo[0].name)
for (n=0;n<teamInfo.length;n++){
let currentTeamInfo= teamInfo[n]
inquirer.prompt([{
    name: "batchNumber",
    type: "input",
    message: "How many batch process do you want to start on"+ teamInfo[n].name + "?"
},
{
    name: "batchSize",
    type: "input",
    message: "How large should the batch be?"
}
]).then(function (response) {
    console.log(teamInfo)
console.log(response)
for (i=0;i<response.batchNumber;i++){
    axios.post('https://'+currentTeamInfo.name+'.pushbot.com/v1/webhooks/'+ currentTeamInfo.pushBot , {
        "batchsize": response.batchSize
    })
    .then(function(response){
        console.log(response);
    })
    .catch(function(error){
        console.log(error)
    })
    .finally(function(){
    
    })
    }
})
}

