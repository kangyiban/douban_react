import React, {Component,useState} from 'react';
import { Form, Input, Button, Checkbox,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {withRouter} from 'react-router-dom';
import VerifyCode from '../../component/VerifyCode';


const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

class Login extends Component{

    constructor(props){
        super(props);
        this.state={
            code:[]
        }
    }

    refreshCode=()=>{
        this.GetVerifiCode();
    }

    GetVerifiCode=()=>{
        this.setState({
            code:this.genRandomString(4)
        });
    }

    genRandomString = len => {
        const text = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const rdmIndex = text => Math.random() * text.length | 0;
        let rdmString = '';
        for(; rdmString.length < len; rdmString += text.charAt(rdmIndex(text)));
        return rdmString;
    }


    componentWillMount() {
        this.GetVerifiCode();
    }

    onsubmit=(e)=>{
        const {history} = this.props;
        const {username,password,verifycode} = e;

        if (verifycode !== this.state.code) {
            message.error('验证码错误')
            return;
        }

        if (username === "1"  && password === "1"){
            window.sessionStorage.setItem("user","Logined");
            history.push('/main');
        } else {
            message.error('账号或密码错误！')
        }
    }

    render() {
        const ownStyle={
            width: '100%',
            height: '32px',
            backgroundColor: '#ffffff'
        };

        const formStyle = {
            width:'400px',
            height:'500px',
            display:'flex',
            flexDirection:'column',
            justifyContent: 'center'
        }

        const {code}=this.state;

        return (
            <div>
                <Form
                    {...layout}
                    style={formStyle}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={this.onsubmit}
                    className="login-form"
                >
                    <Form.Item

                        name="username"
                        rules={[{ required: true, message: '请输入账号' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="账号"/>
                    </Form.Item>

                    <Form.Item

                        name="password"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="密码"/>
                    </Form.Item>

                    <Form.Item

                        name="verifycode"
                        className={"verifycode"}
                        rules={[{ required: true, message: '请输入验证码!' }]}
                    >
                        <div style={{display:'flex'}}>
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="验证码" style={{flex:3}}/>

                            <div style={{flex:1,height:'35px'}}>
                                <VerifyCode ownStyle={ownStyle} onGetRefresh={this.refreshCode} data={code}/>
                            </div>
                        </div>

                    </Form.Item>

                    <Form.Item >
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default withRouter(Login);