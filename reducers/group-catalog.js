var moment = require('moment');
var types = require('../constants/GroupCatalogActionTypes');
var { extractFeatures } = require('../helpers/common');

var _createInitialGroupState = function() {
  return {
    groups : [],
    filtered: [],
    features : null
  };
};

var _filterRows = function(rows, type, name) {
  return rows.filter( r => {
    if(name) {
      if(r.text.indexOf(name) === -1) {
        return false;
      }
    }
    if(type) {
      return (r.type == type);
    }
    
    return true;
  });
};

var _createInitialeState = function() {
  return {
    isLoading : false,
    query : {
      type: null,
      name: null,
      geometry: null
    },
    data : _createInitialGroupState(),
    interval : [
        moment().subtract(30, 'days'), moment()
    ],
    metric: 'AVERAGE',
    charts : {

    }
  };
};

var _fillGroupSeries = function(interval, label, data) {
  var d;
  var allPoints = [];

  var ref = interval[1].clone();
  var days = interval[1].diff(interval[0], 'days') + 1;

  if ((!data) || (data.points.length === 0)) {
    for (d = days; d > 0; d--) {
      allPoints.push({
        MIN: 0,
        MAX: 0,
        SUM: 0,
        AVERAGE : 0,
        timestamp : ref.clone().toDate().getTime()
      });

      ref.subtract(1, 'days');
    }
  } else {
    var index = 0;
    var points = data.points;

    points.sort(function(p1, p2) {
      return (p2.timestamp - p1.timestamp);
    });

    for (d = days; d > 0; d--) {
      if (index === points.length) {
        allPoints.push({
          MIN: 0,
          MAX: 0,
          SUM: 0,
          AVERAGE : 0,
          timestamp : ref.clone().toDate().getTime()
        });

        ref.subtract(1, 'days');
      } else if (ref.isBefore(points[index].timestamp, 'day')) {
        index++;
      } else if (ref.isAfter(points[index].timestamp, 'day')) {
        allPoints.push({
          MIN: 0,
          MAX: 0,
          SUM: 0,
          AVERAGE : 0,
          timestamp : ref.clone().toDate().getTime()
        });

        ref.subtract(1, 'days');
      } else if (ref.isSame(points[index].timestamp, 'day')) {
        allPoints.push({
          MIN: points[index].volume.MIN,
          MAX: points[index].volume.MAX,
          SUM : points[index].volume.SUM,
          AVERAGE : points[index].volume.AVERAGE,
          timestamp : ref.clone().toDate().getTime()
        });

        index++;
        ref.subtract(1, 'days');
      }
    }
  }

  allPoints.sort(function(p1, p2) {
    return (p1.timestamp - p2.timestamp);
  });

  data.points = allPoints;
  data.label = label;

  return data;
};

var dataReducer = function(state, action) {
  switch (action.type) {
    case types.GROUP_CATALOG_ADD_FAVORITE_RESPONSE:
    case types.GROUP_CATALOG_REMOVE_FAVORITE_RESPONSE:
      var oldState = state.groups || [], newState = [];
      
      oldState.forEach( g => {
        if(g.key === action.groupKey) {
          g.favorite = action.favorite;
        }
        newState.push(g);
      });
      
      return Object.assign({}, state, {
        groups : newState
      });


    case types.GROUP_CATALOG_FILTER_NAME :
    case types.GROUP_CATALOG_FILTER_TYPE : 
    case types.GROUP_CATALOG_FILTER_CLEAR :
      return {
        groups : state.groups || [],
        filtered : _filterRows(state.groups || [], action.groupType, action.name),
        features : extractFeatures(state.groups || [])
      };
    
    case types.GROUP_CATALOG_RESPONSE:
      if (action.success === true) {
        action.groups.forEach( g => {
          if(g.type == 'SEGMENT') {
            g.text = g.cluster + ': ' + g.name;
            g.typeLabel = 'GROUP';
          } else {
            g.text = g.name;
            g.typeLabel = g.type;
          }
        });
        
        action.groups.sort( (a, b) => {
          if (a.text < b.text) {
            return -1;
          }
          
          if (a.text > b.text) {
            return 1;
          }

          return 0;
        });
        
        return {
          total : action.total || 0,
          index : action.index || 0,
          size : action.size || 10,
          groups : action.groups || [],
          filtered : _filterRows(action.groups || [], action.groupType, action.name),
          features : extractFeatures(action.groups || [])
        };
      } else {
        return {
          total : 0,
          index : 0,
          size : 10,
          groups : [],
          filtered: [],
          features : extractFeatures([])
        };
      }

    default:
      return state || _createInitialGroupState();
  }
};

