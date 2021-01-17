import React from "react";
import {Parser} from "binary-parser";

class DataBlock extends React.Component {

    parser = new Parser()
      .uint8("type")
      .uint8("battery")
      .uint32le("date_timestamp")
      .int16le("temperature")
      .uint8("humidity")
      .uint8("sensor1_state")
      .uint8("sensor2_state")
      .uint8("angle")
      .int8("low_humidity")
      .int8("high_humidity")
      .int8("low_temperature")
      .int8("high_temperature");

    formatDate = (passedDate) => {
        let month = passedDate.getMonth() + 1;
        let day = passedDate.getDate();
        let year = passedDate.getFullYear();
        let hours = passedDate.getHours();
        let minutes = passedDate.getMinutes();

        return `${(day > 9 ? '' : '0') + day} ${(month > 9 ? '' : '0') + month} ${year} ${(hours > 9 ? '' : '0') + hours}:${(minutes > 9 ? '' : '0') + minutes}`;
      }
      
      formatMessage = (packageType) => {
        switch(packageType) {
            case 1:
                return "ТЕКУЩЕЕ СОСТОЯНИЕ УСТРОЙСТВА";
            case 2:
                return "ПО ДАТЧИКУ ОТКРЫТИЯ 1";
            case 3:
                return "ПО ДАТЧИКУ ОТКРЫТИЯ 2";
            case 4:
                return "ПО АКСЕЛЕРОМЕТРУ";
            case 5:
                return "ПО ВЫХОДУ ВЛАЖНОСТИ ЗА ПОРОГ";
            case 6:
                return "ПО ВЫХОДУ ТЕМПЕРАТУРЫ ЗА ПОРОГ";
            default:
                return "НЕДОСТУПНО";
        }
      } 

    render() {
        let dataToRender = this.props.passedData;
        const buffer = Buffer.from(dataToRender, "hex");
        dataToRender = this.parser.parse(buffer);
        const date = new Date(dataToRender.date_timestamp * 1000);
        const modifiedDate = this.formatDate(date);
        const fcnt = this.props.passedFcnt;
        const doorState = dataToRender.sensor2_state;

        this.props.doorStateHandler(doorState);

        return(
            <div className = "card bg-light" style = {{height: "300px"}}>
                <h6 class="card-header">ИНФОРМАЦИЯ С УСТРОЙСТВА</h6>
                <div className = "card-body text-dark">
                    ТИП СООБЩЕНИЯ: {this.formatMessage(dataToRender.type)} <br/>
                    ЗАРЯД БАТАРЕИ: {dataToRender.battery} % <br/>
                    ВРЕМЯ: {modifiedDate} <br/>
                    ТЕМПЕРАТУРА: {dataToRender.temperature / 10} <br/>
                    ВЛАЖНОСТЬ: {dataToRender.humidity} <br/>
                    СОСТОЯНИЕ ДВЕРИ: {doorState === 0 ? "ОТКРЫТО" : "ЗАКРЫТО"} <br/>
                    УГОЛ ОТКЛОНЕНИЯ: {dataToRender.angle} <br/>
                    FCNT: {fcnt}
                </div>
            </div>
        );
    }
}

export default DataBlock;