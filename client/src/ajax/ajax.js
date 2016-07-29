var Ajax = function(){
  this.response = ''
}

Ajax.prototype = {
  go: function(type, route){
    var request = new XMLHttpRequest();
    request.open(type,route);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function(){
      if (request.status === 200){
      var jsonString = request.responseText;
      this.response = JSON.parse(jsonString);}
    }.bind(this)
    request.send(null);
  }

}
module.exports = Ajax;