/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import styled from 'styled-components';
// import PropTypes from 'prop-types';
import { Layout } from 'antd';
const { Footer } = Layout;

export default class FooterComp extends React.PureComponent {
  componentDidMount() {}

  render() {
    return <FooterWrapper>Ant Design ©2016 Created by Ant UED</FooterWrapper>;
  }
}

const FooterWrapper = styled(Footer)`
  text-align: center;
`;
