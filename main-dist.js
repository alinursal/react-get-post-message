"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//@prepros-prepend main.js

var MessageForm = function (_React$Component) {
  _inherits(MessageForm, _React$Component);

  function MessageForm(props) {
    _classCallCheck(this, MessageForm);

    // type options are an object; convert to an array and map
    var _this = _possibleConstructorReturn(this, (MessageForm.__proto__ || Object.getPrototypeOf(MessageForm)).call(this, props));

    _this.typeOptions = Object.keys(props.messageTypes).map(function (key) {
      if (props.messageTypes.hasOwnProperty(key)) {
        return React.createElement(
          "option",
          { key: key, value: key },
          props.messageTypes[key]
        );
      }
    });

    {/* so we don't have to type this over and over */}
    _this.defaultType = _this.typeOptions[0].key;

    // to hold the data from form submission
    _this.state = {
      messageText: "",
      messageType: _this.defaultType
    };

    _this.handleTextChange = _this.handleTextChange.bind(_this);
    _this.handleTypeChange = _this.handleTypeChange.bind(_this);
    _this.postMessages = _this.postMessages.bind(_this);

    return _this;
  }

  // that refers to the value of this text area


  _createClass(MessageForm, [{
    key: "handleTextChange",
    value: function handleTextChange(evt) {
      this.setState({
        messageText: evt.target.value
      });
    }
  }, {
    key: "handleTypeChange",
    value: function handleTypeChange(evt) {
      this.setState({
        messageType: evt.target.value
      });
    }
  }, {
    key: "postMessages",
    value: function postMessages(evt) {

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
      axios.post(this.props.apiUrl + "/post.php", newStatus).then(function (response) {
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
      }.bind(this));
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "form",
        { onSubmit: this.postMessages },
        React.createElement(
          "h3",
          null,
          "Post a Data"
        ),
        React.createElement(
          "div",
          { className: "field-group" },
          React.createElement(
            "label",
            { htmlFor: "txt-message" },
            "Message"
          ),
          React.createElement("textarea", { id: "txt-message", rows: "2", onChange: this.handleTextChange, value: this.state.messageText, required: true })
        ),
        React.createElement(
          "div",
          { className: "field-group" },
          React.createElement(
            "label",
            { htmlFor: "txt-type" },
            "Type"
          ),
          React.createElement(
            "select",
            { id: "txt-type", onChange: this.handleTypeChange, value: this.state.messageType },
            this.typeOptions
          )
        ),
        React.createElement(
          "div",
          { className: "field-group action" },
          React.createElement("input", { type: "submit", "class": "btnSend", value: "Post Data" })
        )
      );
    }
  }]);

  return MessageForm;
}(React.Component);

function FeaturesMessage(props) {
  var messageDate = date.parse(props.time, "YYYY-MM-DD, HH:mm"),
      dateFormat = "M/D/Y, h:mm A";

  return React.createElement(
    "div",
    { className: "status-message" },
    props.message,
    React.createElement(
      "span",
      { className: "name" },
      "\u2014\xA0",
      props.type
    ),
    React.createElement(
      "span",
      { className: "time" },
      date.format(messageDate, dateFormat)
    )
  );
}

var ShowMessageList = function (_React$Component2) {
  _inherits(ShowMessageList, _React$Component2);

  function ShowMessageList(props) {
    _classCallCheck(this, ShowMessageList);

    return _possibleConstructorReturn(this, (ShowMessageList.__proto__ || Object.getPrototypeOf(ShowMessageList)).call(this, props));

    // remove all state and any need for life cycle methods from this component so, we could just convert it into a function
  }

  // fire data after my component is rendered 


  _createClass(ShowMessageList, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
    //this.retrieveMessages();


    // After we get messages from database, display them on the page
    // I'm pulling up the label of the type by looking into the message types props, and pulling that out based on the key, which is what's stored in the database,  instead of the full name of the message type and I'm using bind this to make sure that this, inside this callback function, refers to the same thing as outside and then finally, let's look at the status message component This is a function component Very short

  }, {
    key: "displayMessages",
    value: function displayMessages() {
      return this.props.messages.map(function (status) {
        return React.createElement(
          "li",
          { key: status.id },
          React.createElement(FeaturesMessage, {
            message: status.message,
            type: this.props.messageTypes[status.type],
            time: status.time
          })
        );
      }.bind(this));
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.isLoaded) {
        return React.createElement(
          "ul",
          { id: "message-list" },
          this.displayMessages()
        );
      } else {
        return React.createElement(
          "div",
          { id: "message-list", className: "loading" },
          "Loading...",
          React.createElement(
            "div",
            { className: "spinner" },
            React.createElement("div", { className: "bounce1" }),
            React.createElement("div", { className: "bounce2" }),
            React.createElement("div", { className: "bounce3" })
          )
        );
      }
    }
  }]);

  return ShowMessageList;
}(React.Component);

var MessageManager = function (_React$Component3) {
  _inherits(MessageManager, _React$Component3);

  function MessageManager(props) {
    _classCallCheck(this, MessageManager);

    // just a property, doesn't have to be state
    var _this3 = _possibleConstructorReturn(this, (MessageManager.__proto__ || Object.getPrototypeOf(MessageManager)).call(this, props));

    _this3.messageTypes = {
      feedback: "Feedback",
      advice: "Advice",
      tutorial: "Tutorial"
    };

    _this3.apiUrl = "https://alinursal.com/react-get-post-message/database-api";

    // save my message array in state
    _this3.state = {
      messages: [],
      isLoaded: false
    };

    _this3.addMessage = _this3.addMessage.bind(_this3);

    return _this3;
  }

  // fire data after my component is rendered 


  _createClass(MessageManager, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.retrieveMessages();
    }

    // Get data from database with using axios

  }, {
    key: "retrieveMessages",
    value: function retrieveMessages() {
      axios.get(this.apiUrl + "/get.php").then(function (response) {
        this.setState({
          messages: response.data,
          isLoaded: true
        });
      }.bind(this));
    }

    // Accept a status object which'll be built by the MessageForm

  }, {
    key: "addMessage",
    value: function addMessage(status) {
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

  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          "div",
          { id: "post-message" },
          React.createElement(MessageForm, { messageTypes: this.messageTypes, apiUrl: this.apiUrl, addMessage: this.addMessage })
        ),
        React.createElement(ShowMessageList, { messageTypes: this.messageTypes, messages: this.state.messages, isLoaded: this.state.isLoaded })
      );
    }
  }]);

  return MessageManager;
}(React.Component);

ReactDOM.render(React.createElement(MessageManager, null), document.getElementById("react-message"));
//# sourceMappingURL=main-dist.js.map