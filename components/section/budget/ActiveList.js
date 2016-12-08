var React = require('react');
var { bindActionCreators } = require('redux');
var { connect } = require('react-redux');
var bs = require('react-bootstrap');
var { Link } = require('react-router');
var Table = require('../../Table');
var { FormattedDate } = require('react-intl');

var { activeBudgetsSchema } = require('../../../schemas/budget');
var Widget = require('../../WidgetComponent');

function Goal (props) {
  const { budget, field } = props;
  const { name, id, parameters, activatedOn } = budget;
  return (
    <div>
      <Link to={`/budgets/${id}`}><h3>{name}</h3></Link>
        <Widget {...{
          display: 'stat', 
          title: null,
          highlight: parameters.goal ? parameters.goal.label : null, 
          info: ['12M lt less than 2014', 'Max 16% | Min 2%', 'Group: Pilot A', '12300 Consumers'],
          footer: <span>Set: <FormattedDate value={activatedOn} day='numeric' month='numeric' year='numeric' /></span>,
          style: field.style,
          }} 
        />
  </div>
  );
}

//mockup
function Savings (props) {
  const { budget, field } = props;
  return (
    <div>
     <h3>&nbsp; </h3>
      <Widget {...{
        display: 'stat',
        title: null,
        highlight: '-2%',
        info: ['6M lt less than 2014', 'Max 22% | Min -10%', 'Active for 4.6 months'],
        footer: 'Updated: 16/3/2016',
        style: field.style,
      }}
    />
  </div>
  );
}

//mockup
function Affected (props) {
  const { budget, field } = props;
  return (
    <div>
       <h3>&nbsp; </h3>
         <Widget {...{
           display: 'stat',
           title: null,
           highlight: '-5%',
           info: ['300 Consumers changed to other budgets', 'Original: 10000', 'Current: 9700'],
           footer: 'Updated: 16/3/2016',
           style: field.style,
         }}
       />
   </div>
  );
}

var ActiveBudgets = React.createClass({ 
  render: function() {
    const { budgets } = this.props;

    const activeBudgetsFields = activeBudgetsSchema(this.props.actions);
    const activeBudgetsSorter = {
      defaultSort: 'activatedOn',
      defaultOrder: 'desc'
    };

    var activeBudgetsStyle = {
      row: {
        height: 200
      }
    };
    const activeBudgetsData = budgets
    .filter(b => b.active)
    .map(b => ({ 
      id: b.id,
      name: b.name,
      activatedOn: b.activatedOn,
      goal: <Goal budget={b} field={activeBudgetsFields.find(f => f.name === 'goal')} />,
      savings: <Savings budget={b} field={activeBudgetsFields.find(f => f.name === 'savings')} />,
      affected: <Affected budget={b} field={activeBudgetsFields.find(f => f.name === 'affected')} />,
    })
    ); 
    return (
      <Table
        fields={activeBudgetsFields}
        sorter={activeBudgetsSorter}
        data={activeBudgetsData} 
        template={{empty : (<span>{ 'No data found.' }</span>)}}
        style={activeBudgetsStyle}
      />
    );
  }
})

module.exports = ActiveBudgets;
