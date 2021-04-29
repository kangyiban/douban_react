import React, {useState,forwardRef,useImperativeHandle} from "react";
import { Space, Button, Form, Drawer, Input,Col,Row, } from "antd";
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {$post} from '../axios/axios'

const CustomDrawer = (props,ref) => {

    const{title} =props;

    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
        show() {
            setVisible(true);
            form.setFieldsValue();
        }
    }));

    const handleClose = () => {
        setVisible(false);

        form.resetFields();
    };

    const addData =async (data) =>{
       await $post( 'add',data);
    }

    const handleOk = () => {

        form.validateFields()
            .then(async (values) => {
                addData(values);
                props.commitData();
                handleClose();
            })
            .catch((err) => {});

    };

    const uploadProps = {
        onChange: info => {
            console.log(info.fileList);
        },
    };

    return (
        <Drawer
            footer={
                <div style={{ textAlign: "right" }}>
                    <Space>
                        <Button onClick={handleClose}>取消</Button>
                        <Button type="primary" onClick={handleOk}>
                            确定
                        </Button>
                    </Space>
                </div>
            }

            visible={visible}
            destroyOnClose={true}
             width={400}  /*自定义*/
            title={title}
            onClose={handleClose}
        >
            <Form layout="vertical"  size="large" form={form} scrollToFirstError>
                <Row gutter={24}>
                    <Col span={18}>
                        <Form.Item
                            name="title"
                            label="标题"

                            rules={[{ required: true, message: 'Please enter title' }]}
                        >
                            <Input placeholder="标题" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={18}>
                        <Form.Item
                            name="star"
                            label="评分"
                            rules={[{ required: true, message: 'Please enter star' }]}
                        >
                            <Input placeholder="评分" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={18}>
                        <Form.Item
                            name="pic"
                            label="图片"
                            rules={[{ required: true, message: 'Please enter pic' }]}
                        >
                           <Input placeholder="图片" />
                            {/*<Upload {...uploadProps} accept="image/png,image/jpeg,image/jpg">*/}
                                {/*<Button icon={<UploadOutlined />}>图片</Button>*/}
                            {/*</Upload>*/}

                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={18}>
                        <Form.Item
                            name="inq"
                            label="简介"
                            rules={[{ required: true, message: 'Please enter inq' }]}
                        >
                            <Input placeholder="inq" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={18}>
                        <Form.Item
                            name="actor"
                            label="演员"
                            rules={[{ required: true, message: 'Please enter actor' }]}
                        >
                            <Input placeholder="演员" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );

}

export  default forwardRef( CustomDrawer);