var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var Link = require('react-router').Link;

var Panel = require('react-bootstrap/lib/Panel');
var Input = require('react-bootstrap/lib/Input');
var Button  = require('react-bootstrap/lib/Button');
var ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
var Alert = require('react-bootstrap/lib/Alert');

var DataEdit = React.createClass({
  render: function() {
    var success = (
      <Alert bsStyle="success" onDismiss={this.dismissSuccess} dismissAfter={5000}>
        Data saved to DB successfully.
      </Alert>
    );
    return (
      <div style={{maxWidth: 600}}>
        <Panel header={"Edit data: " + this.props.params.id}>
          <form onSubmit={this.submit}>

            <Input type="text" label="Letter" value={this.state.letter} onChange={this.onChangeLetter}/>
            <Input type="text" label="Frequency" value={this.state.frequency} onChange={this.onChangeFrequency}/>
            <ButtonToolbar>
              <Button type="submit" bsStyle="primary">Submit</Button>
              <button type="button" onClick={this.deleteData} className="btn btn-danger" bsStyle="primary">Delete</button>
              <Link className="btn btn-link" to="/datas">Back</Link>
            </ButtonToolbar>
          </form>
        </Panel>
        {this.state.successVisible ? success : null}
      </div>
    );
  },
  deleteData: function(data) {
    console.log("Deleting data:", data);
    $.ajax({
      type: 'DELETE', url: '/api/datas'+this.props.params.id, contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(data) {
        var data = data;
        // We're advised not to modify the state, it's immutable. So, make a copy.
        var datasModified = this.state.datas.concat(data);
        this.setState({datas: datasModified});
      }.bind(this),
      error: function(xhr, status, err) {
        // ideally, show error to user.
        console.log("Error deleting data:", err);
      }
    });
  },

  getInitialState: function() {
    return {successVisible: false};
  },

  componentDidMount: function() {
    this.loadData();
  },

  componentDidUpdate: function(prevProps) {
    console.log("DataEdit: componentDidUpdate", prevProps.params.id, this.props.params.id);
    if (this.props.params.id != prevProps.params.id) {
      this.loadData();
    }
  },
  loadData: function() {
    $.ajax('/api/datas/' + this.props.params.id) .done(function(data) {
      this.setState(data);
    }.bind(this));
  },
  onChangeLetter: function(e) {
    this.setState({letter: e.target.value});
  },
  onChangeFrequency: function(e) {
    this.setState({frequency: e.target.value});
  },
  showSuccess: function() {
    this.setState({successVisible: true});
  },
  dismissSuccess: function() {
    this.setState({successVisible: false});
  },

  submit: function(e) {
    e.preventDefault();
    var data = {
      letter: this.state.letter,
      frequency: this.state.frequency
    }

    $.ajax({
      url: '/api/datas/' + this.props.params.id, type: 'PUT', contentType:'application/json',
      data: JSON.stringify(data),
      dataType: 'json',
      success: function(data) {
        this.setState(data);
        this.showSuccess();
      }.bind(this),
    });
  }
});

module.exports = DataEdit;
