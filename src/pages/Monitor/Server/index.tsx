import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Card, Table, Descriptions } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DescriptionsProps } from 'antd';
import { DeploymentUnitOutlined, HddOutlined, DesktopOutlined, CoffeeOutlined, ContainerOutlined } from '@ant-design/icons';
import { getServerInfo } from '@/services/monitor/server';

interface memDataType {
  key: string | number;
  title: string;
  mem: string;
  jvm: string;
}

const spanStyle = {
  marginLeft: 5
};
const cardStyle = {
  height: '100%'
};
const size = 'middle';

const memColumns: ColumnsType<memDataType> = [
  {
    title: '属性',
    dataIndex: 'title',
    key: 'title',
  },{
    title: '内存',
    dataIndex: 'mem',
    key: 'mem',
  },{
    title: 'JVM',
    dataIndex: 'jvm',
    key: 'jvm',
  }
];
const sysFilesColumns: ColumnsType<API.Monitor.DiskInfoType> = [
  {
    title: '盘符路径',
    dataIndex: 'dirName',
    key: 'dirName',
  },{
    title: '文件系统',
    dataIndex: 'sysTypeName',
    key: 'sysTypeName',
  },{
    title: '盘符类型',
    dataIndex: 'typeName',
    key: 'typeName',
  },{
    title: '总大小',
    dataIndex: 'total',
    key: 'total',
  },{
    title: '可用大小',
    dataIndex: 'free',
    key: 'free',
  },{
    title: '已用大小',
    dataIndex: 'used',
    key: 'used',
  },{
    title: '已用百分比',
    dataIndex: 'usage',
    key: 'usage',
    render: usage => {
      return (
        <span style={{color: usage>80?'#dc2626':'#000000E0'}}>{usage}%</span>
      );
    },
  },
]

const Server: React.FC = () => {
  let [serverInfoType, setServerInfoType] = useState<API.Monitor.ServerInfoType>();

  useEffect(() => {
    getServerInfo().then(res => {
      setServerInfoType(res.data);
    })
  },[])

  
  const cpuItems: DescriptionsProps['items'] = [
    {
      key: 'cpuItems_1',
      label: '核心数',
      labelStyle: {width:200},
      children: serverInfoType?.cpu?.cpuNum
    },
    {
      key: 'cpuItems_2',
      label: '用户使用率',
      children: `${serverInfoType?.cpu?.used ?? 0}%`
    },
    {
      key: 'cpuItems_3',
      label: '系统使用率',
      children: `${serverInfoType?.cpu?.sys ?? 0}%`
    },
    {
      key: 'cpuItems_4',
      label: '当前空闲率',
      children: `${serverInfoType?.cpu?.free ?? 0}%`
    },
  ]

  const sysItem: DescriptionsProps['items'] = [
    {
      key: 'sysItem_1',
      label: '服务器名称',
      labelStyle: {width:200},
      children: serverInfoType?.sys?.computerName
    },
    {
      key: 'sysItem_2',
      label: '操作系统',
      labelStyle: {width:200},
      children: serverInfoType?.sys?.osName ?? ''
    },
    {
      key: 'sysItem_3',
      label: '服务器IP',
      children: serverInfoType?.sys?.computerIp ?? ''
    },
    {
      key: 'sysItem_4',
      label: '系统架构',
      children: serverInfoType?.sys?.osArch ?? ''
    },
  ]

  const javaItem: DescriptionsProps['items'] = [
    {
      key: 'javaItem_1',
      label: 'Java名称',
      labelStyle: {width:200},
      children: serverInfoType?.jvm?.name
    },{
      key: 'javaItem_2',
      label: 'Java版本',
      labelStyle: {width:200},
      children: serverInfoType?.jvm?.version
    },{
      key: 'javaItem_3',
      label: '启动时间',
      children: serverInfoType?.jvm?.startTime
    },{
      key: 'javaItem_4',
      label: '运行时长',
      labelStyle: {width:200},
      children: serverInfoType?.jvm?.runTime
    },{
      key: 'javaItem_5',
      label: '安装路径',
      labelStyle: {width:200},
      children: serverInfoType?.jvm?.home,
      span: 2
    },{
      key: 'javaItem_6',
      label: '项目路径',
      labelStyle: {width:200},
      children: serverInfoType?.sys?.userDir,
      span: 2
    },{
      key: 'javaItem_7',
      label: '运行参数',
      labelStyle: {width:200},
      children: serverInfoType?.jvm?.inputArgs,
      span: 2
    },
  ]

  
  const MemDom = () =>{
    const data: memDataType[] = [
      {
        key: 'MemDom_1',
        title: '总内存',
        mem: `${serverInfoType?.mem.total}G`,
        jvm: `${serverInfoType?.jvm.total}M`,
      },{
        key: 'MemDom_2',
        title: '已用内存',
        mem: `${serverInfoType?.mem.used}G`,
        jvm: `${serverInfoType?.jvm.used}M`,
      },{
        key: 'MemDom_3',
        title: '剩余内存',
        mem: `${serverInfoType?.mem.free}G`,
        jvm: `${serverInfoType?.jvm.free}M`,
      },{
        key: 'MemDom_4',
        title: '使用率',
        mem: `${serverInfoType?.mem.usage}%`,
        jvm: `${serverInfoType?.jvm.usage}%`,
      },
    ];
    return (
      <Table pagination={false} size={size} columns={memColumns} dataSource={data} />
    )
  }
  
  return (
    <PageContainer>
      <Row gutter={[16,16]}>
        <Col span={12}>
          <Card 
            title={
              <div>
                <DeploymentUnitOutlined />
                <span style={spanStyle}>CPU</span>
              </div>
            }
            style={cardStyle}
          >
            <Descriptions 
              bordered 
              size={size}
              items={cpuItems} 
              column={1} 
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={
            <div>
              <HddOutlined />
              <span style={spanStyle}>内存</span>
            </div>
          }>
            <MemDom />
          </Card>
        </Col>
        <Col span={24}>
          <Card title={
            <div>
              <DesktopOutlined />
              <span style={spanStyle}>服务器信息</span>
            </div>
          }>
            <Descriptions 
              bordered 
              size={size}
              items={sysItem} 
              column={2} 
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card title={
            <div>
              <CoffeeOutlined />
              <span style={spanStyle}>Java虚拟机信息</span>
            </div>
          }>
            <Descriptions 
              bordered 
              size={size}
              items={javaItem} 
              column={2} 
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card title={
            <div>
              <ContainerOutlined />
              <span style={spanStyle}>磁盘状态</span>
            </div>
          }>
            <Table pagination={false} size={size} columns={sysFilesColumns} dataSource={serverInfoType?.sysFiles} rowKey='dirName' />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
}
export default Server;