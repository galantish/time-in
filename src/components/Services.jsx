import React, { Component } from "react";
import FlipMove from "react-flip-move";
import { Button, IconButton, List, ListItem } from "material-ui";
import { Delete } from "material-ui-icons";
import { TextField } from "../../node_modules/material-ui";

class Services extends Component {
  constructor(props) {
    super(props);
  }

  delete(key) {
    this.props.delete(key);
  }

  render() {
    return (
      <List>
        {this.props.entries.map(item => this.renderServiceItem(item))}
      </List>
    );
  }
  renderServiceItem(item) {
    return (
      <ListItem key={item.key}>
        <p style={{fontSize: '18px', margin: '0 20px 0 0'}}>{item.text}</p>
        <p style={{fontSize: '18px', margin: '0 20px 0 0'}}>{item.duration} minutes</p>
        <IconButton onClick={() => this.delete(item.key)}>
          <Delete />
        </IconButton>
      </ListItem>
    );
  }
}

export default Services;
