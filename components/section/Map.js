var React = require('react');
var { bindActionCreators } = require('redux');
var { connect } = require('react-redux');
var Bootstrap = require('react-bootstrap');
var { Link } = require('react-router');
var Breadcrumb = require('../Breadcrumb');
var Message = require('../Message');
var Chart = require('../Chart');
var LeafletMap = require('../LeafletMap');
var Select = require('react-select');
var DateRangePicker = require('react-bootstrap-daterangepicker');
var FilterTag = require('../chart/dimension/FilterTag');
var Timeline = require('../Timeline');
var GroupSearchTextBox = require('../GroupSearchTextBox');
var {FormattedMessage, FormattedTime, FormattedDate} = require('react-intl');
var DateRangePicker = require('react-bootstrap-daterangepicker');

var { getTimeline, getFeatures, getChart,
      setEditor, setEditorValue,
      setTimezone, addFavourite} = require('../../actions/MapActions');

var _getTimelineValues = function(timeline) {
  if(timeline) {
    return timeline.getTimestamps();
  } 
  return [];
};

var _getTimelineLabels = function(timeline) {
  if(timeline) {
    return timeline.getTimestamps().map(function(timestamp) {
      return (
        <FormattedTime  value={new Date(timestamp)} 
                        day='numeric' 
                        month='numeric' 
                        year='numeric'/>
      );      
    });
  } 
  return [];
};

var _onChangeTimeline = function(value, label, index) {
  this.props.actions.getFeatures(index, value);
};

var _onIntervalEditorChange = function (event, picker) {
  this.props.actions.setEditorValue('interval', [picker.startDate, picker.endDate]);
};

var _onSourceEditorChange = function (e) {
  this.props.actions.setEditorValue('source', e.value);
};

var onPopulationEditorChange = function(e) {
  if(!e) {
    var utility = this.props.profile.utility;

    e = {
      key: utility.key,
      name: utility.name,
      type: 'UTILITY'
    };
  }
  this.props.actions.setEditorValue('population', e);
};

var onFavouriteEditorChange = function (e) {
  this.props.actions.setEditorValue('favourite', e.value);
};

var _setEditor = function(key) {
  this.props.actions.setEditor(key);
};

var _onFeatureChange = function(features) {
  if((!features) || (features.length===0)){
    this.props.actions.setEditorValue('spatial', null);
  } else {
    this.props.actions.setEditorValue('spatial', features[0].geometry);
  }
};

var favouriteIcon;

