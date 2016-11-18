var React = require('react');
var { bindActionCreators } = require('redux');
var { connect } = require('react-redux');
var bs = require('react-bootstrap');
var { Link } = require('react-router');
var { push } = require('react-router-redux');
var util = require('../../../helpers/wizard');
var { injectIntl, FormattedDate } = require('react-intl');

var Table = require('../../../components/Table');
var { Widget } = require('../../WidgetComponent');
var BudgetActions = require('../../../actions/BudgetActions');
var Breadcrumb = require('../../../components/Breadcrumb');

var Budgets = React.createClass({ 
  render: function() {
    const { groups, clusters, segments, areas, savings, validationError, tableData, tableStyle, searchFilter, budgetType, children } = this.props;
    const { setErrorModal, resetErrorModal, setValidationError, switchMode, addBudgetScenario, removeBudgetScenario, toggleRemoveConfirmation, setSearchFilter, setBudgetType } = this.props.actions;
    return (
			<div className='container-fluid' style={{ paddingTop: 10 }}>
				<div className='row'>
					<div className='col-md-12'>
            <Breadcrumb routes={this.props.routes}/>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12' style={{marginTop: 10}}>
            {
              React.cloneElement(children, this.props)
            }
          </div>
        </div>
      </div>
    );
  }
});

