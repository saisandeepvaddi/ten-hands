/* eslint-disable-next-line */
import React from "react";
import styled from "styled-components";
import { Classes } from "@blueprintjs/core";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
`;

export const Item = styled.div`
  padding: 0 10px;
  width: 100%;
  display: flex;
  border-radius: 3px;
  user-select: none;
  line-height: 40px;
  font-size: 14px;
  max-width: 100%;
  overflow: hidden;
  white-space: no-wrap;
  text-overflow: ellipsis;
  justify-content: space-between;
  align-items: center;
  &:hover {
    cursor: pointer;
    color: ${(props) =>
      props.theme === Classes.DARK ? "#48aff0" : "#106ba3"} !important;
  }
`;

export const TabSwitchAnimator = styled.div`
  position: absolute;
  transition: height, transform, width, -webkit-transform;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.4, 1, 0.75, 0.9);
  height: 40px;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(19, 124, 189, 0.2);
`;
