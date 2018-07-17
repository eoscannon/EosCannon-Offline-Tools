/*
 * HeaderComp
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { Menu } from '../../utils/antdUtils';
import utilsMsg from '../../utils/messages';
import { makeSelectLocale } from '../../containers/LanguageProvider/selectors';
const { Header } = Layout;

class HeaderComp extends React.Component {
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
    let defaultSelectedKeys = '8';
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
      case '/vote':
        defaultSelectedKeys = '6';
        break;
      case '/updateauth':
        defaultSelectedKeys = '7';
        break;
      case '/stake':
        defaultSelectedKeys = '1';
        break;
      default:
        defaultSelectedKeys = '8';
    }
    this.setState({
      defaultSelectedKeys,
    });
  }

  changeLanguage = () => {
    const localeLanguage = this.props.locale === 'en' ? 'de' : 'en';
    this.props.onDispatchChangeLanguageReducer(localeLanguage);
  };

  render() {
    const { formatMessage } = this.props.intl;
    const createAccount = formatMessage(utilsMsg.HeaderMenuCreateAccount);
    const stake = formatMessage(utilsMsg.HeaderMenuDelegate);
    const transfer = formatMessage(utilsMsg.HeaderMenuTransfer);
    const buyRamBytes = formatMessage(utilsMsg.HeaderMenuBuyRamBytes);
    const vote = formatMessage(utilsMsg.HeaderMenuVote);
    const proxy = formatMessage(utilsMsg.HeaderMenuProxy);
    const updateAuth = formatMessage(utilsMsg.HeaderMenuUpdateAuth);
    const refund = formatMessage(utilsMsg.HeaderMenuRefund);
    return (
      <HeaderWrapper>
        <div className="logo">EOS Cannon</div>
        <div className="en" aria-hidden="true" onClick={this.changeLanguage}>
          {this.props.locale === 'en' ? '中文' : 'English'}
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[this.state.defaultSelectedKeys]}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="8">
            <Link href="/createaccount" to="/createaccount">
              {createAccount}
            </Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Link href="/stake" to="/stake">
              {stake}
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link href="/transfer" to="/transfer">
              {transfer}
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link href="/buyrambytes" to="/buyrambytes">
              {buyRamBytes}
            </Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link href="/vote" to="/vote">
              {vote}
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="/proxy" to="/proxy">
              {proxy}
            </Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link href="/updateauth" to="/updateauth">
              {updateAuth}
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link href="/refund" to="/refund">
              {refund}
            </Link>
          </Menu.Item>
        </Menu>
      </HeaderWrapper>
    );
  }
}
HeaderComp.propTypes = {
  intl: PropTypes.object,
  locale: PropTypes.string,
  onDispatchChangeLanguageReducer: PropTypes.func,
};

const HeaderCompIntl = injectIntl(HeaderComp);
// 挂载中间件到组件；
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onDispatchChangeLanguageReducer: locale =>
      dispatch({ type: 'app/LanguageToggle/CHANGE_LOCALE', locale }),
  };
}

const mapStateToProps = createSelector(makeSelectLocale(), locale => ({
  locale,
}));

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderCompIntl);

const HeaderWrapper = styled(Header)`
  position: fixed;
  z-index: 1000;
  width: 100%;
  .logo {
    width: 113px;
    height: 31px;
    margin: 16px 0;
    line-height: 31px;
    font-size: 18px;
    font-weight: bold;
    color: #f5cb48;
    float: left;
  }
  .en {
    cursor: pointer;
    width: 40px;
    height: 31px;
    line-height: 64px;
    font-size: 12px;
    color: #f5cb48;
    text-align: right;
    float: right;
    &:hover {
      color: #aaa;
    }
  }
`;
