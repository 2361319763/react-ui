import React, { useState, useEffect } from 'react';
import { PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import { Col, Row, Card, Table, Button, Form } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { HddOutlined, RedoOutlined, DeleteOutlined, KeyOutlined, FileOutlined } from '@ant-design/icons';
import { listCacheName, listCacheKey, getCacheValue } from '@/services/monitor/cachelist';

const spanStyle = {
  marginLeft: 5,
};
const size = 'middle';

const cacheItem: ColumnsType<API.Monitor.CacheContent> = [
  {
    title: '缓存名称',
    align: 'center',
    dataIndex: 'cacheName',
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (_, record) => {
      return <Button type="link" icon={<DeleteOutlined />} />;
    },
  },
];
const keyItem: ColumnsType<API.Monitor.CacheKey> = [
  {
    title: '缓存键名',
    align: 'center',
    dataIndex: 'cacheKey',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (_, record) => {
      return <Button type="link" icon={<DeleteOutlined />} />;
    },
  },
];

const CacheList: React.FC = () => {
  let [cacheContentList, setCacheContentList] = useState<API.Monitor.CacheContent[]>();
  let [cacheName, setCacheName] = useState<string>();
  let [cacheKey, setCacheKey] = useState<string>();
  let [cacheKeyList, setCacheKeyList] = useState<API.Monitor.CacheKey[]>();
  const [form] = Form.useForm();

  const getListCache = () => {
    listCacheName().then((res) => {
      setCacheContentList(res.data);
    });
  };
  const getCacheKey = (key:string = '') => {
    setCacheName(key);
    form.resetFields();
    listCacheKey(key).then(res=> {
      const data = res.data.map(J=>{
        return {
          cacheKey: J
        }
      })
      setCacheKeyList(data);
    })
  }
  const getCacheInfo = (cacheKey:string = '') => {
    setCacheKey(cacheKey);
    getCacheValue(cacheKey,cacheKey).then(res=>{
      form.setFieldsValue(res.data);
    })
  }
  useEffect(() => {
    form.resetFields();
    getListCache();
  }, []);

  return (
    <PageContainer>
      <Row gutter={16}>
        <Col span={8}>
          <Card
            title={
              <div>
                <HddOutlined />
                <span style={spanStyle}>内存</span>
              </div>
            }
            extra={
              <Button
                icon={
                  <RedoOutlined
                    style={{ color: '#1890ff' }}
                    onClick={() => {
                      getListCache();
                    }}
                  />
                }
                type="link"
              />
            }
          >
            <Table
              pagination={false}
              size={size}
              columns={cacheItem}
              dataSource={cacheContentList}
              onRow={(record) => {
                return {
                  onClick: () => {
                    getCacheKey(record.cacheName)
                  }, // 点击行
                };
              }}
              rowKey="cacheName"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={
              <div>
                <KeyOutlined />
                <span style={spanStyle}>键名列表</span>
              </div>
            }
            extra={
              <Button
                icon={
                  <RedoOutlined
                    style={{ color: '#1890ff' }}
                    onClick={() => {
                      getCacheKey(cacheName);
                    }}
                  />
                }
                type="link"
              />
            }
          >
            <Table
              pagination={false}
              size={size}
              columns={keyItem}
              dataSource={cacheKeyList}
              onRow={(record) => {
                return {
                  onClick: () => {
                    getCacheInfo(record.cacheKey);
                  }, // 点击行
                };
              }}
              rowKey="cacheKey"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={
              <div>
                <FileOutlined />
                <span style={spanStyle}>缓存内容</span>
              </div>
            }
            extra={
              <Button
                icon={
                  <RedoOutlined
                    style={{ color: '#1890ff' }}
                  />
                }
                onClick={() => {
                  getCacheInfo(cacheKey)
                }}
                type="link"
              >
                清除全部
              </Button>
            }
          >
            <ProForm
              grid={true}
              form={form}
              autoComplete="off"
            >
              <ProFormText 
                name="cacheName"
                placeholder=""
                disabled
                label="缓存名称"
              />
              <ProFormText 
                name="cacheKey"
                placeholder=""
                disabled
                label="缓存键名"
              />
              <ProFormText 
                name="cacheValue"
                placeholder=""
                disabled
                label="缓存内存"
              />
            </ProForm>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default CacheList;
