import React from "react";
import DataBlock from "./DataBlock";
import Map from "./Map";
import DatePicker from "react-date-picker";
import DataTable from "./DataTable";
import "./CustomDatePicker.css";

class MainContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authResponseFromServer: null,
            dataFetchedFromServer: null,
            fcntFetchedFromServer: null,
            doorState: 0,
            calendarFrom: new Date(),
            calendarUntil: new Date(),
            dataToTable: null,
            fetchForTable: false
        };
    }

    setDoorState = newDoorState => {
        if (this.state.doorState !== newDoorState)
            this.setState({ doorState: newDoorState });
    }


    webSocket = new WebSocket("wss://iot.vegahomeserver.tk");

    componentDidMount() {
        console.log("SUCCESS");
        this.webSocket.onopen = () => {
            this.sendCommand();
        }

        this.webSocket.onmessage = event => {
            const reply = JSON.parse(event.data);

            switch (reply.cmd) {
                case "auth_resp":
                    this.setState({ authResponseFromServer: reply });
                    this.fetchFromServer();
                    break;
                case "get_data_resp":
                    this.handleDataResponse(reply);
                    break;
                case "rx":
                    this.setState({ dataFetchedFromServer: reply.data });
                    this.setState({ fcntFetchedFromServer: reply.fcnt });
                    break;
                default:
            }
        }
    }

    sendCommand = () => {
        var msg = {
            cmd: "auth_req",
            login: "test",
            password: "tset"
        };

        this.webSocket.send(JSON.stringify(msg));
    }

    fetchFromServer = () => {
        const dateNow = new Date();
        let timeStamp = dateNow;

        var msg = {
            cmd: "get_data_req",
            devEui: "3939353472387004",
            select: {
                date_from: timeStamp,
                limit: 1
            }
        };

        this.setState({fetchForTable: false});
        this.webSocket.send(JSON.stringify(msg));
    }

    handleDataResponse = (reply) => {
        if (!this.state.fetchForTable) {
            this.setState({ dataFetchedFromServer: reply.data_list[0].data });
            this.setState({ fcntFetchedFromServer: reply.data_list[0].fcnt });
        } else {
            this.setState({dataToTable: reply.data_list});
        }
    }

    handleDateChangeFrom = (value) => {
        if (value === null) {
            value = new Date();
        }
        this.setState({ calendarFrom: value });
    }

    handleDateChangeUntil = (value) => {
        if (value === null) {
            value = new Date();
        }
        this.setState({ calendarUntil: value });
    }

    submitRequest = () => {
        var msg = {
            cmd: "get_data_req",
            devEui: "3939353472387004",
            select: {
                date_from: this.state.calendarFrom.getTime(),
                date_to: this.state.calendarUntil.getTime(),
                limit: 100
            }
        };
        this.setState({fetchForTable: true});

        this.webSocket.send(JSON.stringify(msg));
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-5">
                        {this.state.dataFetchedFromServer !== null ?
                            <DataBlock
                                passedData={this.state.dataFetchedFromServer}
                                passedFcnt={this.state.fcntFetchedFromServer}
                                doorStateHandler={this.setDoorState}
                            />
                            : <p>LOADING...</p>}
                    </div>
                    <div className="col-md">
                        <Map doorState={this.state.doorState} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5">
                        <div className="card bg-light">
                            <h6 class="card-header">ВЫБОРКА ПО ДАТЕ</h6>
                            <div className="card-body text-dark">
                                <div className="row">
                                    <div className="col-md-6">
                                        ОТ
                                    <DatePicker
                                            value={this.state.calendarFrom}
                                            onChange={this.handleDateChangeFrom}
                                            returnValue={"start"}
                                            showLeadingZeros={true}
                                            maxDate={new Date()}
                                            clearIcon={null}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        ДО
                                    <DatePicker
                                            value={this.state.calendarUntil}
                                            onChange={this.handleDateChangeUntil}
                                            returnValue={"end"}
                                            showLeadingZeros={true}
                                            minDate={this.state.calendarFrom}
                                            maxDate={new Date()}
                                            clearIcon={null}
                                        />
                                    </div>
                                </div>

                                <button className="btn-primary" style={{ width: "100%" }} onClick={this.submitRequest}>
                                    ПОКАЗАТЬ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {this.state.dataToTable === null ? null :
                    <DataTable passedData = {this.state.dataToTable}/>}
                </div>
            </div>
        );
    }
}

export default MainContainer;