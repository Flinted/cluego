
var CircularJSON = require ('circular-json');

var Ajax = function(){
  this.response = ''
  this.status = ''
}

Ajax.prototype = {
  go: function(type, route, data){
      this.status = ''
      var request = new XMLHttpRequest();
      request.open(type,route);
      request.setRequestHeader('Content-Type', 'application/json');
      request.onload = function(){
        if (request.status === 200){
          if(request.responseText){
            var jsonString = request.responseText;
            this.response = JSON.parse(jsonString)
            this.status =  "done"
             }
         }
     }.bind(this)
     request.send(data || null);
  }

}
module.exports = Ajax;


