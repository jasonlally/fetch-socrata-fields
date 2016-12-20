var fs = require('fs')

fs.readFile('../output/tables.json', function (err, data) {
  if (err) {
    console.log(err)
  }

  var tables = JSON.parse(data).filter(function (row) {
    return row.data_type === 'tabular'
  })

  fs.readFile('../output/geo.json', function (err, data) {
    if (err) {
      console.log(err)
    }

    var geo = JSON.parse(data)
    var combined = tables.concat(geo)

    fs.writeFile('../output/combined.json', JSON.stringify(combined), function (err) {
      if (err) {
        console.log(err)
      }
    })
  })
})