//mockup values for spatial clusters/groups
function mapStateToProps(state) {
  return {
    routing: state.routing,
    clusters: !state.config.utility.clusters ? [] :
      state.config.utility.clusters.map(cluster => ({
        label: cluster.name,
        value: cluster.key
      })),
    groups: !state.config.utility.clusters ? [] :
      state.config.utility.clusters
      .reduce((p, c) => [...p, ...c.groups.map(
        g => ({
          value: c.name + ':' + g.name,
          cluster: g.clusterKey,
          group: g.key,
          label: c.name + ': ' + g.name
        }))], [])
        .sort((s1, s2) => (s2.label == s1.label) ? 0 : ((s2.label < s1.label) ? 1 : -1)),
     segments: [{
       value: 'area',
       label: 'Area'
     }],
     areas: [{
       value: 'kallithea',
       label: 'Kallithea',
       cluster: 'area',
     },
     {
       value: 'pangkrati',
       label: 'Pangkrati',
       cluster: 'area',
     },
     {
       value: 'lykavittos',
       label: 'Lykavittos',
       cluster: 'area',
     }],
     validationError: state.budget.validationError,
     budgetToRemoveIdx: state.budget.budgetToRemove,
     confirmSetBudgetIdx: state.budget.confirmSetBudget,
     confirmResetBudgetIdx: state.budget.confirmResetBudget,
     searchFilter: state.budget.searchFilter,
     savings: state.savings.scenarios,
     budgets: state.budget.scenarios.map(scenario => ({
       ...scenario, 
       paramsShort: util.getFriendlyParams(scenario.parameters, 'short')
        .map(x => `${x.key}: ${x.value}`).join(', '),
       paramsLong: util.getFriendlyParams(scenario.parameters, 'long')
       .map(x => `${x.key}: ${x.value}`).join(', ')
     })),
     wizardType: state.budget.wizardType,
     initialActiveIdx: state.budget.initialActiveIdx,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : {
      ...bindActionCreators(BudgetActions, dispatch),
      goToAddView: () => dispatch(push('/budgets/add')),
      goToExploreView: (id) => dispatch(push(`/budgets/${id}`)),
      goToListView: () => dispatch(push('/budgets')),
      goToActiveView: () => dispatch(push('/budgets/active'))   
    }
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  
  const filteredBudgets = stateProps.searchFilter ? stateProps.budgets.filter(s => matches(s.name, stateProps.searchFilter) || matches(s.user, stateProps.searchFilter)) : stateProps.budgets;

  //all budgets table schema
  const budgetFields = [{
      name: 'id',
      title: 'Id',
      hidden: true
    }, 
    {
      name: 'name',
      title: 'Name',
      style: {
        width: 100
      },
      link: function(row) {
        if(row.id) {
          return '/budgets/{id}/';
        }
        return null;
      },
    }, 
    {
      name: 'active',
      title: 'Active',
      type: 'action',
      style: {
        textAlign: 'center',
        fontSize: '1.2em'
      },
      icon: function(field, row) {
        return row.active ? 'check' : '';
      },
      handler: null, 
    }, 
    {
      name: 'paramsShort',
      title: 'Parameters',
    },
    {
      name: 'user',
      title: 'User',
    },
    {
      name: 'createdOn',
      title: 'Created',
      type: 'datetime',
    }, 
    {
      name: 'completedOn',
      title: 'Finished',
      type: 'datetime',
    }, 
    {
      name: 'setOn',
      title: 'Activated',
      type: 'datetime',
    },
    {
      name : 'explore',
      title: 'Explore',
      type : 'action',
      icon : 'info-circle',
      style: {
        textAlign: 'center',
        fontSize: '1.3em'
      },
      handler : (function(field, row) {
        dispatchProps.actions.goToExploreView(row.id);
      }),
      visible : (function(field, row) {
        return true;
      //  return (row.type == 'SET');
      })
    }, 
    {
      name : 'delete',
      title: 'Delete',
      type : 'action',
      icon : 'remove',
      handler : (function(field, row) {
        dispatchProps.actions.confirmRemoveBudgetScenario(row.id);
      }),
      visible : true 
    }];

    const budgetData = filteredBudgets || [];

    const active = stateProps.budgets
    .filter(b => b.active)
    .map(b => ({ 
      name: b.name,
      goal: (
        <Widget widget={{
            display: 'stat', 
            title: null,
            highlight: b.parameters.goal ? b.parameters.goal.label : null, 
            info: ['12M lt less than 2014', 'Max 16% | Min 2%', 'Group: Pilot A', '12300 Consumers'],
            footer: <span>Set: <FormattedDate value={b.setOn} day='numeric' month='numeric' year='numeric' /></span>
          }} 
        />
      ),
      savings: (
        <Widget widget={{
          display: 'stat',
          title: null,
          highlight: '-2%',
          info: ['6M lt less than 2014', 'Max 22% | Min -10%', 'Active for 4.6 months'],
          footer: 'Updated: 16/3/2016'
        }}
      />
     ),
     affected: (
       <Widget widget={{
         display: 'stat',
         title: null,
         highlight: '-5%',
         info: ['300 Consumers changed to other budgets', 'Original: 10000', 'Current: 9700'],
         footer: 'Updated: 16/3/2016'
       }}
     />
     )
    })
        
    );
    //active budgets schema
    const activeBudgetsFields = [{
        name: 'goal',
        title: 'Goal',
        type: 'node',
      },
      {
        name: 'savings',
        title: 'Savings',
        type: 'node',
      },
      {
        name: 'affected',
        title: 'Affected',
        type: 'node',
      }];

    const activeBudgetsData = active || [];
    
    var activeBudgetsStyle = {
      row : {
        height: 140
      }
    };
    return {
      ...ownProps,
      ...dispatchProps,
      ...stateProps,
      filteredBudgets,
      budgetFields,
      budgetData,
      activeBudgetsFields,
      activeBudgetsData,
      activeBudgetsStyle,
      budgetToRemove: stateProps.budgets.find(scenario => scenario.id === stateProps.budgetToRemoveIdx),
      budgetToSet: stateProps.budgets.find(scenario => scenario.id === stateProps.confirmSetBudgetIdx),
      budgetToReset: stateProps.budgets.find(scenario => scenario.id === stateProps.confirmResetBudgetIdx),
      //exploreScenario: stateProps.scenarios.find(scenario => scenario.id === stateProps.exploreId)
    };
}
function matches(str1, str2) {
  return str1.toLowerCase().indexOf(str2.toLowerCase()) != -1;
}

Budgets.icon = 'percent';
Budgets.title = 'Section.Budget';

const BudgetContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Budgets);
module.exports = injectIntl(BudgetContainer);