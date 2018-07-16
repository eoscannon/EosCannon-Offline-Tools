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
    return <FooterWrapper>EOS佳能荣誉出品 ©2018</FooterWrapper>;
  }
}

const FooterWrapper = styled(Footer)`
  text-align: center;
`;
