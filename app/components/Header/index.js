/*
 * HeaderComp
 *
 */

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { Menu } from '../../utils/antdUtils';
const { Header } = Layout;

export default class HeaderComp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      defaultSelectedKeys: '1',
    };
  }
  /**
   * 根据URL地址，重新设置默认菜单选项
   * */
  componentWillMount() {
    let defaultSelectedKeys = '1';
    switch (window.location.hash.substring(1)) {
      case '/proxy':
        defaultSelectedKeys = '2';
        break;
      case '/transfer':
        defaultSelectedKeys = '3';
        break;
      case '/refund':
        defaultSelectedKeys = '4';
        break;
      case '/buyrambytes':
        defaultSelectedKeys = '5';
        break;
      default:
        defaultSelectedKeys = '1';
    }
    this.setState({
      defaultSelectedKeys,
    });
  }

  render() {
    return (
      <HeaderWrapper>
        <div className="logo">EOS Cannon</div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[this.state.defaultSelectedKeys]}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">
            <Link href="/stake" to="/stake">
              质押
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="/proxy" to="/proxy">
              代理
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link href="/transfer" to="/transfer">
              转账
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link href="/refund" to="/refund">
              赎回
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link href="/buyrambytes" to="/buyrambytes">
              购买内存
            </Link>
          </Menu.Item>
        </Menu>
      </HeaderWrapper>
    );
  }
}

const HeaderWrapper = styled(Header)`
  position: fixed;
  z-index: 1000;
  width: 100%;
  .logo {
    width: 120px;
    height: 31px;
    margin: 16px 24px 16px 0;
    line-height: 31px;
    font-size: 18px;
    font-weight: bold;
    color: #f5cb48;
    float: left;
  }
`;
