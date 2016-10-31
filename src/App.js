var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Redirect = require('react-router').Redirect;

var dataList = require('./DataList');
var dataEdit = require('./DataEdit');

var NoMatch = React.createClass({
  render: function() {
    return (
      <h2>No match for the route</h2>
    );
  }
});

ReactDOM.render(
  (
    <Router>
      <Route path="/datas" component={dataList} />
      <Route path="/datas/:id" component={dataEdit} />
      <Redirect from="/" to="/datas" />
      <Route path="*" component={NoMatch} />
    </Router>
  ),
  document.getElementById('main')
);
