
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
        console.log(request.status)
        if (request.status === 200){
          console.log("hit")
          if(request.responseText){
            var jsonString = request.responseText;
            this.response = CircularJSON.parse(jsonString)
             }
           resolve(this.response)
         }
     }.bind(this)
     request.send(data || null);
  })//end of promise
  }

}
module.exports = Ajax;


