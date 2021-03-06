var React = require('react');
var { bindActionCreators } = require('redux');
var { connect } = require('react-redux');
var bs = require('react-bootstrap');
var { Link } = require('react-router');
var { push } = require('react-router-redux');
var util = require('../../../helpers/wizard');
var { injectIntl, FormattedDate } = require('react-intl');

var Modal = require('../../Modal');
var Table = require('../../Table');
var Actions = require('../../../actions/BudgetActions');
var { getTimeline, getMetersLocations } = require('../../../actions/MapActions');

const SPATIAL_CLUSTERS = [{
  key: 'area',
  name: 'Areas'
}];

var Budgets = React.createClass({ 
  render: function() {
    const { routes, children, budgetToRemove, actions, clusters, groups, segments, budgets, intl } = this.props;
    const { removeBudgetScenario, confirmRemoveBudgetScenario, goToListView } = actions;
    return (
			<div className='container-fluid' style={{ paddingTop: 10 }}>
        <div className='row'>
          <div className='col-md-12' style={{marginTop: 10}}>
            {
              React.cloneElement(children, { clusters, groups, segments, budgets, actions, intl })
            }
          </div>
          
          <RemoveConfirmation
            goToListView={goToListView}
            scenario={budgetToRemove}
            removeScenario={removeBudgetScenario}
            confirmRemoveScenario={confirmRemoveBudgetScenario}
          />
        </div>
      </div>
    );
  }
});

//common components for more than one budget sub-sections
function RemoveConfirmation (props) {
  const { scenario, confirmRemoveScenario, removeScenario, goToListView } = props;
  const reset = () => confirmRemoveScenario(null);
  if (scenario == null) {
    return <div/>;
  }
  const { id, name } = scenario;
  return (
    <Modal
      title='Confirmation'
      className='confirmation-modal'
      show={true}
      text={<span>Are you sure you want to delete <b>{name}</b> (id:{id})</span>}
      onClose={reset}
      actions={[
        {
          name: 'Cancel',
          action: reset,
        },
        {
          name: 'Delete',
          action: () => { removeScenario(id); confirmRemoveScenario(null); goToListView(); },
          style: 'danger',
        },
      ]}
    />
  );
}

//mockup values for spatial clusters/groups
function mapStateToProps(state, ownProps) {
  return {
    //common
    routing: state.routing,
    clusters: state.config.utility.clusters,
    segments: SPATIAL_CLUSTERS,
    budgets: state.budget.scenarios, 
    budgetToRemoveIdx: state.budget.budgetToRemove,
    //list
    searchFilter: state.budget.searchFilter,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : {
      ...bindActionCreators({...Actions, getTimeline, getMetersLocations}, dispatch), 
      goToAddView: () => dispatch(push('/budgets/add')),
      goToExploreView: (id) => dispatch(push(`/budgets/${id}`)),
      goToListView: () => dispatch(push('/budgets')),
      goToActiveView: () => dispatch(push('/budgets/active'))   
    }
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...dispatchProps,
    ...stateProps,
    budgets: stateProps.budgets.map(scenario => ({
      ...scenario, 
      active: scenario.activatedOn != null,
      params: util.getFriendlyParams(scenario.parameters, ownProps.intl, 'long'),
      paramsShort: util.getFriendlyParams(scenario.parameters, ownProps.intl, 'short'),
     })),
    budgetToRemove: stateProps.budgets.find(scenario => scenario.id === stateProps.budgetToRemoveIdx),

  };
}

const BudgetsContainer = injectIntl(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Budgets));

BudgetsContainer.icon = 'percent';
BudgetsContainer.title = 'Section.Budget';

module.exports = BudgetsContainer;
