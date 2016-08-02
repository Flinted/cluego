var CircularJSON = require ('circular-json');

var Ajax = function(){
  this.response = ''
}

Ajax.prototype = {
  go: function(type, route, data){
    return new Promise(function(resolve, reject) {

      var request = new XMLHttpRequest();
      request.open(type,route);
      request.setRequestHeader('Content-Type', 'application/json');
      request.onload = function(){
        if (request.status === 200){
          if(request.responseText){
            var jsonString = request.responseText;
            if(jsonString[0] === "["){
              this.response = [];
              jsonString = jsonString.substring(1,jsonString.length-1)
              // jsonString.forEach(function(game){
                this.response.push(CircularJSON.parse(jsonString))
              // }.bind(this))
              console.log(this.response)

            }else{
                console.log(jsonString)

             this.response= CircularJSON.parse(jsonString);
           }
           resolve(this.response)
         }
       }
     }.bind(this)
     request.send(CircularJSON.stringify(data) || null);
  })//end of promise
  }

}
module.exports = Ajax;

