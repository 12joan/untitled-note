import React from 'react';
import ReactTimeAgo from 'react-time-ago';
import TimeAgoLib from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgoLib.addDefaultLocale(en);

export const TimeAgo: typeof ReactTimeAgo = (props) => (
  <ReactTimeAgo timeStyle="round" {...props} />
);
