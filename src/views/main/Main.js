import React, {useState,useEffect,useRef,forwardRef} from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Space,Button } from 'antd';
import {$get,$post} from "../../axios/axios";

import {withRouter} from 'react-router-dom'
import CustomDrawer from '../../component/CustomDrawer'

const EditableCell = ({editing, dataIndex, title, inputType,
    record,  index, children, ...restProps }) => {

    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};



const  Main = () => {

    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [loading, setLoading] = useState(true);

    //判断表格是否需要刷新
    const [isChange,setIsChange] = useState(false);

    const drawer = useRef();

    const isEditing = (record) => record.id === editingKey;

    useEffect(()=>{
        const fetchData = async () => {
            const {data} = await $get('findAll');
            console.log(0)
            setLoading(false)
            setData(data);
        }
        fetchData();
    },[isChange])
    // 使用基本类型作为是否数据发生改变的凭据，
    // 不能使用引用类型（数组，对象等），再这里引用类型区别不了（[] === [] => false）

    const edit = (record) => {
        form.setFieldsValue({
            title: '',
            star: '',
            pic: '',
            inq:'',
            actor:'',
            ...record,
        });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (record) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => record.id === item.id);

            if (index > -1) {
                newData.splice(index, 1, { ...record,...row });
                updateData({ ...record,...row })
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const deleteData= async (record)=>{
        await $post('delete',{id:record.id});
        setIsChange(!isChange);
    }

    const updateData= async (record)=>{
        await $post('update',record)
        setIsChange(!isChange);
    }

    const columns = [
        {
            title: 'title',
            dataIndex: 'title',
            width: '10%',
            editable: true,
            align:'center',
        },
        {
            title: 'star',
            dataIndex: 'star',
            width: '5%',
            editable: true,
            align:'center',
        },
        {
            title: 'pic',
            dataIndex: 'pic',
            width: '15%',
            editable: false,
            align:'center',
            render:(url) => {
                if (url.indexOf('http') < 0){
                    return url;
                }
                return <img src={url} alt="" style={{width:'100px',height:'50px'}}/>
            }

        },
        {
            title: 'inq',
            dataIndex: 'inq',
            width: '20%',
            editable: true,
            align:'center',
        },
        {
            title: 'actor',
            dataIndex: 'actor',
            width: '45%',
            editable: true,
            align:'center',
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            width: 100,
            align:'center',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
            <a
                href="javascript:;"
                onClick={() => save(record)}
                style={{
                    marginRight: 8,
                }}
            >
              保存
            </a>
            <Popconfirm title="确定保存?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
                ) : (
                    <Space size="small">
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            编辑
                        </Typography.Link>
                        <Popconfirm  disabled={editingKey !== ''} title="确定删除?" onConfirm={()=>{deleteData(record)}}>
                            <a>删除</a>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType:'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });


    return (
        <div  style={{ width:'90%'}}>
            <Button onClick={()=>drawer.current.show()} type="primary" style={{ marginBottom: 16 }}>
                添加数据
            </Button>

            <CustomDrawer  title="添加数据" ref={drawer} commitData={()=>setIsChange(!isChange)} />

            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    loading={loading}
                    bordered
                    scroll={{y:540}}
                    size="small"
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                    }}
                />
            </Form>
        </div>
    );
};

export  default withRouter(Main);