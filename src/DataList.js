var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var Link = require('react-router').Link;
var ButtonInput = require('react-bootstrap/lib/ButtonInput');

var DataFilter = require('./DataFilter');
var DataAdd = require('./DataAdd');

var DataRow = React.createClass({
  render: function() {
    //console.log("Rendering DataRow:", this.props.data);

    console.log("Ini data",this.props.data);
    return (
      <tr>
        <td>
          <Link to={'/datas/' + this.props.data._id}>{this.props.data._id}</Link>
            <ButtonInput value="Delete" bsStyle="primary" onClick={this.deleteData} />
          
        </td>
        <td>{this.props.data.letter}</td>
        <td>{this.props.data.frequency}</td>

      </tr>
    )
  }


});

var DataTable = React.createClass({
  render: function() {
    //console.log("Rendering data table, num items:", this.props.datas.length);
    var dataRows = this.props.datas.map(function(data) {
      return <DataRow key={data._id} data={data} />
    });
    return (
      <table className="table table-striped table-bordered table-condensed">
        <thead>
          <tr>
            <th>Id</th>
            <th>Letter</th>
            <th>Frequency</th>
          </tr>
        </thead>
        <tbody>
          {dataRows}
        </tbody>
      </table>
    )
  }
});

var DataList = React.createClass({
  getInitialState: function() {
    return {datas: []};
  },
  render: function() {
    console.log("Rendering DataList, num items:", this.state.datas.length);
    return (
      <div>
        <h1>Data </h1>
      \  <DataTable datas={this.state.datas}/>
        <DataAdd addData={this.addData} />
      </div>
    )
  },

  componentDidMount: function() {
    console.log("DataList: componentDidMount");
    this.loadData();
  },

  componentDidUpdate: function(prevProps) {
    var oldQuery = prevProps.location.query;
    var newQuery = this.props.location.query;
    if (oldQuery.priority === newQuery.priority &&
        oldQuery.status === newQuery.status) {
      console.log("DataList: componentDidUpdate, no change in filter, not updating");
      return;
    } else {
      console.log("DataList: componentDidUpdate, loading data with new filter");
      this.loadData();
    }
  },

  loadData: function() {
    var query = this.props.location.query || {};
    var filter = {priority: query.priority, status: query.status};

    $.ajax('/api/datas', {data: filter}).done(function(data) {
      this.setState({datas: data});
    }.bind(this));
    // In production, we'd also handle errors.
  },

  changeFilter: function(newFilter) {
    this.props.history.push({search: '?' + $.param(newFilter)});
  },

  addData: function(data) {
    console.log("Adding data:", data);
    $.ajax({
      type: 'POST', url: '/api/datas', contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(data) {
        var data = data;
        // We're advised not to modify the state, it's immutable. So, make a copy.
        var datasModified = this.state.datas.concat(data);
        this.setState({datas: datasModified});
      }.bind(this),
      error: function(xhr, status, err) {
        // ideally, show error to user.
        console.log("Error adding data:", err);
      }
    });
  }


  //
  // function deleteitem(req, res) {
  //     Destinations.remove({
  //         _id: req.params.id
  //     }, (err, destinations) => {
  //         res.json({
  //             "messages": "File deleted"
  //         })
  //     })
  // }


});

module.exports = DataList;