var reducer = function(state, action) {
  switch (action.type) {
    case types.GROUP_CATALOG_INDEX_CHANGE:
      
      return Object.assign({}, state);

    case types.GROUP_CATALOG_REQUEST:
    case types.GROUP_CATALOG_DELETE_REQUEST:  
    case types.GROUP_CATALOG_ADD_FAVORITE_REQUEST:
    case types.GROUP_CATALOG_REMOVE_FAVORITE_REQUEST:
      
      return Object.assign({}, state, {
        isLoading : true
      });
      
    case types.GROUP_CATALOG_RESPONSE:
      action.groupType = state.query.type;
      action.name = state.query.name;
      
      return Object.assign({}, state, {
        isLoading : false,
        data : dataReducer(state.data, action)
      });

    case types.GROUP_CATALOG_ADD_FAVORITE_RESPONSE:
    case types.GROUP_CATALOG_REMOVE_FAVORITE_RESPONSE:
      
      if (action.success === true) {
        return Object.assign({}, state, {
          isLoading : false,
          data : dataReducer(state.data, action)
        });
      }
      return Object.assign({}, state, {
        isLoading : false,
      });

    case types.GROUP_CATALOG_DELETE_RESPONSE:
      
      return Object.assign({}, state, {
        isLoading : false
      });
      
    case types.GROUP_CATALOG_CHART_REQUEST:
      var charts = state.charts;
      charts[action.groupKey] = {groupSeries: null, query:action.query};
      
      return Object.assign({}, state, {
        isLoading : true,
        charts : charts,
        groupFinished: false           
      });  

    case types.GROUP_CATALOG_CHART_RESPONSE:  
      var groupCharts = state.charts;
      if (action.success) {

        groupCharts[action.groupKey] = {groupSeries: action.dataChart};    

        return Object.assign({}, state, {
          isLoading : false,
          charts : groupCharts,
          groupFinished: action.timestamp
        });
      } else {
        groupCharts[action.groupKey] = {groupSeries: null};
        return Object.assign({}, state, {
          isLoading : false,
          charts : groupCharts,
          groupFinished: action.timestamp          
        });      
      }

    case types.GROUP_CATALOG_CLEAR_CHART:
      return Object.assign({}, state, {
        isLoading : false,
        charts : {},
        groupFinished: null
      });

    case types.GROUP_CATALOG_FILTER_NAME :
      action.groupType = state.query.type;
      
      return Object.assign({}, state, {
        query : Object.assign({}, state.query, {
          name: action.name|| null
        }),
        data : dataReducer(state.data, action)
      });
      
    case types.GROUP_CATALOG_FILTER_TYPE:
      action.name = state.query.name;

      return Object.assign({}, state, {
        query : Object.assign({}, state.query, {
          type: (action.groupType === 'UNDEFINED' ? null : action.groupType)
        }),
        data : dataReducer(state.data, action)
      });
      
    case types.GROUP_CATALOG_FILTER_CLEAR :
      return Object.assign({}, state, {
        query : Object.assign({}, state.query, {
          name: null,
          type: null
        }),
        data : dataReducer(state.data, action)
      });
      
    case types.GROUP_CATALOG_SET_METRIC:
      return Object.assign({}, state, {
        metric: action.metric || 'AVERAGE',
        charts : {}
      });

    default:
      return state || _createInitialeState();
  }
};

module.exports = reducer;
