import React, { useState, useEffect } from 'react';
import { PageContainer, ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Col, Row, Card, Table, Button, Form } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { HddOutlined, RedoOutlined, DeleteOutlined, KeyOutlined, FileOutlined } from '@ant-design/icons';
import { listCacheName, listCacheKey, getCacheValue, clearCacheAll, clearCacheKey, clearCacheName } from '@/services/monitor/cachelist';

const spanStyle = {
  marginLeft: 5,
};
const size = 'middle';


const CacheList: React.FC = () => {
  let [cacheContentList, setCacheContentList] = useState<API.Monitor.CacheContent[]>();
  let [cacheName, setCacheName] = useState<string>();
  let [cacheKey, setCacheKey] = useState<string>();
  let [cacheKeyList, setCacheKeyList] = useState<API.Monitor.CacheKey[]>();
  const [form] = Form.useForm();

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
        return (
          <Button 
            type="link" 
            icon={<DeleteOutlined />} 
            onClick={
              () => {
                clearName(record.cacheName)
              }
            }
          />);
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
        return (
          <Button 
            type="link" 
            icon={<DeleteOutlined />} 
            onClick={() => {
              clearCache(record.cacheKey)
            }}
          />
        );
      },
    },
  ];

  const getListCache = () => {
    listCacheName().then((res) => {
      setCacheContentList(res?.data || []);
    });
  };
  const getCacheKey = (key:string = '') => {
    setCacheName(key);
    form.resetFields();
    listCacheKey(key).then(res=> {
      const data = res.data && res.data.map(J=>{
        return {
          cacheKey: J
        }
      })
      setCacheKeyList(data);
    })
  }
  const getCacheInfo = (cacheKey:string = '') => {
    setCacheKey(cacheKey);
    getCacheValue(cacheName || '',cacheKey).then(res=>{
      form.setFieldsValue(res?.data);
    })
  }
  const clearAllCache = () => {
    clearCacheAll()
  }
  const clearCache = (key:string) => {
    clearCacheKey(key).then(res=>{
      getCacheKey(cacheName);
    })
  }
  const clearName = (name:string) => {
    clearCacheName(name).then(res=>{
      getListCache();
      if (cacheName==name) {
        form.resetFields();
        setCacheKeyList([])
      }
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
                <span style={spanStyle}>缓存列表</span>
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
                  getListCache();
                }}
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
                  clearAllCache()
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
              readonly={true}
              submitter={false}
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
              <ProFormTextArea 
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
