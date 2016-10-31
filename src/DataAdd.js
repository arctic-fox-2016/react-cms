var React = require('react');
var ReactDOM = require('react-dom');

var Panel = require('react-bootstrap/lib/Panel');
var Input = require('react-bootstrap/lib/Input');
var ButtonInput = require('react-bootstrap/lib/ButtonInput');

var DataAdd = React.createClass({
  render: function() {
    //console.log("Rendering DataAdd");
    return (
      <Panel header="Add Data">
        <form name="dataAdd">
          <Input type="text" name="letter" label="Letter" />
          <Input type="text" name="frequency" label="Frequency" />
          <ButtonInput value="Add" bsStyle="primary" onClick={this.handleSubmit} />
        </form>
      </Panel>
    )
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var form = document.forms.dataAdd;
    this.props.addData({letter: form.letter.value, frequency: form.frequency.value});
    // clear the form for the next input
    form.owner.value = ""; form.title.value = "";
  }
});

module.exports = DataAdd;
