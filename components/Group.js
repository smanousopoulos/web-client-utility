var React = require('react');
var Bootstrap = require('react-bootstrap');
var {FormattedDate} = require('react-intl');
var { Link } = require('react-router');
var Table = require('./Table');

var { connect } = require('react-redux');
var { bindActionCreators } = require('redux');

var GroupActions = require('../actions/GroupActions');
var GroupTablesSchema = require('../constants/GroupTablesSchema');


var Group = React.createClass({
  contextTypes: {
      intl: React.PropTypes.object
  },

  componentWillMount : function() {
    this.props.showGroup(this.props.params.id);
  },

  componentWillUnmount : function() {
    this.props.resetComponent();
  },

  compareGroupMembers : function (a, b){
    if (a.user == null) return -1;
    return a.user.localeCompare(b.user);
  },

  membersObjectToArray: function(membersObject){
    var membersArray = [];

    for (var key in membersObject) {
      if (membersObject.hasOwnProperty(key)) {
        membersArray.push(membersObject[key]);
      }
    }

    return membersArray;
  },


  render: function() {

    var self = this;
    var _t = this.context.intl.formatMessage;

    if (!this.props.currentMembers) return null;

    var rows = this.membersObjectToArray(Object.assign({}, this.props.currentMembers)).sort(this.compareGroupMembers);

    var currentMemberFields = GroupTablesSchema.Members.fields.map(function(field){
        if(field.hasOwnProperty('name') && field.name === 'favourite'){
          const handler = function (field, row){
            if(row.favourite) {
              self.props.removeFavorite(row.key);
            } else {
              self.props.addFavorite(row.key);
            }
          };
          const icon = function (field, row) {
            return (row.favourite ? 'star' : 'star-o');
          };
          return Object.assign({}, field, {handler, icon});
        }

        return field;
      });
      
    var pager = {
      index: 0,
      size: 10,
      count: rows.length || 0,
      mode: Table.PAGING_CLIENT_SIDE
    };

      var groupTitle = null;
      if (this.props.groupInfo) {
        groupTitle = (
          <span>
            <i className='fa fa-group fa-fw'></i>
            <span style={{ paddingLeft: 4 }}>{this.props.groupInfo.name ? this.props.groupInfo.name : ''}</span>
          </span>
        );
      }

      const memberTitle = (
          <span>
            <i className='fa fa-user fa-fw'></i>
            <span style={{ paddingLeft: 4 }}>{_t({id : 'Group.Members'})}</span>
          </span>
        );

      if (this.props.groupInfo && this.props.currentMembers){
        return (

          <div className='container-fluid' style={{ paddingTop: 10 }}>
            <div className='row'>
              <div className='col-md-4'>
                <Bootstrap.Panel header={groupTitle}>
                  <Bootstrap.ListGroup fill>
                    <Bootstrap.ListGroupItem>
                      <div className='row'>
                        <table className='table table-profile'>
                          <tbody>
                            <tr>
                              <td>Name</td>
                              <td>{this.props.groupInfo.name ? this.props.groupInfo.name : ''}</td>
                            </tr>
                            <tr>
                              <td>Created on</td>
                              <td><FormattedDate value={this.props.groupInfo.createdOn ? this.props.groupInfo.createdOn : new Date()} day='numeric' month='long' year='numeric' /></td>
                            </tr>
                            <tr>
                              <td>Country</td>
                              <td>{this.props.groupInfo.country ? this.props.groupInfo.country : ''}</td>
                            </tr>
                            <tr>
                              <td>Size</td>
                              <td>{this.props.groupInfo.size ? this.props.groupInfo.size : 0}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Bootstrap.ListGroupItem>
                    <Bootstrap.ListGroupItem className='clearfix'>
                      <Link className='pull-right' to='/groups' style={{ paddingLeft : 7, paddingTop: 12 }}>Browse all groups</Link>
                    </Bootstrap.ListGroupItem>
                  </Bootstrap.ListGroup>
                </Bootstrap.Panel>
              </div>
              <div className='col-md-8'>
                <Bootstrap.Panel header={memberTitle}>
                  <Bootstrap.ListGroup fill>
                    <Bootstrap.ListGroupItem>
                      <Table 
                        data={rows}
                        fields={currentMemberFields}
                        pager={pager}
                      />
                    </Bootstrap.ListGroupItem>
                    <Bootstrap.ListGroupItem className='clearfix'>
                      <Link className='pull-right' to='/users' style={{ paddingLeft : 7, paddingTop: 12 }}>Browse all users</Link>
                    </Bootstrap.ListGroupItem>
                  </Bootstrap.ListGroup>
                </Bootstrap.Panel>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <img className='preloader' src='/assets/images/utility/preloader-counterclock.png' />
            <img className='preloader-inner' src='/assets/images/utility/preloader-clockwise.png' />
          </div>
        );
      }
  }
});

function mapStateToProps(state) {
  return {
    isLoading : state.group.isLoading,
    groupInfo : state.group.groupInfo,
    currentMembers : state.group.currentMembers,
    application : state.group.application,
    accountId : state.group.accountId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showGroup: bindActionCreators(GroupActions.showGroup, dispatch),

    resetComponent : bindActionCreators(GroupActions.resetComponent, dispatch),

    addFavorite : bindActionCreators(GroupActions.addFavorite, dispatch),
    removeFavorite : bindActionCreators(GroupActions.removeFavorite, dispatch)
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Group);


