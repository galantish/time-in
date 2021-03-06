import React from "react";
import "./AddServices.css";
import { Button, IconButton } from "material-ui";
import Services from "../components/Services";

class AddServices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      name: "",
      duration: ""
    };
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
  }
  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }
  handleDurationChange(event) {
    this.setState({ duration: event.target.value });
  }
  deleteItem(key) {
    var filteredItems = this.state.items.filter(function(item) {
      return item.key !== key;
    });

    this.setState({
      items: filteredItems
    });
  }

  addItem(e) {
    if (!this.state.name) alert("Enter service name");
    else if (!this.state.duration) alert("Enter duration");
    else {
      var newItem = {
        text: this.state.name,
        key: Date.now(),
        duration: this.state.duration
      };

      this.setState(prevState => {
        return {
          items: prevState.items.concat(newItem),
          name: "",
          duration: ""
        };
      });
    }

    console.log(this.state.items);
    e.preventDefault();
  }
  render() {
    return (
      <div className="addServices">
        <div className="header">
          <form onSubmit={this.addItem}>
            <input
              style={{ width: "250px" }}
              value={this.state.name}
              onChange={this.handleNameChange}
              placeholder="Service name"
            />
            <input
              type="number"
              style={{ width: "80px" }}
              value={this.state.duration}
              onChange={this.handleDurationChange}
              placeholder="Duration (minutes)"
            />
            <button type="submit">add</button>
          </form>
        </div>

        <Services entries={this.state.items} delete={this.deleteItem} />
      </div>
    );
  }
}

export default AddServices;
