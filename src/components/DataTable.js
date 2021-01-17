import React from "react";
import * as ExcelSaver from "file-saver";
import * as XLSX from "xlsx";

class DataTable extends React.Component {
    FILE_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    FILE_EXT = ".xlsx";

    handleDates = (array) => {
        return array.map(item => {
            const obj = Object.assign({}, item);
            obj["ts"] = new Date(obj["ts"]).toISOString().replace(/T/, ' ').replace(/\..+/, '');
            return obj;
        });
    }

    export = (dataArray, fileName) => {
        const transformedData = this.handleDates(dataArray);
        const workSheet = XLSX.utils.json_to_sheet(transformedData);
        const workBook = { Sheets: { 'data': workSheet }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: this.FILE_TYPE });

        ExcelSaver.saveAs(data, fileName + this.FILE_EXT);
    }

    render() {
        const items = this.props.passedData;
        const itemsList = items.map((item, index) =>
            <tr key={index}>
                <td>{new Date(item.ts).toISOString().replace(/T/, ' ').replace(/\..+/, '')}</td>
                <td>{item.type}</td>
                <td>{item.data}</td>
                <td>{item.ack}</td>
                <td>{item.dr}</td>
                <td>{item.freq}</td>
                <td>{item.gatewayId}</td>
                <td>{item.port}</td>
                <td>{item.rssi}</td>
                <td>{item.snr}</td>
                <td>{item.fcnt}</td>
            </tr>
        );
        console.log(itemsList);
        return (
            <div className="col-md-12">
                <button className="btn-primary" onClick={() => { this.export(items, "EXPORT_" + Date.now()) }}>ЭКСПОРТ В XSLX</button>
                <div className="table-responsive">
                    <table className="table">
                        <tr>
                            <th>TS</th>
                            <th>TYPE</th>
                            <th>DATA</th>
                            <th>ACK</th>
                            <th>DR</th>
                            <th>FREQ</th>
                            <th>GATEWAY ID</th>
                            <th>PORT</th>
                            <th>RSSI</th>
                            <th>SNR</th>
                            <th>FCNT</th>
                        </tr>
                        <tbody>
                            {itemsList}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default DataTable;