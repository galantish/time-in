import React, { Component } from 'react';
import './SchedulePage.css';

import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

import fetch from 'cross-fetch'
import Moment from 'moment'

import GoogleClientCalender from '../components/GoogleClientCalender'
import AvailableList from '../components/AvailableList'
import { saveToCalendar } from '../components/saveToGoogle'

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SchedulePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      service: 'trx',
      from: Moment().format("YYYY-MM-DDTHH:mm"),
      showResult: false,
      results: [],
      userBusy: [],
      showProccessing: false,
      hasError: false,
      showDialog: false,
      selectedTime: { start: '', end: '' },
      businessName: props.businessName,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handlePickTime = this.handlePickTime.bind(this);
  }

  handleOpen = () => {
    this.setState({ showDialog: true });
  };

  handleClose = () => {
    this.setState({ showDialog: false });
  };

  handleChange = event => {
    let timeRequested = undefined
    if (event.target.name === "service") {
      switch (event.target.value) {
        case "trx":
          timeRequested = 45
          break;
        case "pilates":
          timeRequested = 60
          break;
        case "strenght":
          timeRequested = 60
          break;
        case "hit":
          timeRequested = 45
          break;
        case "cardio":
          timeRequested = 50
          break;
        case "crossFit":
          timeRequested = 80
          break;
        case "yoga":
          timeRequested = 75
          break;

      }
    }

    this.setState({ [event.target.name]: event.target.value, showResult: false, hasError: false, timeRequested });

  };

  handleSaveToCalendar() {
    const title = `Appointment to ${this.state.service} @ ${this.state.businessName}`,
      content = "Please notice if you are late",
      range = this.state.selectedTime,
      calendarId = 'primary';
    
    // Get business eMail
    const options = {
      method: "GET",
    }

    fetch(`http://localhost:8080/Businesses/${this.state.businessName}`, options).then(response => {
      response.json().then(data => {
        saveToCalendar(title, content, range, calendarId, data.businesses[0].googleUser);
        this.handleClose();
      })
    }).catch(err => {
      alert('error in fetching business email')
      this.handleClose();
    })
  }

  handleClick = (list) => {
    this.setState({ userBusy: list })
    this.getFreeTimes(list);
  };

  handlePickTime(e, value) {
    this.setState({ selectedTime: value })
    this.handleOpen()
  }

  getFreeTimes(userBusy) {
    this.setState({ showProccessing: true, showResult: false, hasError: false })

    const gapInMinutes = 10;
    const startingAt = this.state.from;
    const timeRequested = this.state.timeRequested;

    const options = {
      method: "POST",
      body: JSON.stringify({ userBusy, startingAt, gapInMinutes, timeRequested }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    fetch("http://localhost:8080/", options).then(response => {
      response.json().then(data => {
        this.setState({ results: data, showResult: true, showProccessing: false, hasError: false })
      })
    }).catch(err => {
      this.setState({ showProccessing: false, hasError: true });
    })
  }


  render() {

    var pic = "pics/TRX.png";

    switch (this.state.service) {
      case 'trx':
        pic = "pics/TRX.png";
        break;
      case 'pilates':
        pic = "pics/pilates.png";
        break;
      case 'strength':
        pic = "pics/strength.png";
        break;
      case 'hit':
        pic = "pics/HIT.png";
        break;
      case 'cardio':
        pic = "pics/cardio.png";
        break;
      case 'crossFit':
        pic = "pics/cross-fit.png";
        break;
      case 'yoga':
        pic = "pics/yoga.png";
        break;
    }

    return (
      <div>
        <form class="search_area" autoComplete="off">
          <FormControl className="control">
            <InputLabel htmlFor="service-simple">Select Service</InputLabel>
            <Select
              value={this.state.service}
              onChange={this.handleChange}
              inputProps={{
                name: 'service',
                id: 'service-combo',
              }}
              Width="100px">
              <MenuItem value="trx" default>TRX</MenuItem>
              <MenuItem value="pilates">Pilates</MenuItem>
              <MenuItem value="strength">Strength</MenuItem>
              <MenuItem value="hit">HIT</MenuItem>
              <MenuItem value="cardio">Cardio</MenuItem>
              <MenuItem value="crossFit">Cross-Fit</MenuItem>
              <MenuItem value="yoga">Yoga</MenuItem>

            </Select>
          </FormControl>
          <TextField
            id="from-when"
            name="from"
            label="As of"
            type="datetime-local"
            onChange={this.handleChange}
            defaultValue={this.state.from}
            className="control"
            InputLabelProps={{
              shrink: true,

            }}
          />
          <br /><br />
          { /* מחביא פה את הלחצן find */}
          <GoogleClientCalender onClick={this.handleClick} getUserName={this.props.getUserName} />
          <br /><br />

          {
            this.state.hasError && "Error occurred :("
          }
          {
            this.state.showProccessing && "Just a moment please..."
          }
          {
            this.state.showResult &&
            this.state.results &&
            (
              this.state.results.length > 0 ?
                <AvailableList className="available-list" list={this.state.results} pic={pic} onClick={this.handlePickTime} /> :
                "No results available"
            )
          }
        </form>

        {
          <Dialog
            open={this.state.showDialog}
            transition={Transition}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description">
            <DialogTitle id="alert-dialog-slide-title">
              Just to be sure..
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Do you want to set up appointment to {Moment(this.state.selectedTime.start).format("YYYY-MM-DD HH:mm ")}
                until {Moment(this.state.selectedTime.end).format("YYYY-MM-DD HH:mm ")}
                for {this.state.service} At {this.state.businessName}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleSaveToCalendar.bind(this)} color="primary">
                Save to Calendar
              </Button>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        }
      </div>
    );
  }
}

export default SchedulePage;