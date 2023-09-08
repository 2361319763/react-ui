import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Card, Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';
import { DesktopOutlined, PieChartOutlined, DashboardOutlined } from '@ant-design/icons';
import BaseEChart from '@/components/BaseEChart';
import { getCacheInfo } from '@/services/monitor/cache';

const spanStyle = {
  marginLeft: 5
};
const echartsHeight = 400;
const size = 'middle';

const Cache: React.FC = () => {
  let [cacheInfo, setCacheInfo] = useState<API.Monitor.CacheInfo>();
  const infoItem: DescriptionsProps['items']= [
    {
      key: 'info_1',
      label: 'Redis版本',
      labelStyle: {width:150},
      children: cacheInfo?.info.redis_version
    },{
      key: 'info_2',
      label: '运行模式',
      labelStyle: {width:150},
      children: cacheInfo?.info.redis_mode == "standalone" ? "单机" : "集群"
    },{
      key: 'info_3',
      label: '端口',
      labelStyle: {width:150},
      children: cacheInfo?.info.tcp_port
    },{
      key: 'info_4',
      label: '客户端数',
      labelStyle: {width:150},
      children: cacheInfo?.info.connected_clients
    },{
      key: 'info_5',
      label: '运行时间(天)',
      children: cacheInfo?.info.uptime_in_days
    },{
      key: 'info_6',
      label: '使用内存',
      children: cacheInfo?.info.used_memory_human
    },{
      key: 'info_7',
      label: '使用CPU',
      children: cacheInfo?.info.used_cpu_user_children
    },{
      key: 'info_8',
      label: '内存配置',
      children: cacheInfo?.info.maxmemory_human
    },{
      key: 'info_9',
      label: 'AOF是否开启',
      children: cacheInfo?.info.aof_enabled == "0" ? "否" : "是"
    },{
      key: 'info_10',
      label: 'RDB是否成功',
      children: cacheInfo?.info.rdb_last_bgsave_status
    },{
      key: 'info_11',
      label: 'Key数量',
      children: cacheInfo?.dbSize
    },{
      key: 'info_12',
      label: '网络入口/出口',
      children: cacheInfo?.info.instantaneous_input_kbps
    },
  ]

  const Commandstats = () => {
    const options = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      series: [
        {
          name: "命令",
          type: "pie",
          roseType: "radius",
          radius: [15, 95],
          center: ["50%", "38%"],
          data: cacheInfo?.commandStats,
          animationEasing: "cubicInOut",
          animationDuration: 1000,
        }
      ]
    }

    return(
      <BaseEChart option={options} style={{height:echartsHeight}} />
    )
  }
  const Usedmemory = () => {
    const options = {
      tooltip: {
        formatter: "{b} <br/>{a} : " + cacheInfo?.info.used_memory_human,
      },
      series: [
        {
          name: "峰值",
          type: "gauge",
          min: 0,
          max: 1000,
          detail: {
            formatter: cacheInfo?.info.used_memory_human,
          },
          data: [
            {
              value: parseFloat(cacheInfo?.info.used_memory_human ?? ''),
              name: "内存消耗",
            }
          ]
        }
      ]
    }
    return (
      <BaseEChart option={options} style={{height:echartsHeight}} />
    )
  }
  useEffect(() => {
    getCacheInfo().then(res=>{
      setCacheInfo(res.data);
    });
  }, []);

  return (
    <PageContainer>
      <Row gutter={[16,16]}>
          <Col span={24}>
            <Card 
              title={
                <div>
                  <DesktopOutlined />
                  <span style={spanStyle}>基本信息</span>
                </div>
              }
            >
              <Descriptions 
                bordered 
                size={size}
                items={infoItem} 
                column={4} 
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card 
                title={
                  <div>
                    <PieChartOutlined />
                    <span style={spanStyle}>命令统计</span>
                  </div>
                }
              >
                <Commandstats />
              </Card>
          </Col>
          <Col span={12}>
            <Card 
                title={
                  <div>
                    <DashboardOutlined />
                    <span style={spanStyle}>内存信息</span>
                  </div>
                }
              >
                <Usedmemory />
              </Card>
          </Col>
      </Row>
    </PageContainer>
  );
}
export default Cache;