import React, { Component } from 'react'
import { Layout, Input, Icon, Form, Button, Divider, message, notification } from 'antd'
import { withRouter } from 'react-router-dom'
import axios from '@/api'
import { API } from '@/api/config'
import '@/style/view-style/login.scss'

class Login extends Component {
    state = {
        loading: false
    }

    enterLoading = () => {
        this.setState({
            loading: true
        })
    }
    getCookie = _name => {
        let arr,
            reg = new RegExp('(^| )' + _name + '=([^;]*)(;|$)')
        if ((arr = document.cookie.match(reg))) return unescape(arr[2])
        else return null
    }
    handleSubmit = e => {
        e.preventDefault()
        // this.props.form.validateFields().then(values => {
        //     console.log(values)
        // })
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { username, password } = values
                axios
                    .post(`${API}/login`, { username, password })
                    .then(res => {
                        // if (res.data.code === 0) {
                        //     localStorage.setItem('user', JSON.stringify(res.data.data.user))
                        //     localStorage.setItem('token', res.data.data.token)
                        //     this.props.history.push('/')
                        //     message.success('登录成功!')
                        // } else {
                        //     // 这里处理一些错误信息
                        // }
                        console.log(res.data)
                    })
                    .catch(err => {})

                // 这里可以做权限校验 模拟接口返回用户权限标识
                switch (values.username) {
                    case 'admin':
                        values.auth = 0
                        break
                    default:
                        values.auth = 1
                }

                // console.log(values)

                // localStorage.setItem('user', JSON.stringify(values))
                // this.enterLoading()
                // this.timer = setTimeout(() => {
                //     message.success('登录成功!')
                //     this.props.history.push('/')
                // }, 2000)
            }
        })
    }

    componentDidMount() {
        notification.open({
            message: 'Welcome to Violas Backend Management System',
            duration: 5,
            description: '账号 admin 密码 Vio1as'
        })
    }

    componentWillUnmount() {
        notification.destroy()
        this.timer && clearTimeout(this.timer)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Layout className='login animated fadeIn'>
                <div className='model'>
                    <div className='login-form'>
                        <h3>Violas Backend Management System</h3>
                        <Divider />
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: 'Please enter Username!' }]
                                })(
                                    <Input
                                        prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder='Username'
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please enter Password' }]
                                })(
                                    <Input
                                        prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type='password'
                                        placeholder='Password'
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='login-form-button'
                                    loading={this.state.loading}>
                                    Log in
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default withRouter(Form.create()(Login))