var AnalyticsMap = React.createClass({
  
  contextTypes: {
      intl: React.PropTypes.object
  },

  componentWillMount : function() {
    if(this.props.favourite){
      //set filters and state
    }
  },
  
  componentDidMount : function() {
    var utility = this.props.profile.utility;

    this.props.actions.setTimezone(utility.timezone);

    if(!this.props.map.timeline) {
      var population = {
          utility: utility.key,
          label: utility.name,
          type: 'UTILITY'
      };
      this.props.actions.getTimeline(population);
    }
  },

  clickedAddFavourite : function() {
    
    var tags = 'Map - ' + (this.props.source || 'METER') + 
      ' - '+ this.props.interval[0].format("DD/MM/YYYY") + 
        ' to ' + this.props.interval[1].format("DD/MM/YYYY") + 
          (this.props.population ? ' - ' + this.props.population.label : '') + 
            (this.props.geometry ? ' - Custom' : '');

    var namedQuery = this.props.map.query;
    namedQuery.type = 'Map';
    namedQuery.tags = tags;
    namedQuery.title = this.refs.favouriteLabel.value;

    var request =  {
      'namedQuery' : namedQuery
    };

    this.props.actions.addFavourite(request);
  },
  
  render: function() {
    var favouriteIcon, label;
    if(this.props.isBeingEdited && !this.props.favourite){
      favouriteIcon = 'star-o';
    }
    else{
      favouriteIcon = 'star';
    }

    var tags = 'Map - ' + (this.props.source || 'METER') + 
      ' - '+ this.props.interval[0].format("DD/MM/YYYY") + 
        ' to ' + this.props.interval[1].format("DD/MM/YYYY") + 
          (this.props.population ? ' - ' + this.props.population.label : '') + 
            (this.props.geometry ? ' - Custom' : '');

    if(this.props.favourite){
      console.log('favourite not null, render active favourite');
      
    }
    
    var _t = this.context.intl.formatMessage;
    
    // Filter configuration
    var intervalLabel ='';
    if(this.props.interval) {
      var start = this.props.interval[0].format('DD/MM/YYYY');
      var end = this.props.interval[1].format('DD/MM/YYYY');
      intervalLabel = start + ' - ' + end;
      if (start === end) {
        intervalLabel = start;
      }
    }     

    var intervalEditor = (
      <div className='col-md-3'>
        <DateRangePicker  startDate={this.props.interval[0]} 
                  endDate={this.props.interval[1]} 
                  ranges={this.props.ranges} 
                  onEvent={_onIntervalEditorChange.bind(this)}>
          <div className='clearfix Select-control' style={{ cursor: 'pointer', padding: '5px 10px', width: '100%'}}>
            <span>{intervalLabel}</span>
          </div>
          </DateRangePicker>
          <span className='help-block'>Select time interval</span>
      </div>
    );
    
    var populationEditor = (
      <div className='col-md-3'>
        <GroupSearchTextBox name='groupname' onChange={onPopulationEditorChange.bind(this)}/>
        <span className='help-block'>Select a consumer group</span>
      </div>
    );

    var addFavouriteText;
    if(this.props.favourite){
      addFavouriteText = 'Buttons.UpdateFavourite';    
    }  
    else{
      addFavouriteText = 'Buttons.AddFavourite';      
    }

    var favouriteEditor = (
      <div>
        <div className='col-md-3'>
          <input  id='favouriteLabel' name='favouriteLabel' type='favourite' ref='favouriteLabel' autofocus 
            placeholder={this.props.favourite ? this.props.favourite.title : 'Label ...'} className='form-control' style={{ marginBottom : 15 }}/>
          <span className='help-block'>Insert a label for this favourite</span>
        </div>
        <div className='col-md-6'>
          <input  id='name' name='name' type='name' ref='name' autofocus disabled 
            placeholder={tags} className='form-control' style={{ marginBottom : 15 }}/>
          <span className='help-block'>Auto-generated Identifier</span>
        </div>
        <div className='col-md-3'>
          <Bootstrap.Button bsStyle='success' onClick={this.clickedAddFavourite} disabled={!this.props.isBeingEdited}>
            {_t({ id:addFavouriteText})}
          </Bootstrap.Button>
        </div>              
      </div> 
    );
         
    var sourceEditor = (
      <div className='col-md-3'>
        <Select name='source'
          value={ this.props.source || 'METER' }
          options={[
            { value: 'METER', label: 'Meter' },
            { value: 'AMPHIRO', label: 'Amphiro B1' }
          ]}
          onChange={_onSourceEditorChange.bind(this)}
          clearable={false} 
          searchable={false} className='form-group'/>
          <span className='help-block'>Select a data source</span>
        </div>
    );

    
    var filter = null;

    switch(this.props.editor) {
      case 'interval':
        filter = (
          <Bootstrap.ListGroupItem>
            <div className="row">
              {intervalEditor}
            </div>
          </Bootstrap.ListGroupItem>
        );
        break;

      case 'population':
        filter = (
          <Bootstrap.ListGroupItem>
            <div className="row">
              {populationEditor}
            </div>
          </Bootstrap.ListGroupItem>
        );
        break;
        
      case 'source':
        filter = (
            <Bootstrap.ListGroupItem>
              <div className="row">
                {sourceEditor}
              </div>
            </Bootstrap.ListGroupItem>
          );
        break;
      case 'favourite':
        filter = (
            <Bootstrap.ListGroupItem>
              <div className="row">
                {favouriteEditor}
              </div>
            </Bootstrap.ListGroupItem>
          );
        break;        
    }
    
    // Map configuration
    var mapTitle = (
      <span>
        <i className='fa fa-map fa-fw'></i>
        <span style={{ paddingLeft: 4 }}>Map</span>
        <span style={{float: 'right',  marginTop: -3, marginLeft: 5, display : (this.props.editor ? 'block' : 'none' ) }}>
          <Bootstrap.Button bsStyle='default' className='btn-circle' onClick={_setEditor.bind(this, null)}>
            <i className='fa fa-rotate-left fa-fw'></i>
          </Bootstrap.Button>
        </span>
        <span style={{float: 'right',  marginTop: -3, marginLeft: 5}}>
          <Bootstrap.Button bsStyle='default' className='btn-circle' onClick={_setEditor.bind(this, 'source')}>
            <i className='fa fa-database fa-fw'></i>
          </Bootstrap.Button>
        </span>
        <span style={{float: 'right',  marginTop: -3, marginLeft: 5}}>
        <Bootstrap.Button bsStyle='default' className='btn-circle' onClick={_setEditor.bind(this, 'spatial')} disabled>
            <i className='fa fa-map fa-fw'></i>
          </Bootstrap.Button>
        </span>
        <span style={{float: 'right',  marginTop: -3, marginLeft: 5}}>
        <Bootstrap.Button bsStyle='default' className='btn-circle' onClick={_setEditor.bind(this, 'population')}>
            <i className='fa fa-group fa-fw'></i>
          </Bootstrap.Button>
        </span>
        <span style={{float: 'right',  marginTop: -3, marginLeft: 5}}>
        <Bootstrap.Button bsStyle='default' className='btn-circle' onClick={_setEditor.bind(this, 'interval')}>
            <i className='fa fa-calendar fa-fw'></i>
          </Bootstrap.Button>
        </span>
        <span style={{float: 'right',  marginTop: -3, marginLeft: 5}}>
        <Bootstrap.Button bsStyle='default' className='btn-circle' onClick={_setEditor.bind(this, 'favourite')}>
            <i className={'fa fa-' + favouriteIcon + ' fa-fw'}></i>
          </Bootstrap.Button>
        </span>       
      </span>
    );
    
    var chartData = {
      series: []
    };

    if(this.props.chart.series) {
      if(this.props.chart.series.meters) {
        chartData.series.push({
          legend: 'Meter',
          xAxis: 'date',
          yAxis: 'volume',
          data: this.props.chart.series.meters.data
        });
      }
  
      if(this.props.chart.series.devices) {       
        chartData.series.push({
          legend: 'Amphiro B1',
          xAxis: 'date',
          yAxis: 'volume',
          data: this.props.chart.series.devices.data
        });
      }
    }

    var chartOptions = {
      tooltip: {
        show: true
      },
      dataZoom : {
        format: 'day'
      }
    };
        
    var chartTitle = (
      <span>
        <i className='fa fa-bar-chart fa-fw'></i>
        <span style={{ paddingLeft: 4 }}>Last 2 Week Consumption</span>
        <span style={{float: 'right',  marginTop: -3, marginLeft: 5 }}>
          <Bootstrap.Button bsStyle='default' className='btn-circle' disabled >
            <i className='fa fa-database fa-fw'></i>
          </Bootstrap.Button>
        </span>
        <span style={{float: 'right',  marginTop: -3, marginLeft: 5 }}>
          <Bootstrap.Button bsStyle='default' className='btn-circle' disabled >
            <i className='fa fa-map fa-fw'></i>
          </Bootstrap.Button>
        </span>
        <span style={{float: 'right',  marginTop: -3, marginLeft: 5 }}>
          <Bootstrap.Button bsStyle='default' className='btn-circle' disabled >
            <i className='fa fa-group fa-fw'></i>
          </Bootstrap.Button>
        </span>
        <span style={{float: 'right',  marginTop: -3 }}>
          <Bootstrap.Button bsStyle='default' className='btn-circle' disabled >
            <i className='fa fa-calendar fa-fw'></i>
          </Bootstrap.Button>
        </span>      
      </span>
    );    

    var chart = null, chartFilterTags = [], map, mapFilterTags = [];

    chartFilterTags.push( 
      <FilterTag key='time' text={intervalLabel} icon='calendar' />
    );
    chartFilterTags.push( 
      <FilterTag key='source' text='Meter, Amphiro B1' icon='database' />
    );

    if(chartData.series.length > 0) {
      chart = (
        <Bootstrap.ListGroupItem>
          <Chart  style={{ width: '100%', height: 400 }} 
              elementClassName='mixin'
              prefix='chart'
              options={chartOptions}
              data={chartData}/>
        </Bootstrap.ListGroupItem>
      );
    }

    mapFilterTags.push( 
      <FilterTag key='time' text={intervalLabel} icon='calendar' />
    );
    mapFilterTags.push( 
      <FilterTag key='population' text={ this.props.population ? this.props.population.label : 'All' } icon='group' />
    );
    mapFilterTags.push( 
      <FilterTag key='spatial' text={ this.props.geometry ? 'Custom' : 'Alicante' } icon='map' />
    );
    mapFilterTags.push( 
      <FilterTag key='source' text={ this.props.source === 'METER' ? 'Meter' : 'Amphiro B1' } icon='database' />
    );  

    map = (
      <Bootstrap.ListGroup fill>
        {filter}
        <Bootstrap.ListGroupItem>
          <LeafletMap style={{ width: '100%', height: 600}} 
                      elementClassName='mixin'
                      prefix='map'
                      center={[38.36, -0.479]} 
                      zoom={13}
                      mode={[LeafletMap.MODE_DRAW, LeafletMap.MODE_CHOROPLETH]}
                      draw={{
                        onFeatureChange: _onFeatureChange.bind(this)
                      }}
                      choropleth= {{
                        colors : ['#2166ac', '#67a9cf', '#d1e5f0', '#fddbc7', '#ef8a62', '#b2182b'],
                        min : this.props.map.timeline ? this.props.map.timeline.min : 0,
                        max : this.props.map.timeline ? this.props.map.timeline.max : 0,
                        data : this.props.map.features
                      }}
                      overlays={[
                        { url : '/assets/data/meters.geojson',
                          popupContent : 'serial'
                        }
                      ]}
          />
        </Bootstrap.ListGroupItem>
        <Bootstrap.ListGroupItem>
          <Timeline   onChange={_onChangeTimeline.bind(this)} 
                      labels={ _getTimelineLabels(this.props.map.timeline) }
                      values={ _getTimelineValues(this.props.map.timeline) }
                      defaultIndex={this.props.map.index}
                      speed={1000}
                      animate={false}>
          </Timeline>
        </Bootstrap.ListGroupItem>
        <Bootstrap.ListGroupItem className='clearfix'>
          <div className='pull-left'>
            {mapFilterTags}
          </div>
          <span style={{ paddingLeft : 7}}> </span>
          <Link className='pull-right' to='/' style={{ paddingLeft : 7, paddingTop: 12 }}>View dashboard</Link>
        </Bootstrap.ListGroupItem>
      </Bootstrap.ListGroup>
    );

    var mapPanel = (
      <Bootstrap.Panel header={mapTitle}>
        {map}
      </Bootstrap.Panel>
    );
   
    return (
      <div className='container-fluid' style={{ paddingTop: 10 }}>
        <div className='row'>
          <div className='col-md-12'>
            <Breadcrumb routes={this.props.routes}/>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            {mapPanel}
          </div>
        </div>
      </div>
    );
    }
});

AnalyticsMap.icon = 'map';
AnalyticsMap.title = 'Section.Map';

function mapStateToProps(state) {
  return {
      source: state.map.source,
      geometry: state.map.geometry,
      population: state.map.population,
      interval: state.map.interval,
      editor: state.map.editor,
      ranges: state.map.ranges,
      map: state.map.map,
      chart: state.map.chart,
      profile: state.session.profile,
      routing: state.routing,
      favourite: state.favourites.selectedFavourite,
      isBeingEdited: state.map.isBeingEdited
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators(Object.assign({}, { getTimeline, getFeatures, getChart,
                                                     setEditor, setEditorValue, setTimezone,
                                                     addFavourite}) , dispatch)
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(AnalyticsMap);
