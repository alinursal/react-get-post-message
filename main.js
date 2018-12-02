//@prepros-prepend main.js

class MessageForm extends React.Component {
  constructor(props) {
    super(props);

    // type options are an object; convert to an array and map
    this.typeOptions = Object.keys(props.messageTypes).map(function(key) {
      if (props.messageTypes.hasOwnProperty(key)) {
        return (
          <option key={key} value={key}>
            {props.messageTypes[key]}
          </option>
        );
      }
    });

    {/* so we don't have to type this over and over */}
    this.defaultType = this.typeOptions[0].key;

    // to hold the data from form submission
    this.state = {
      messageText: "",
      messageType: this.defaultType
    }

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.postMessages = this.postMessages.bind(this);

  }

  // that refers to the value of this text area
  handleTextChange(evt) {
    this.setState({
      messageText: evt.target.value
    });
  }

  handleTypeChange(evt) {
    this.setState({
      messageType: evt.target.value
    });
  }

  postMessages(evt) {

    // to prevent form really submit
    evt.preventDefault();

    // a new status object that API is expecting
    var newStatus = {
      message: this.state.messageText,
      type: this.state.messageType,
      // use a time date library that database expects
      time: date.format(new Date(), "YYYY-MM-DD, HH:mm")
    };

    // post the data up to the database with using axios
    // pass in new status as the data that goes with it
    axios.post(this.props.apiUrl + "/post.php", newStatus).then(
      function(response) {
        console.log(response);

    if (response.data.success) {

        //post a new update after posting the old one
        this.setState({
            messageText: "",
            messageType: this.defaultType
        });
    }

    //all the messages that are retrieved from the database have their ID assigned
    newStatus.id = response.data.id;

    // call new addMessage function
    this.props.addMessage(newStatus);

      }.bind(this)
    );
  }

  render() {
    return (
      <form onSubmit={this.postMessages}>
        <h3>Post a Data</h3>

        <div className="field-group">
          <label htmlFor="txt-message">Message</label>
          <textarea id="txt-message" rows="2" onChange={this.handleTextChange} value={this.state.messageText} required/>
        </div>

        <div className="field-group">
          <label htmlFor="txt-type">Type</label>
          <select id="txt-type" onChange={this.handleTypeChange} value={this.state.messageType}>{this.typeOptions}</select>
        </div>

        <div className="field-group action">
          <input type="submit" class="btnSend" value="Post Data" />
        </div>
      </form>
    );
  }
}

function FeaturesMessage(props) {
  var messageDate = date.parse(props.time, "YYYY-MM-DD, HH:mm"),
  dateFormat = "M/D/Y, h:mm A";

  return (
    <div className="status-message">
      {props.message}
      <span className="name">— {props.type}</span>
      <span className="time">{date.format(messageDate, dateFormat)}</span>
    </div>
  );
}

class ShowMessageList extends React.Component {
  constructor(props) {
    super(props);

  // remove all state and any need for life cycle methods from this component so, we could just convert it into a function
  }


  // fire data after my component is rendered 
  componentDidMount() {
    //this.retrieveMessages();
  }

  // After we get messages from database, display them on the page
  // I'm pulling up the label of the type by looking into the message types props, and pulling that out based on the key, which is what's stored in the database,  instead of the full name of the message type and I'm using bind this to make sure that this, inside this callback function, refers to the same thing as outside and then finally, let's look at the status message component This is a function component Very short

  displayMessages() {
    return this.props.messages.map(
      function(status) {
        return (
          <li key={status.id}>
            <FeaturesMessage
              message={status.message}
              type={this.props.messageTypes[status.type]}
              time={status.time}
            />
          </li>
        );
      }.bind(this)
    );
  }

  render() {
    if (this.props.isLoaded) {
      return <ul id="message-list">{this.displayMessages()}</ul>;
    }else {
      return (
        <div id="message-list" className="loading">
          Loading...
          <div className="spinner">
            <div className="bounce1" />
            <div className="bounce2" />
            <div className="bounce3" />
          </div>
        </div>
      );
    }
  }
}

class MessageManager extends React.Component {
  constructor(props) {
    super(props);

    // just a property, doesn't have to be state
    this.messageTypes = {
      feedback: "Feedback",
      advice: "Advice",
      tutorial: "Tutorial"
    };

    this.apiUrl = "https://alinursal.com/react-get-post-message/database-api";

    // save my message array in state
    this.state = {
      messages: [],
      isLoaded: false
    };

    this.addMessage= this.addMessage.bind(this);

  }

  // fire data after my component is rendered 
  componentDidMount() {
    this.retrieveMessages();
  }

  // Get data from database with using axios
  retrieveMessages() {
    axios.get(this.apiUrl+"/get.php").then(
      function(response) {
        this.setState({
          messages: response.data,
          isLoaded: true
        });
      }.bind(this)
    );
  }

  // Accept a status object which'll be built by the MessageForm
  addMessage(status) {
    var updatedStatuses = this.state.messages.slice(0);

    // push a new status update into the array
    updatedStatuses.push(status);

    // reset the state
    this.setState({
      messages: updatedStatuses
    });
  }

    // make the call to the API with apiURL
    // they are now part of the manager into these two components so we added messages and isLoaded
  render() {
    return (
      <React.Fragment>
        <div id="post-message">
          <MessageForm messageTypes={this.messageTypes} apiUrl={this.apiUrl} addMessage={this.addMessage}/>
        </div>
        <ShowMessageList messageTypes={this.messageTypes} messages={this.state.messages} isLoaded={this.state.isLoaded}/>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<MessageManager />, document.getElementById("react-message"));