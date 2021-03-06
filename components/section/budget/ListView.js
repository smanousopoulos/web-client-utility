var React = require('react');
var bs = require('react-bootstrap');
var Table = require('../../Table');
var { budgetSchema } = require('../../../schemas/budget'); 

function BudgetsList (props) {
  const { groups, clusters, segments, areas, budgets, actions, budgetToRemove, searchFilter, intl } = props;
  const { removeBudgetScenario, confirmRemoveBudgetScenario, setSearchFilter, goToAddView, goToActiveView } = actions;
  const budgetFields = budgetSchema(actions);
  const budgetSorter = {
    defaultSort: 'completedOn',
    defaultOrder: 'desc'
  };
  const budgetData  = searchFilter ? budgets.filter(s => matches(s.name, searchFilter) || matches(s.user, searchFilter)) : ( Array.isArray(budgets) ? budgets : [])
  .map(budget => ({ ...budget, paramsShort: budget.paramsShort.map(x => <span>{x.key} (<b style={{ whiteSpace: 'nowrap' }}>{x.value}</b>) &nbsp;</span>)}));

  const _t = x => intl.formatMessage({ id: x });

  return (
    <bs.Panel header={<h3>{_t('Budgets.List.title')}</h3>}>
      <bs.Row>
        <bs.Col sm={4} md={5}>
          <bs.Input 
            style={{width: '80%', float: 'left'}}
            type='text'
            placeholder={_t('Budgets.List.search')}
            onChange={(e) => setSearchFilter(e.target.value)}
            value={searchFilter}
          />
       </bs.Col>
        <bs.Col sm={8} md={7} style={{textAlign: 'right'}}>
         <bs.Button 
           bsStyle='primary' 
           style={{ marginRight: 20 }}
           onClick={() => { goToActiveView(); }}
           ><i className='fa fa-eye'></i> Monitor active
         </bs.Button>

         <bs.Button 
           bsStyle='success' 
           onClick={() => { goToAddView(); }}
           ><i className='fa fa-plus'></i> Add New
         </bs.Button>
       </bs.Col>
     </bs.Row>
        <hr/>
        <Table  
          sortable
          fields={budgetFields}
          sorter={budgetSorter}
          data={budgetData} 
          template={{empty : (<span>{ _t('Budgets.List.empty') }</span>)}}
        />
    </bs.Panel>
  );
}


function matches(str1, str2) {
  return str1.toLowerCase().indexOf(str2.toLowerCase()) != -1;
}

module.exports = BudgetsList;
