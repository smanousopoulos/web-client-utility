var React = require('react');
var bs = require('react-bootstrap');
var Select = require('react-select');
var moment = require('moment');
var DatetimeInput = require('react-datetime');
var CheckboxGroup = require('react-checkbox-group');
var { FormattedMessage } = require('react-intl');

var { Map, TileLayer, GeoJSON, InfoControl } = require('react-leaflet-wrapper');
var DisplayParams = require('../DisplayParams');

var util = require('../../helpers/wizard');

function SetNameItem (props) {
  const { value, setValue, intl } = props;
  return (
    <bs.Col md={5}>
      <bs.Input type="text" placeholder={intl.formatMessage({ id: 'Wizard.items.name.help' })} value={value.value} onChange={(e) => setValue({value: e.target.value, label: e.target.value })}/>
    </bs.Col>
  );
}
var WhoItem = React.createClass({
  getInitialState: function() {
    return {
      showModal: false,
      selectedCluster: Array.isArray(this.props.clusters) && this.props.clusters[0] ? this.props.clusters[0] : null,
      selectedGroups: Array.isArray(this.props.value) ? this.props.value : []
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (Array.isArray(nextProps.clusters) && nextProps.clusters[0]) {
      this.setState({ selectedCluster: nextProps.clusters[0] });
    }
    if (nextProps.value) {
      this.setState({ selectedGroups: Array.isArray(nextProps.value) ? nextProps.value : [] });
    }
  },
  render: function() {
    const { clusters, setValue, value, noAll, intl, id } = this.props;
    const { selectedCluster, selectedGroups } = this.state;
    const _t = x => intl.formatMessage({ id: x });

    const allLabel = _t('Wizard.common.all');
    const noneLabel = _t('Wizard.common.none');

    if (!clusters) return null;
    console.log('clusters: ', this.props);
    const allGroups = clusters.map(cluster => cluster.groups).reduce((p, c) => [...p, ...c], []);

    const selectedParams = clusters.map(cluster => {
      const selectedClusterGroups = selectedGroups.filter(group => group.clusterKey === cluster.key);
      return {
        key: selectedClusterGroups.length > 0 ? cluster.name : null,
        value: selectedClusterGroups.map(g => g.name)
      };
    });

    const displayGroups = selectedGroups.map(group => ({ 
      ...group, 
      value: group.key, 
      label: clusters.find(cluster => cluster.key === group.clusterKey).name + ': ' + group.name
    }));

    return (
      <div>
        <bs.Col md={4}>
          <bs.ButtonGroup vertical block>
            { !noAll ? 
              <bs.Button bsStyle={value.value === 'all' ? 'primary' : 'default'} style={{marginBottom: 10}} onClick={() => { setValue({value:'all', label: allLabel}); }}>{allLabel}</bs.Button>
              : 
                <div />
            }
            <bs.Button bsStyle={Array.isArray(value) ? 'primary' : 'default'}  style={{marginBottom: 10}} onClick={() => this.setState({showModal: true})}>{_t('Wizard.common.choose')}</bs.Button>
          </bs.ButtonGroup>
        </bs.Col>
        <bs.Col md={7}>
          <DisplayParams 
            params={selectedParams}
            limit={40}
            style={{ width: '80%' }}
          /> 
        </bs.Col>
        
        <bs.Modal
          show={this.state.showModal}
          animation={false}
          bsSize='large'
          backdrop='static'
          onHide={() => this.setState({showModal: false})}
          >
          <bs.Modal.Header closeButton>
            <h4>{_t(`Wizard.items.${id}.modal`)}</h4>
          </bs.Modal.Header>
          <bs.Modal.Body>
            
            <bs.Row>
              <bs.Tabs position='top' tabWidth={20} activeKey={selectedCluster.key} onSelect={(val) => this.setState({ selectedCluster: clusters.find(cluster => cluster.key === val) })}>
                {
                  clusters.map((cluster, idx) => (
                    <bs.Tab key={idx} eventKey={cluster.key} title={cluster.name} />
                    ))
                }
              </bs.Tabs>
            </bs.Row>
            
            <bs.Row style={{ marginTop: 15 }}>
              <bs.Col md={4}>
                <CheckboxGroup name='select-groups' value={selectedGroups.map(group => group.key)} onChange={newValues =>  this.setState({ selectedGroups: newValues.map(key => allGroups.find(group => group.key === key))  })}>
                {
                  Checkbox => 
                  <ul style={{listStyle: 'none'}}>
                    {
                      selectedCluster.groups  
                      .map((group, idx) => (
                        <li key={idx}><label><Checkbox value={group.key}/> {group.name} </label></li>
                      ))
                    }
                  </ul>
                }
                </CheckboxGroup>
              </bs.Col>
            
                <bs.Col md={6}>
                  <DisplayParams 
                    params={selectedParams}
                    limit={40}
                    style={{ width: '80%' }}
                  />
              </bs.Col>

              <bs.Col xs={3} md={2}>
                <bs.Button bsStyle='primary' style={{ marginRight: 5 }} onClick={() => { this.setState({ selectedGroups: [...selectedGroups.filter(group => group.clusterKey !== selectedCluster.key), ...selectedCluster.groups] }); }}>{allLabel}</bs.Button>
                <bs.Button bsStyle='default' onClick={() => { this.setState({ selectedGroups: selectedGroups.filter(group => group.clusterKey !== selectedCluster.key) }); }}>{noneLabel}</bs.Button>
              </bs.Col>
            </bs.Row>

          </bs.Modal.Body>
          <bs.Modal.Footer>
            <bs.Button onClick={() => { setValue(displayGroups);  this.setState({showModal: false}); }}>OK</bs.Button>
            <bs.Button onClick={() => this.setState({showModal: false})}>{_t('Buttons.Cancel')}</bs.Button>
          </bs.Modal.Footer>
        </bs.Modal>
      </div>
    );
  }
});

var WhereItem = React.createClass({
  getInitialState: function() {
    return {
      showModal: false,
      selectedCluster: Array.isArray(this.props.clusters) && this.props.clusters[0] ? this.props.clusters[0] : null,
      selectedGroups: Array.isArray(this.props.value) ? this.props.value : []
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (Array.isArray(nextProps.clusters) && nextProps.clusters[0]) {
      this.setState({ selectedCluster: nextProps.clusters[0] });
    }
    if (nextProps.value) {
      this.setState({ selectedGroups: Array.isArray(nextProps.value) ? nextProps.value : [] });
    }
  },
  render: function() {
    const { setValue, clusters, value, noAll, intl, geojson, id } = this.props;

    const _t = x => intl.formatMessage({ id: x });
    const allLabel = _t('Wizard.common.all');
    const noneLabel = _t('Wizard.common.none');

    const { selectedCluster, selectedGroups } = this.state;

    if (!clusters) return null;
    const allGroups = clusters.map(cluster => cluster.groups).reduce((p, c) => [...p, ...c], []);
    const selectedParams = clusters.map(cluster => {
      const selectedClusterGroups = selectedGroups.filter(group => group.clusterKey === cluster.key);
      return {
        key: selectedClusterGroups.length > 0 ? cluster.name : null,
        value: selectedClusterGroups.map(g => g.name)
      };
    });

    const displayGroups = selectedGroups.map(group => ({ 
      ...group, 
      value: group.key, 
      //label: clusters.find(cluster => cluster.key === group.clusterKey).name + ': ' + group.name
      label: group.name
    }));
   
    return (
      <div>

        <bs.Col md={4}>
          <bs.ButtonGroup vertical block>
            { !noAll ? 
              <bs.Button bsStyle={value.value === 'all' ? 'primary' : 'default'} style={{marginBottom: 10}} onClick={() => setValue({value:'all', label: allLabel})}>{allLabel}</bs.Button>
              :
                <div />
            }
            <bs.Button bsStyle={Array.isArray(value) ? 'primary' : 'default'} style={{marginBottom: 10}} onClick={() => this.setState({showModal: true})}>{_t('Wizard.common.choose')}</bs.Button>

          </bs.ButtonGroup>
        </bs.Col>
        <bs.Col md={7}>
          {
            <DisplayParams
              params={selectedParams}
              limit={4}
            />
          }
        </bs.Col>
        
        <bs.Modal
          show={this.state.showModal}
          dialogClassName='map-modal'
          backdrop='static'
          animation={false}
          onHide={() => this.setState({showModal: false})}
          >
          <bs.Modal.Header closeButton>
            <h4>{_t(`Wizard.items.${id}.modal`)}</h4>
          </bs.Modal.Header>
          <bs.Modal.Body>
            <bs.Row>
              <bs.Tabs position='top' tabWidth={20} activeKey={selectedCluster.key} onSelect={(val) =>  this.setState({ selectedCluster: clusters.find(cluster => cluster.key === val) })}>
                {
                  clusters.map((cluster, idx) => (
                    <bs.Tab key={idx} eventKey={cluster.key} title={cluster.name} />
                    ))
                }
              </bs.Tabs>
            </bs.Row>
            <bs.Row>
              <bs.Col md={8}>
              <Map
                style={{ width: '100%', height: 600 }}
                center={[38.35, -0.48]} 
                zoom={12.55}
                >
                <TileLayer />

                <InfoControl position='topright'> 
                  <GeoJSON
                    data={{ type: 'FeatureCollection', features: selectedCluster.groups.map(g => g.feature)}}
                    infoContent={feature => feature ? <div><h5>{feature.properties.label}</h5><span>{feature.properties.value}</span></div> : <div><h5>Hover over an area...</h5></div>}
                    onClick={(map, layer, feature) => { 
                      if (this.state.selectedGroups.map(g => g.key).includes(feature.properties.label)) {
                        this.setState({ selectedGroups: this.state.selectedGroups.filter(group => group.key !== feature.properties.label) });
                      }
                      else {
                        this.setState({ selectedGroups: [...this.state.selectedGroups, allGroups.find(group => group.key === feature.properties.label)] });
                      }
                    }}
                    style={feature => this.state.selectedGroups.map(g => g.key).includes(feature.properties.label) ? ({
                      fillColor: "#ff0000",
                      color: "#000",
                      weight: 3,
                      opacity: 1,
                      fillOpacity: 0.5
                    }) : ({
                      fillColor: "#fff",
                      color: "#000",
                      weight: 3,
                      opacity: 1,
                      fillOpacity: 0.5
                    })}
                    highlightStyle={{ weight: 4 }}
                  />
                </InfoControl>
              </Map>
            </bs.Col>
            <bs.Col md={4}>
              <div style={{ margin: 15, textAlign: 'right' }}>
                <bs.Button bsStyle='primary' style={{ marginRight: 5 }} onClick={() => { this.setState({ selectedGroups: [...selectedGroups.filter(group => group.clusterKey !== selectedCluster.key), ...selectedCluster.groups] }); }}>{allLabel}</bs.Button>
                <bs.Button bsStyle='default' onClick={() => { this.setState({ selectedGroups: selectedGroups.filter(group => group.clusterKey !== selectedCluster.key) }); }}>{noneLabel}</bs.Button>
              </div>

              <div style={{ margin: 20 }}>
                <DisplayParams
                  params={selectedParams}
                  limit={50}
                  show={20}
                  style={{ height: 600, overflow: 'auto' }}
                />
              </div>
            </bs.Col>
            </bs.Row>
          </bs.Modal.Body>
          
          <bs.Modal.Footer>
            <bs.Button onClick={() => { setValue(displayGroups);  this.setState({showModal: false})} }>OK</bs.Button>
            <bs.Button onClick={() => this.setState({showModal: false})}>Cancel</bs.Button>
          </bs.Modal.Footer>
        </bs.Modal> 
        </div>
    );
  }
});

var WhenItem = React.createClass({
  getInitialState: function() {
    return {       
      showModal: false,
      timespan: this.props.initialValue.timespan ? this.props.initialValue.timespan : this.getLastYear(),
    };
  },
  componentDidMount: function() {
    /*
    if (!this.props.value.value) {
    this.props.setValue({timespan: this.getLastYear(), value:'lastYear', label: 'Last year'});
    }
    */
  },
  getLastYear: function() {
    return [moment().subtract(1, 'year').startOf('year').valueOf(), moment().subtract(1, 'year').endOf('year').valueOf()];
  },
  render: function() {
    const { value, setValue, intl } = this.props;


    const _t = x => intl.formatMessage({ id: x });

    const lastLabel = _t('Wizard.items.when.options.last.value');
    const chooseLabel = _t('Wizard.common.choose');

    return (
      <div>
        <bs.Col md={4}>
          <bs.ButtonGroup vertical block>
              <bs.Button bsStyle={value.value === 'lastYear' ? 'primary' : 'default'} style={{marginBottom: 10}} onClick={() => setValue({timespan: this.getLastYear(), value:'lastYear', label: lastLabel} )}>{lastLabel}</bs.Button>
            <bs.Button bsStyle={value.value === 'custom' ? 'primary' : 'default'} style={{marginBottom: 10}} onClick={() => this.setState({showModal: true})}>{chooseLabel}</bs.Button>
          </bs.ButtonGroup>
        </bs.Col>

        <bs.Modal
          show={this.state.showModal}
          animation={false}
          backdrop='static'
          onHide={() => this.setState({showModal: false})}
          > 
          <bs.Modal.Header closeButton>
            <h4>{_t('Wizard.items.when.modal')}</h4>
          </bs.Modal.Header>
          <bs.Modal.Body>          
            {
              (() => {
                var { timespan } = this.state;
                const [t0, t1] = timespan;

                const datetimeProps = {
                  closeOnSelect: true,
                  dateFormat: 'ddd D MMM[,] YYYY',
                  timeFormat: null, 
                  inputProps: {size: 10}, 
                };

                return (
                  <div className="form-group">
                    <label className="control-label">Date Range:</label>
                    <div>
                      <DatetimeInput {...datetimeProps} 
                        value={t0} 
                        onChange={(val) => (this.setState({ timespan: [val, t1] }))} 
                       />
                      &nbsp;-&nbsp;
                      <DatetimeInput {...datetimeProps} 
                        value={t1}
                        onChange={(val) => (this.setState({ timespan: [t0, val] }))} 
                       />
                      <p className="help text-muted">{'Specify the time range you are interested in'}</p>
                    </div>
                  </div>
                  );
              })()
            }
          </bs.Modal.Body>
          <bs.Modal.Footer>
            <bs.Button onClick={() => { setValue({timespan: this.state.timespan, value: 'custom', label: `${moment(this.state.timespan[0]).format('DD/MM/YYYY')}-${moment(this.state.timespan[1]).format('DD/MM/YYYY')}` });   this.setState({showModal: false})} }>OK</bs.Button>
            <bs.Button onClick={() => this.setState({showModal: false})}>{_t('Buttons.Cancel')}</bs.Button>
          </bs.Modal.Footer>
        </bs.Modal> 
      </div>
    );
  }
});

function DistributionItem (props) {
  const { value, setValue, intl } = props;
  const distributionItems = [
    {value: 'equally', label: intl.formatMessage({ id: 'Wizard.items.distribution.options.equally.value' })},
    {value: 'fairly', label: intl.formatMessage({ id: 'Wizard.items.distribution.options.fairly.value' })}
  ];

  return (
    <bs.Col md={5}>
      <bs.ButtonGroup vertical block>
      {
        distributionItems.map(item => 
          <bs.Button 
            key={item.value}
            bsStyle={item.value === value.value ? 'primary' : 'default'} 
            style={{marginBottom: 10}} 
            onClick={() => setValue(item)}
            >
            <FormattedMessage id={`Wizard.items.distribution.options.${item.value}.label`} />
        </bs.Button>
        )
      }
      </bs.ButtonGroup>
    </bs.Col>
  );
}

function SetGoalItem (props) {
  const { value, setValue } = props;
  return (
    <bs.Col md={5}>
      <span style={{ float: 'left', fontSize: '3em', height: '100%', marginRight: 10 }}>-</span>
      <bs.Input 
        type="number" 
        min='0'
        max='100'
        step='0.01'
        value={parseFloat(value.value).toFixed(2)} 
        bsSize="large" 
        style={{ float: 'left', width: '60%', height: '100%', fontSize: '2.8em' }} 
        onChange={(e) => setValue({value: e.target.value, label: '-' + e.target.value + ' %'})}
      />
      <span style={{ float: 'left', marginLeft: 10, fontSize: '2.2em' }}>%</span>
    </bs.Col>
  );
}

function SelectSavingsScenario (props) {
  const { value, setValue, items } = props;
  const scenarios = items.filter(scenario => scenario.completedOn != null)
  .map(scenario => {
    //const paramsShort = util.getFriendlyParams(scenario.parameters, 'short')
    //    .map(x => `${x.key}: ${x.value}`).join(', ');
    return { 
      label: scenario.name, 
      value: scenario.id, 
      parameters: scenario.parameters 
    };
    });
  return (
    <bs.Col md={5}>
      <Select
        bsSize="large"
        name='scenario-select'
        multi={false}
        options={scenarios}
        value={value}
        onChange={(val) => val != null ? setValue(val) : setValue({}) }
      />
    </bs.Col>
  );
}

function SetSavingsPercentageItem (props) {
  const { value, setValue } = props;
  return (
    <div>
      <bs.Col md={5}>
        <bs.Input 
          type='number'
          min='0'
          max='100'
          step='0.01'
          value={parseFloat(value.value).toFixed(2)} 
          bsSize='large'
          style={{ float: 'left', width: '60%', height: '100%', fontSize: '2.8em' }} 
          onChange={(e) => setValue({value: e.target.value, label: e.target.value + ' %'})}
        />
      <span style={{ float: 'left', marginLeft: 10, fontSize: '1.8em' }}>%</span>
    </bs.Col>
    <bs.Col md={6} style={{ textAlign: 'left' }}>
      <h3><FormattedMessage id='Wizard.items.savings.help' /></h3>
    </bs.Col>
    </div>
  );
}

function SelectBudgetType (props) {
  const { value, setValue, intl } = props;
  const budgetTypes = [
    {value: 'scenario', label: intl.formatMessage({ id: 'Wizard.items.budgetType.options.scenario.value' })}, 
    {value: 'estimate', label: intl.formatMessage({ id: 'Wizard.items.budgetType.options.estimate.value' })}
  ];
  return (
    <bs.Col md={4}>
      {
        budgetTypes.map(budget =>  
          <bs.Button 
            key={budget.value}
            bsStyle={budget.value === value.value ? 'primary' : 'default'} 
            bsSize='large' 
            style={{marginBottom: 10}} 
            onClick={() => setValue(budget)} 
            block
            >
            <FormattedMessage id={`Wizard.items.budgetType.options.${budget.value}.label`} />
          </bs.Button>
          )
      }
    </bs.Col>
  );
}

module.exports = {
  SetNameItem,
  WhoItem,
  WhereItem,
  WhenItem,
  DistributionItem,
  SetGoalItem,
  SelectSavingsScenario,
  SetSavingsPercentageItem,
  SelectBudgetType,
}; 
