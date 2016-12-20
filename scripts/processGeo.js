var request = require('request')
var fs = require('fs')

fs.readFile('../output/tables.json', function (err, data) {
  if (err) {
    console.log(err)
  }

  data = JSON.parse(data)

  var geoFields = []

  var geoData = data.filter(function (row) {
    return row.data_type === 'geo'
  })

  var getView = function (data, iter, count, cb) {
    var row = data[count]
    count += 1
    request({
      url: 'https://data.sfgov.org/api/views/' + row.childView + '.json'
    }, function (err, response, body) {
      if (err) {
        console.log(err)
      }
      var result = JSON.parse(body)
      console.log('https://data.sfgov.org/api/views/' + row.childView + '.json')
      var columns = result.columns.map(function (column, index, arr) {
        return {
          'data_type': 'geo',
          'dataset_name': result.name,
          'systemID': row.systemID,
          'columnID': column.id,
          'createdAt': result.createdAt,
          'rowsUpdatedAt': result.rowsUpdatedAt,
          'viewLastModified': result.viewLastModified,
          'indexUpdatedAt': result.indexUpdatedAt,
          'childView': row.childView,
          'department': row.department,
          'field_name': column.name,
          'field_type': column.dataTypeName,
          'field_render_type': column.renderTypeName,
          'field_description': column.description,
          'field_api_name': column.fieldName
        }
      })
      geoFields = geoFields.concat(columns)
      console.log(geoFields)

      if (iter === count) {
        cb(geoFields)
      } else {
        getView(data, iter, count, cb)
      }
    })
  }

  var saveOutput = function (array) {
    var output = array.reduce(function (prev, curr) {
      return prev.concat(curr)
    }, [])

    fs.writeFile('../output/geo.json', JSON.stringify(output), function (err) {
      if (err) return console.log(err)
    })
  }

  var iterations = geoData.length
  getView(geoData, iterations, 0, saveOutput)
})
