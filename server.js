const http = require('http');
const fs = require('fs');
const url = require('url');

function time() {
	var t = new Date();
	return (t.getMonth() + 1).toString() + '/' + (t.getDate()).toString() + '/' + (t.getFullYear()).toString() + ' ' + (t.getHours()).toString() + ':' + (t.getMinutes()).toString() + ':' + (t.getSeconds()).toString() + ': ';
}

server = http.createServer(function (req, res) {
	const parsed = url.parse(req.url, true);
	const filetype = parsed.pathname.split('.')[1];
	const ip =req.socket.remoteAddress;
	console.log(time() + 'new request from ' + ip + ' for ' + parsed.path);
	let query = parsed.query
	let path = parsed.pathname;
	pathsplit = path.split('/');
	
	res.setHeader('Access-Control-Allow-Origin', '*');
	
	if (pathsplit[1] == 'api') {
		if (pathsplit[2] == 'setpos') {
			console.log(query.x);
			console.log(query.y);
			res.writeHead(200);
			res.end('200');
			return;
		}
		res.writeHead(404);
		console.log(time() + '404');
		res.end('404 :/');
	} else {
		if (!path.includes('.')) {
			if (path[path.length - 1] == '/') {
				path += 'index.html';
			} else {
				path += '/index.html';
			}
		}
		
		fs.readFile(path.substring(1), (err, data) => {
			if (err) {
				res.writeHead(404);
				console.log(time() + '404');
				res.end('404 :/');
				return;
			}
			if (filetype == 'json') {
				res.writeHead(200, {'Content-Type': 'text/json'})
			} else {
				res.writeHead(200)
			}
			console.log(time() + '200');
			res.end(data);
		});
	}
})

server.listen(8080);
console.log(time() + 'server started!');
