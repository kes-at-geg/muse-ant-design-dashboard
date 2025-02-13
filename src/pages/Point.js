import "reactjs-popup/dist/index.css";
import React, { useState, useContext } from "react";
import { Row, Col, Modal, Popover, ConfigProvider, message ,Form, Input, Card ,Radio,Spin, Divider, Select, Tooltip } from "antd";
import { EllipsisOutlined, InfoCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { getApiDataFromAws, getConfigDataFromAws, postApiDataToAws } from "../services/apis";
import { SelectColumns } from "../components/widgets/SelectedColumns/SelectedColumns";
import vector_ from "../../src/assets/images/vector_.png";
import { FilterColumnsData } from "../components/widgets/SelectedColumns/FilterColumns";
import spinnerjiff from "../assets/images/loader.gif";
import { isAuthenticated, userInfo } from "../services/apis";
import { useHistory } from 'react-router-dom';
import { AppContext } from "../App";
import { CSVLink } from 'react-csv';
import ResizableTable from "../components/widgets/ResizeTable/ResizableTable";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

export default function Point() {
  const [searchText, setSearchText] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pointData, setPointData] = useState({});
  const [loading, setloading] = useState(true);
  const [PointsId, SetPointsId] = useState();
  const [siteListData, setSiteListData] = useState([]);
  const [point, setPoint] = useState([]);
  const [meterOptions, setMeterOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(1);
  const [isEditable, setIsEditable] = useState();
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [visibleCard, setvisibleCard] = useState(false);

  const [form] = Form.useForm();
  const context = useContext(AppContext);
  const history = useHistory();
  const screenHeight = window.innerHeight - 310;
  const totalRows = point.length;
  const validateMessages = {
    required: "${label} is required",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  const pointChangeData = (changeTableData) => {
    getData(changeTableData);
    setActiveButton(changeTableData);
  }

  const onCancelModal = () => {
    setOpen(false);
    SetPointsId();
    form.resetFields();
  };

  const onOpenModal = () => {
    setOpen(true);
    form.resetFields();
  };

  let dynamicColumns = [];
  let DynamicColumns = (data) => {
    if (data.some(item => item.import)) {
      dynamicColumns.push(
        {
          title: "Import",
          dataIndex: "import",
          key: "5",
          ellipsis: true,
          width: 150,
          sorter: (a, b) => a.import.localeCompare(b.import),
          filters: Array.from(new Set(point.map(item => item.import))).map((name, index) => ({
            text: name,
            value: name,
          })),
          filterMode: "tree",
          filterSearch: false,
          onFilter: (value, record) => record.import.startsWith(value),
        },
      )
    }
    if (data.some(item => item.active)) {
      dynamicColumns.push(
        {
          title: "Active",
          dataIndex: "active",
          key: "6",
          ellipsis: true,
          width: 150,
          sorter: (a, b) => a.active.localeCompare(b.active),
          filters: Array.from(new Set(point.map(item => item.active))).map((name, index) => ({
            text: name,
            value: name,
          })),
          filterMode: "tree",
          filterSearch: false,
          onFilter: (value, record) => record.active.startsWith(value),
        },
      )
    }
    if (data.some(item => item.elec)) {
      dynamicColumns.push(
        {
          title: "Elec",
          dataIndex: "elec",
          key: "7",
          ellipsis: true,
          width: 150,
          sorter: (a, b) => a.elec.localeCompare(b.elec),
          filters: Array.from(new Set(point.map(item => item.elec))).map((name, index) => ({
            text: name,
            value: name,
          })),
          filterMode: "tree",
          filterSearch: false,
          onFilter: (value, record) => record.elec.startsWith(value),
        },
      )
    }
    if (data.some(item => item.energy)) {
      dynamicColumns.push(
        {
          title: "Energy",
          dataIndex: "energy",
          key: "10",
          ellipsis: true,
          width: 150,
          sorter: (a, b) => a.energy.localeCompare(b.energy),
          filters: Array.from(new Set(point.map(item => item.energy))).map((name, index) => ({
            text: name,
            value: name,
          })),
          filterMode: "tree",
          filterSearch: false,
          onFilter: (value, record) => record.energy.startsWith(value),
        },
      )
    }
    return dynamicColumns;
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "2",
      ellipsis: true,
      width: 250,
      resizable: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: Array.from(new Set(point.map(item => item.name))).map((name, index) => ({
        text: name,
        value: name,
      })),
      filterMode: "tree",
      filterSearch: false,
      onFilter: (value, record) => record.name.startsWith(value),
    },
    {
      title: "Point Type",
      dataIndex: "gegPointType",
      key: "3",
      ellipsis: true,
      width: 200,
      sorter: (a, b) => a.gegPointType.localeCompare(b.gegPointType),
      filters: Array.from(new Set(point.map(item => item.gegPointType))).map((name, index) => ({
        text: name,
        value: name,
      })),
      filterMode: "tree",
      filterSearch: false,
      onFilter: (value, record) => record.gegPointType.startsWith(value),
    },
    {
      title: "Data Type",
      dataIndex: "gegDataType",
      key: "14",
      ellipsis: true,
      width: 120,
      sorter: (a, b) => a.gegDataType.localeCompare(b.gegDataType),
      filters: Array.from(new Set(point.map(item => item.gegDataType))).map((name, index) => ({
        text: name,
        value: name,
      })),
      filterMode: "tree",
      filterSearch: false,
      onFilter: (value, record) => record.gegDataType.startsWith(value),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "4",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a.unit.localeCompare(b.unit),
      filters: Array.from(new Set(point.map(item => item.unit))).map((name, index) => ({
        text: name,
        value: name,
      })),
      filterMode: "tree",
      filterSearch: false,
      onFilter: (value, record) => record.unit.startsWith(value),
    },
    ...DynamicColumns(point),
    {
      title: "Sensor",
      dataIndex: "sensor",
      key: "8",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a.sensor.localeCompare(b.sensor),
      filters: Array.from(new Set(point.map(item => item.sensor))).map((name, index) => ({
        text: name,
        value: name,
      })),
      filterMode: "tree",
      filterSearch: false,
      onFilter: (value, record) => record.sensor.startsWith(value),
    },
    {
      title: "Point",
      dataIndex: "point",
      key: "9",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a.point.localeCompare(b.point),
      filters: Array.from(new Set(point.map(item => item.point))).map((name, index) => ({
        text: name,
        value: name,
      })),
      filterMode: "tree",
      filterSearch: false,
      onFilter: (value, record) => record.point.startsWith(value),
    },

    {
      title: "Nem12Id",
      dataIndex: "nem12Id",
      key: "11",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a.nem12Id.localeCompare(b.nem12Id),
      filters: Array.from(new Set(point.map(item => item.nem12Id))).map((name, index) => ({
        text: name,
        value: name,
      })),
      filterMode: "tree",
      filterSearch: false,
      onFilter: (value, record) => record.nem12Id.startsWith(value),
    },
    {
      title: "EquipRef",
      dataIndex: "equipRef",
      key: "12",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a.equipRef.localeCompare(b.equipRef),
      filters: Array.from(new Set(point.map(item => item.equipRef))).map((name, index) => ({
        text: name,
        value: name,
      })),
      filterMode: "tree",
      filterSearch: false,
      onFilter: (value, record) => record.equipRef.startsWith(value),
      render: (text) => (
        <Tooltip title={text}>
          <span>{text.length > 18 ? `${text.slice(0, 18)}...` : text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Id",
      dataIndex: "id",
      key: "1",
      ellipsis: true,
      width: 300,
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Actions",
      dataIndex: "delete",
      key: "13",
      ellipsis: true,
      width: 200,
      render: (text, record, index) => (
        isEditable ?
          <>
            <ConfigProvider>
              <Popover overlayStyle={{ width: '100px' }} placement="right" content={() => content(record)}>
                <EllipsisOutlined style={{ fontSize: "30px" }} />
              </Popover>
            </ConfigProvider>
          </>
          : null
      ),
    },
    // Add more columns as needed
  ];

  // Use the 'columns' array in your component



  let pointsConfigData;
  const getData = async (changeTableData) => {
    setIsLoading(true);
    let points = [];
    try {
      if (changeTableData === 1) {
        points = await getApiDataFromAws("queryType=elecPoints");
        pointsConfigData = await getConfigDataFromAws("elecPoints");
        setIsEditable(pointsConfigData.isEditable)
      } else if (changeTableData === 2) {
        points = await getApiDataFromAws("queryType=waterPoints")
        pointsConfigData = await getConfigDataFromAws("waterPoints");
        setIsEditable(pointsConfigData.isEditable)
      } else if (changeTableData === 3) {
        points = await getApiDataFromAws("queryType=gasPoints")
        pointsConfigData = await getConfigDataFromAws("gasPoints");
        setIsEditable(pointsConfigData.isEditable)
      }

      const sitesList = await getApiDataFromAws("queryType=dropdownSite");
      setSiteListData(sitesList);
      setPointData(points);
      setPoint(points);
      setloading(false);
      setIsLoading(false);
      if (searchText != "") {
        filter(searchText)
      }
    } catch (error) { }
  };

  const setData = async () => {
    try {

      var formData = form.getFieldsValue();

      const modifiedFormData = {
        ...formData,
        nem12PointAdditionalName: formData.name,
        nem12PointIdentifier: formData.nem12Id,
        pointId: ""
      };
      const { name, nem12Id, ...objectWithoutName } = modifiedFormData

      if (PointsId) {
        //const resp = await editSites(PointsId, formData);
      } else {
        const body = {
          funcName: 'createNem12PointRecordsFromJson',
          recList: [objectWithoutName]
        };
        const addNewPoint = await postApiDataToAws(body)
        if (addNewPoint && addNewPoint.message === "Success") {
          message.success('Point added successfully');
        } else {
          message.error('Failed to add Point');
        }
      }
      onCancelModal();
      getData(activeButton);
    } catch (error) {
      console.log(error);
    }
  };

  const onSiteNameChange = async (value) => {
    // Fetch the corresponding armsProjectIds based on the selected siteName
    let siteBase64 = btoa(value).replace(/=+$/, '');
    var meterDt = null;
    if (activeButton == 1) {
      meterDt = await getApiDataFromAws("queryType=dropdownElecMeters&dropdownSiteFilter=" + siteBase64)
    } else if (activeButton == 2) {
      meterDt = await getApiDataFromAws("queryType=dropdownWaterMeters&dropdownSiteFilter=" + siteBase64)
    } else if (activeButton == 3) {
      meterDt = await getApiDataFromAws("queryType=dropdownGasMeters&dropdownSiteFilter=" + siteBase64)
    }

    setMeterOptions(meterDt);

    // Clear the value of meterDis in the form
    form.setFieldsValue({
      meterDis: undefined,
    });

  };

  const onDelete = async (id) => {
    try {
      //const res = await deleteSites(id);
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const onEdit = async (record) => {
    form.setFieldsValue(record);
    SetPointsId(record.id);
    setOpen(true);
  };

  const onChangeText = async (text) => {
    if (text == "" || !text || text.length < searchText.length) {
      setPoint(pointData);
      setSearchText(text);
      filter(text, pointData);
    } else {
      setSearchText(text);
      filter(text, point);
    }
  };

  const advancedFilterData = (value) =>{
    if(value === "Reset"){
      setPoint(pointData);
    }else{
      console.log(value);
      let fillColumns = value[0];
      let fillCondition = value[2];
      let fillValue = value[1]; 
      let fillAndOr = value[3];
      
      const filtersData = point.filter((record) => {
        //record["name"].toLowerCase() === "nsw"
        let query = '';
        for (let i = 0; i < fillColumns.length; i++) {
          let column = fillColumns[i];
          let condition = fillCondition[i]
          let value = fillValue[i]
          let andor = i===0?'':fillAndOr[i-1]
          if(condition === "equalTo"){
            if(andor === "and"){
              query == ''? query = record[column] === value:
              query = query && record[column] === value 
            }else{
              query == ''? query = record[column] === value:
              query = query || record[column] === value 
            }
          }else if(condition === "notEqualTo"){
            if(andor === "and"){
              query == ''? query = record[column] !== value:
              query = query && record[column] !== value 
            }else{
              query == ''? query = record[column] !== value:
              query = query || record[column] !== value 
            }
          }else if(condition === "includes"){
            if(andor === "and"){
              query == ''? query = record[column].toLowerCase().includes(value.toLowerCase()):
              query = query && record[column].toLowerCase().includes(value.toLowerCase()) 
            }else{
              query == ''? query = record[column].toLowerCase().includes(value.toLowerCase()):
              query = query || record[column].toLowerCase().includes(value.toLowerCase()) 
            }
          }
          else if (condition === "greaterThan") {
            if (andor === "and") {
                query === '' ? query = Number(record[column]) > (value) :
                    query = query && Number(record[column]) > (value)
            } else {
                query === '' ? query = Number(record[column]) > (value) :
                    query = query || Number(record[column]) > (value)
            }
          } else if (condition === "lessThan") {
            if (andor === "and") {
                query === '' ? query = Number(record[column]) < (value) :
                    query = query && Number(record[column]) < (value)
            } else {
                query === '' ? query = Number(record[column]) < (value) :
                    query = query || Number(record[column]) < (value)
            }
          }
        }
        return query
        
      });
      setPoint(filtersData);
    }
  }

  const content = (record) => (
    <div style={{ marginLeft: "10px", backgroundColor: "#0A1016", paddingTop: "10px", marginRight: "10px", paddingLeft: "10px", paddingRight: "10px" }}>
      <a onClick={() => onEdit(record)} style={{ color: "white" }}>EDIT</a>
      <Divider type="horizontal" style={{ margin: "5px" }} />
      <a onClick={() => onDelete(record.id)} style={{ color: "white", display: "none" }}>DELETE</a>
    </div>
  )

  const filter = (text, data) => {
    const filteredData = data.filter(
      (record) =>
        record.name.toLowerCase().includes(text.toLowerCase()) ||
        record.gegPointType.toLowerCase().includes(text.toLowerCase()) ||
        record.equipRef.toLowerCase().includes(text.toLowerCase()) ||
        record.nem12Id.toLowerCase().includes(searchText.toLowerCase())
    );
    setPoint(filteredData);
  };
  const exportToCSV = () => {
    const csvData = point.map(item => ({
      ...item, // Assuming mpReadings is an array of objects
    }));

    return csvData;
  };

  useEffect(() => {
    const authenticated = isAuthenticated()
    if (authenticated) {
      getData(1);
    } else {
      var userData = userInfo(context.token);
      if (userData == null) {
        history.push('/');
      } else {
        getData(1);
      }
    }
  }, []);

  const handleSelectColumns = (selectedColumns) => {
    setVisibleColumns(selectedColumns);
  }
  const handleChange = (value) => {
    console.log(value);
  };

  return (
    <>
      {" "}
      <Row>
        <Col span={12}>
          <Radio.Group>
            <Radio.Button className="ant-radio-button-css" style={{
              fontWeight: activeButton === 1 ? 'bold' : 'normal',
              color: activeButton === 1 ? '#FFFFFF' : '#8E8E8E',
            }} onClick={() => pointChangeData(1)} >Electric</Radio.Button>
            <Radio.Button className="ant-radio-button-css"
              style={{
                fontWeight: activeButton === 2 ? 'bold' : 'normal',
                color: activeButton === 2 ? '#FFFFFF' : '#8E8E8E',
              }}
              onClick={() => pointChangeData(2)} >Water</Radio.Button>
            <Radio.Button className="ant-radio-button-css"
              style={{
                fontWeight: activeButton === 3 ? 'bold' : 'normal',
                color: activeButton === 3 ? '#FFFFFF' : '#8E8E8E',
              }}
              onClick={() => pointChangeData(3)} >Gas</Radio.Button>
          </Radio.Group>
          <button className="mb-4 custom-button" type="primary" onClick={() => onOpenModal()} style={{ marginLeft: "20px" }}>
            {activeButton === 1 ? "Add New Electric" : activeButton === 2 ? "Add New Water" : "Add New Gas"}
          </button>
        </Col>
        <Col span={12} style={{ marginBottom: 10, textAlign: 'right' }}>
          <Input
            size="small"
            placeholder="search here ..."
            value={searchText}
            onChange={(e) => onChangeText(e.target.value)}
            className="custom-input"
          />
          <button className="ant-dropdown-link custom-button" style={{ marginLeft: "5px", paddingLeft: "10px", paddingRight: "10px" }} onClick={()=>setvisibleCard(!visibleCard)}>
          <img src={vector_} alt="vector_png" width={16} height={16}/>
          </button>
          <SelectColumns columns={columns} onSelectColumns={handleSelectColumns}/>
          <CSVLink data={exportToCSV()} filename={"point.csv"}>
            <button type="button" className="custom-button">Export to CSV</button>
          </CSVLink>
        </Col>
      </Row>
      {visibleCard && <Card className="custom-card1">
        <div style={{ justifyContent: 'end', display: 'flex' }}>
          <CloseOutlined style={{ color: "#FFFFFF", fontSize: "15px", cursor: 'pointer' }} onClick={() => setvisibleCard(!visibleCard)} />
        </div>
        <FilterColumnsData columns={columns} onSelectColumns={handleSelectColumns} onSearch = {advancedFilterData}/>
      </Card>}
      <Modal
        style={{ textAlign: "left" }}
        title="Add New Point"
        centered
        open={open}
        onCancel={() => onCancelModal()}
        width={700}
        footer={null}
        maskClosable={false}
      >
        <Form
          {...layout}
          name="nest-messages"
          layout="vertical"
          onFinish={setData}
          style={{ maxWidth: 700 }}
          form={form}
        //validateMessages={validateMessages}
        >
          <Row justify={"center"} gutter={[30, 30]}>
            <Col span={24}>
              <Form.Item
                name={"name"}
                label="Nem 12 Point Additional Name"
                tooltip={{ title: 'Provide an additional name or identifier for the NEM (National Electricity Market) 12-point connection, if necessary.', icon: <InfoCircleOutlined style={{ color: '#c5c5c5' }} /> }}
                initialValue=""
                wrapperCol={{ span: 24 }}
              // rules={[{ required: "" }]}
              >
                <Input className="form_input" />
              </Form.Item>
            </Col>
          </Row>

          <Row justify={"center"} gutter={[30, 30]}>
            <Col span={24}>
              <Form.Item
                name={"nem12Id"}
                label="Nem 12 Point Idenfier"
                tooltip={{ title: 'Specify the unique identifier for the NEM 12-point connection related to electricity/water/gas usage.', icon: <InfoCircleOutlined style={{ color: '#c5c5c5' }} /> }}
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Nem 12 Point Idenfier.',
                  },
                ]}

              >
                <Input className="form_input" />
              </Form.Item>
            </Col>
          </Row>

          <Row justify={"center"} gutter={[30, 30]}>
            <Col span={24}>
              <Form.Item
                name={"gegPointType"}
                label="Select Point Type"
                // labelCol={{ span: 4 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Please Select Point Type.',
                  },
                ]}
              >
                <Select
                  placeholder="Select Point Type"
                  value={selectedItems}
                  onChange={setSelectedItems}
                  size="large"
                  style={{ width: "100%" }}
                >
                  {activeButton === 1 ? (
                    <>
                      <Select.Option value={"totalenergyactiveimport"}>totalenergyactiveimport</Select.Option>
                      <Select.Option value={"totalenergyactiveexport"}>totalenergyactiveexport</Select.Option>
                      <Select.Option value={"totalenergyapparentimport"}>totalenergyapparentimport</Select.Option>
                      <Select.Option value={"totalenergyreactiveimport"}>totalenergyreactiveimport</Select.Option>
                    </>
                  ) : activeButton === 2 ? (
                    <Select.Option value={"volumewater"}>volumewater</Select.Option>
                  ) : <Select.Option value={"volumegas"}>volumegas</Select.Option>}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"center"} gutter={[30, 30]}>
            <Col span={24}>
              <Form.Item
                name={"gegDataType"}
                label="Select Data Type"
                // labelCol={{ span: 4 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Please Select Data Type.',
                  },
                ]}
              >
                <Select
                  placeholder="Select Data Type"
                  value={selectedItems}
                  onChange={setSelectedItems}
                  size="large"
                  style={{ width: "100%" }}
                >
                  <Select.Option value={"cumulative"}>cumulative</Select.Option>
                  <Select.Option value={"delta"}>delta</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row justify={"center"} gutter={[30, 30]}>
            <Col span={24}>
              <Form.Item
                name={"siteName"}
                label="Select Site Name"
                // labelCol={{ span: 4 }}
                wrapperCol={{ span: 24 }}
              // rules={[{ required: "" }]}
              >
                <Select
                  placeholder="Select Site Name"
                  value={selectedItems}
                  size="large"
                  onChange={(value) => {
                    onSiteNameChange(value);
                  }}
                  style={{ width: "100%" }}
                >
                  {siteListData.length > 0 &&
                    siteListData.map((item, index) => (
                      <Select.Option key={index} value={item.name}>{item.name}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"center"} gutter={[30, 30]}>
            <Col span={24}>
              <Form.Item
                name={"meterDis"}
                label="Select Meter Dis"
                tooltip={{ title: 'Choose the meter disposition from a list of available options for electricity/water/gas usage tracking.', icon: <InfoCircleOutlined style={{ color: '#c5c5c5' }} /> }}
                // labelCol={{ span: 4 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Please Select Meter Dis.',
                  },
                ]}
              >
                <Select
                  placeholder="Select Meter Dis"
                  value={selectedItems}
                  style={{ width: "100%" }}
                  size="large"
                >
                  {meterOptions && meterOptions.length > 0 &&
                    meterOptions.map((item, index) => (
                      <Select.Option key={index} value={item.name}>{item.name}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"center"} gutter={[30, 30]}>
            <Col span={24}>
              <Form.Item
                name={"help"}
                label="Help"
                initialValue=""
                wrapperCol={{ span: 24 }}
              // rules={[{ required: "" }]}
              >
                <Input className="form_input" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            wrapperCol={{
              offset: 11,
              span: 16,
            }}
          >
            <Row >
              <Col span={20} className="custom-modal-column">
                <button
                  className="custom-modal-button"
                  type=""
                  htmlType="button"
                  onClick={() => onCancelModal()}
                >
                  Cancel
                </button>
                <button type="" htmlType="submit">
                  Save
                </button>
              </Col>
            </Row>
          </Form.Item>

        </Form>
      </Modal>
      <Spin spinning={isLoading} size="large" indicator={<img src={spinnerjiff} style={{ fontSize: 50 }} alt="Custom Spin GIF" />}>
        <ResizableTable total={totalRows} name={"Points"} screenHeight={screenHeight} site={point} columnsData={visibleColumns.length > 0 ? columns.filter((item) => visibleColumns.includes(item.key)) : columns} />
      </Spin>
    </>
  );
}
