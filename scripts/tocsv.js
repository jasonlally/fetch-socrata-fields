var json2csv = require('json2csv')
var fs = require('fs')

var file = 'combined'

fs.readFile('../output/' + file + '.json', function (err, data) {
	if (err) throw err

	data = JSON.parse(data)

	var csv = json2csv({data: data})

	fs.writeFile('../output/' + file + '.csv', csv, function (err){
		if (err) throw err
		console.log('file saved')
	})
})