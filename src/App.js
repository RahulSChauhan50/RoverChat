import React from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io("https://obscure-brushlands-31047.herokuapp.com/");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      data: [],
      message: "",
    };
  }

  sendMessageFunction = () => {
    if (
      this.state.name.trim().length > 0 &&
      this.state.message.trim().length > 0
    ) {
      socket.emit("input", {
        name: this.state.name.trim(),
        message: this.state.message.trim(),
      });
    } else {
      alert("Please enter Message and Name !");
    }
  };
  clearChatFunction = () => {
    socket.emit("clear");
    this.setState({ data: [], name: "", message: "" });
  };
  componentDidMount() {
    if (socket !== undefined) {
      console.log("Connected to socket...");

      // Handle Output
      socket.on("output", (e) => {
        var mdata = this.state.data.concat(e);
        this.setState({ data: mdata });
        console.log(this.state.data);
      });
    }
  }

  componentWillUnmount() {
    socket.off("output");
  }

  render() {
    return (
      <div className="App">
        <div id="content">
          <h1>RoverChat</h1>
          <div className="status"></div>
          <div id="chat">
            <br />
            <div id="messages" className="card">
              {this.state.data.map((value, key) => (
                <div key={key} id="textMessage" className="card-block">
                  {value.name + " : " + value.message}
                </div>
              ))}
            </div>
            <br />
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter Your name"
              onChange={(s) => {
                this.setState({ name: s.target.value });
              }}
            />
            <br />
            <textarea
              onChange={(e) => this.setState({ message: e.target.value })}
              id="textarea"
              className="form-control"
              placeholder="Enter message..."
            />
          </div>
          <button
            className="btn btn-success"
            onClick={() => this.sendMessageFunction()}
          >
            Send
          </button>
          <button
            id="clear"
            className="btn btn-danger"
            onClick={() => this.clearChatFunction()}
          >
            Clear Messages
          </button>
        </div>
      </div>
    );
  }
}

export default App;
