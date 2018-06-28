/*
 * FooterComp
 *
 */

import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
const { Footer } = Layout;

export default class FooterComp extends React.PureComponent {
  componentDidMount() {}

  render() {
    return (
      <FooterWrapper>Ant Design ©2018 Created by Eos Cannon</FooterWrapper>
    );
  }
}

const FooterWrapper = styled(Footer)`
  text-align: center;
`;
