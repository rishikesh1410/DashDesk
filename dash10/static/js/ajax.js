function func() {
	var request = new XMLHttpRequest();
request.open('GET', 'temp.txt', false);
request.send();
var textfileContent = request.responseText;
console.log(textfileContent);
}
func();