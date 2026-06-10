#tarea de bases de datos 3
pipeline: 


[
  {
    '$match': {
      'precio': {
        '$gt': 0
      }
    }
  }, {
    '$project': {
      'categoria': 1, 
      'cantidad': 1, 
      'recaudacionVenta': {
        '$multiply': [
          '$precio', '$cantidad'
        ]
      }
    }
  }, {
    '$group': {
      '_id': '$categoria', 
      'totalRecaudado': {
        '$sum': '$recaudacionVenta'
      }, 
      'cantidadItems': {
        '$sum': '$cantidad'
      }, 
      'ventaPromedio': {
        '$avg': '$recaudacionVenta'
      }
    }
  }, {
    '$match': {
      'totalRecaudado': {
        '$gt': 315
      }
    }
  }, {
    '$sort': {
      'totalRecaudado': -1
    }
  }
]
