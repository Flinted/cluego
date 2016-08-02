var CircularJSON = require ('circular-json');

var Ajax = function(){
  this.response = ''
}

Ajax.prototype = {
  go: function(type, route, data){
    var request = new XMLHttpRequest();
    request.open(type,route);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function(){
      if (request.status === 200){
        if(request.responseText){
      var jsonString = request.responseText;
      // var trimString = jsonString.substring(1,jsonString.length-1)

      this.response = CircularJSON.parse(jsonString);
      console.log(this.response)

    }
    }
    }.bind(this)
    request.send(CircularJSON.stringify(data) || null);
  }

}
module.exports = Ajax;