var request = require('request')
var fs = require('fs')

request({
  url: 'https://data.sfgov.org/api/search/views.json',
  qs: {limit: 1000}
}, function (error, response, body) {
  if (error) {
    console.log(error)
  } else {
    var results = JSON.parse(body).results
    fs.writeFile('../output/input.json', JSON.stringify(results), function (err) {
      if (err) return console.log(err)
    })
    results = results.filter(function (result) {
      return result.view.flags && (result.view.viewType === 'tabular' || result.view.viewType === 'geo')
    })
      .map(function (result, index, arr) {
        if (result.view.viewType === 'tabular') {
          var columns = result.view.columns.map(function (column, index, arr) {
            var col = {
              'columnID': column.id,
              'systemID': result.view.id,
              'data_type': result.view.viewType,
              'dataset_name': result.view.name,
              'createdAt': result.view.createdAt,
              'rowsUpdatedAt': result.view.rowsUpdatedAt,
              'viewLastModified': result.view.viewLastModified,
              'indexUpdatedAt': result.view.indexUpdatedAt,
              'childView': result.view.childViews ? result.view.childViews[0] : null,
              'department': result.view.metadata && result.view.metadata.custom_fields && result.view.metadata.custom_fields['Department Metrics'] ? result.view.metadata.custom_fields['Department Metrics']['Publishing Department'] : '',
              'field_name': column.name,
              'field_type': column.dataTypeName,
              'field_render_type': column.renderTypeName,
              'field_description': column.description,
              'field_api_name': column.fieldName
            }
            return col
          })
          return columns
        } else {
          var ret = {
            'columnID': '',
            'systemID': result.view.id,
            'data_type': result.view.viewType,
            'dataset_name': result.view.name,
            'createdAt': result.view.createdAt,
            'rowsUpdatedAt': result.view.rowsUpdatedAt,
            'viewLastModified': result.view.viewLastModified,
            'indexUpdatedAt': result.view.indexUpdatedAt,
            'childView': result.view.childViews ? result.view.childViews[0] : null,
            'department': result.view.metadata && result.view.metadata.custom_fields ? result.view.metadata.custom_fields['Department Metrics']['Publishing Department'] : '',
            'field_name': '',
            'field_type': '',
            'field_render_type': '',
            'field_description': '',
            'field_api_name': ''
          }
          return ret
        }
      }).reduce(function (prev, curr) {
      return prev.concat(curr)
    })

    fs.writeFile('../output/tables.json', JSON.stringify(results), function (err) {
      if (err) return console.log(err)
    })
  }
})
