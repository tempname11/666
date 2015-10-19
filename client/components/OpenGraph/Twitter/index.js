import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { createTweet } from './api';

const URL = /^https?:\/\/twitter.com\/.*\/(\d+)/;

class Twitter extends Component {
  componentDidMount() {
    const { status } = this.props;
    createTweet(status, findDOMNode(this.myTweet));
  }

  render() {
    return <span ref={ref => this.myTweet = ref}></span>;
  }
}

export default meta => {
  if (!URL.exec(meta.ogUrl)) {
    return false;
  }

  return <Twitter status={RegExp.$1}/>;
};
