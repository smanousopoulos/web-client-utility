var React = require('react');

function DisplayParams (props) {
  const { params, style, limit, show, showAll } = props;
  return (
    <div style={style}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {
        params.map((param, idx) => (
          <li key={idx}>
            <DisplayParamLine show={show} showAll={showAll} limit={limit} param={{key: param.key, value: toArray(param.value)}} />
          </li>
          ))
        }
      </ul>
    </div>
  );
}

var DisplayParamLine = React.createClass({
  getDefaultProps: function() {
    return {
      limit: 10,
      show: 5
    };
  },
  getInitialState: function() {
    return {
      hasMore: this.props.param.value.length > this.props.limit ? true : false,
      showMore: this.props.param.value.length > this.props.limit && this.props.showAll ? true : false,
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.param && Array.isArray(nextProps.param.value)) {
       if (nextProps.param.value.length > this.props.limit) {
        this.setState({ hasMore: true });
       }
       else if (nextProps.param.value.length <= this.props.limit) {
        this.setState({ hasMore: false });
      }
    }
  },
  render: function() {
    const { key, value } = this.props.param;
    const { hasMore, showMore } = this.state;
    const showFront = Math.ceil(this.props.show / 2);
    const showBack = this.props.show - showFront;
    return (
      <div>
        {
          key ? 
          <b>{key}: </b>
            :
            <span />
            }
          {
            hasMore ? 
              (
                showMore ?
                  <span>
                    { value.map((v, i, arr) => i == arr.length -1 ? <span key={i}>{v} </span> : <span>{v}, </span>) }
                    <a href='#' onClick={e => { e.preventDefault(); this.setState({ showMore: false })}}><i>Show less</i></a>
                  </span>
                  :
                 <span>
                   {
                   value.map((v, i, arr) => {
                    if (i < showFront) return <span>{v}, </span>;
                    else if (i == showFront) return <span>... , </span>;
                    else if (i >= arr.length - showBack && i < arr.length -1) return <span>{v}, </span>;
                    else if (i == arr.length -1) return <span>{v} </span>;
                  })
                   }
                   <a href='#' onClick={e => { e.preventDefault(); this.setState({ showMore: true })}}><i>Show more</i></a>
                 </span>
                 )
            :
            value.map((v, i, arr) => (
              i == arr.length - 1 ? 
                <span>{v}</span>
                :
                <span>{v}, </span>
              ))
          }
      </div>
    );
  }
});

function toArray (value) {
  if (!Array.isArray(value)) {
    return [value];
  }
  return value;
}

module.exports = DisplayParams;