const { BASE_URL, AUTH } = require('./Constants');
const https = require('https');
const {IncomingMessage} = require('http');
const Utils = require("./Utils");

const httpsAgent = new https.Agent({ ALPNProtocols: ['http/1.1'], minVersion: 'TLSv1.3', maxVersion: 'TLSv1.3' });

class HttpInterface {
	debug = false
	truncatedDebug = false
	setDebugMode(mode){
		switch(mode){
			case 0:
				this.truncatedDebug = false
				this.debug = false
				break
			case 1:
				this.truncatedDebug = true
				this.debug = false
				break
			case 2:
				this.truncatedDebug = false
				this.debug = true
		}
	}
	/**
	 * Sends a GET request to URL/endpoint
	 * @param {string} endpoint
	 * @returns {Promise<{header:IncomingMessage, body: any}>} Http Response
	 */
	sendRequest(endpoint){
		const url = BASE_URL + endpoint;
		const headers =
			{
				'User-Agent':'Diccionario/2 CFNetwork/808.2.16 Darwin/16.3.0',
				'Content-Type':'application/x-www-form-urlencoded',
				'Authorization': AUTH
			};
		return new Promise((resolve, reject)=>{
			https.get(url, {headers: headers, agent: httpsAgent},  (res) => {
    		let body = '';

			if(res.statusCode != 200) reject(`Error ${res.statusCode}.\nLa solicitud a ${url} fue respondida de forma inesperada.`);
    		// called when a data chunk is received.
    		res.on('data', (chunk) => {
				let data = chunk.toString().replace(/\n/g,'');
				data = data.replace(/\t/g, '');
				if(data.indexOf('json(') != -1){
					data = data.slice(5, -1);
				}if (data.indexOf('jsonp123(') != -1){
					data = data.slice(9,-1)
				}
				if(Array.isArray(data)) data = JSON.stringify(data);
				body += data;
    		});

    		// called when the complete response is received.
    		res.on('end', () => {
				if(body.length == 0){
					reject('No hubo respuesta del servidor (id incorrecta?)');
					return;
				}
				// deletes <sup>1<\/sup> on search
				body = body.replace(/<sup>\d+<\\\/sup>/g, '');
				if(body.match(/^<article id=\".*\">/)){
					const i = body.match(/id="(\w+)"/)[1];
					//deletes <sup>1</sup> on definitions
					const h = body.replace(/<sup>\d+<\/sup>/, '').match(/<header .+>([^<]+)(<\/i>)?<\/h/)[1]
						.replace(/&#xE1;/g, 'á')
						.replace(/&#xE9;/g, 'é')
						.replace(/&#xED;/g, 'í')
						.replace(/&#xF3;/g, 'ó')
						.replace(/&#xFA;/g, 'ú')
						.replace(/&#xF1;/g, 'ñ');
					body = JSON.parse(Utils.get_definitions(body));
					body["id"] = i;
					body["header"] = h;
					body = JSON.stringify(body);
				// fetch word indexed by "Véase" (see also)
				}else if(body.match(/^<abbr title="V&#xE9;ase"/)){
					const i = body.match(/id="(\w+)"/)[1];
					this.sendRequest('fetch?id=' + i).then((res)=>resolve(res));
					return;
				}else if(body != body.replace(/<\/?[^>]+(>|$)/g, '') && !body.startsWith('{')){
					body = Utils.get_definitions(body);
				}
				if(this.debug){
					console.log('fetch: GET ' + BASE_URL + endpoint);
					console.log('headers: ' + JSON.stringify(res.headers));
					console.log('body: ' + body);
					console.log('Status Code: ' + res.statusCode);
				}
				if(!this.debug && this.truncatedDebug){
					console.log('fetch: GET ' + BASE_URL + endpoint);
					console.log('body: ' + body);
					console.log('Status Code: ' + res.statusCode);
				}
				const response = {header: res, body: JSON.parse(body)};
				resolve(response);
			});

			}).on("error", (err) => {
				console.log("Error: ", err.message);
				reject(err);
			});
		});
	}
}

module.exports = HttpInterface;
