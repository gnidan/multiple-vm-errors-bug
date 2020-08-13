// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;

contract Reverter {
  function run() external pure {
    revert("error, yo");
  }
}
