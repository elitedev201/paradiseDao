require('dotenv').config();
// truffle migrate --f 3 --to 3 --network avax
// truffle run verify TimeBondingCalculator Distributor --network avax
const UTOPERC20Token = artifacts.require("UTOPERC20Token");
const _sUTOP = artifacts.require("sUTOP");
const _UTOPStaking = artifacts.require("UTOPStaking");
const _StakingHelper = artifacts.require("StakingHelper");
const _UtopiaTreasury = artifacts.require("UtopiaTreasury");
const _MIM = artifacts.require("DAI");
const _StakingWarmup = artifacts.require("StakingWarmup");
const _UtopiaBondingCalculator = artifacts.require("UtopiaBondingCalculator");
const _Distributor = artifacts.require("Distributor");
const _DAO = artifacts.require("DAO");

const chalk = require('chalk');
let _yellowBright = chalk.yellowBright;
let _magenta = chalk.magenta;
let _cyan = chalk.cyan;
let _yellow = chalk.yellow;
let _red = chalk.red;
let _blue = chalk.blue;
let _green = chalk.green;

function yellow() {
  console.log(_yellow(...arguments));
}

function red() {
  console.log(_red(...arguments));
}

function green() {
  console.log(_green(...arguments));
}

function blue() {
  console.log(_blue(...arguments));
}

function cyan() {
  console.log(_cyan(...arguments));
}

function magenta() {
  console.log(_magenta(...arguments));
}


module.exports = async function (deployer, network, accounts) {

  green('main account: '+accounts);

  const epochLength = process.env.DEPLOY_EPOCH;
  const nextEpochBlock = process.env.DEPLOY_NEXT_EPOCH_BLOCK;

  green('MIM:  start');
  let MIM_Contract;
  let MIM = process.env.BOND; // movr
  if (network == 'dev' || network.indexOf('test') != -1) {
    MIM_Contract = await _MIM.deployed();
    MIM = MIM_Contract.address;
  } else if (network == 'ftm') {
    MIM = '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e'; // ftm
  }
  let TimeERC20Token;
  if( ! process.env.DEPLOY_USE_TOKEN || network == 'dev' || network.indexOf('test') != -1 ){
    TimeERC20Token = await UTOPERC20Token.deployed();
  }else{
    TimeERC20Token = await UTOPERC20Token.at(process.env.DEPLOY_USE_TOKEN);
  }
  const sUTOP = await _sUTOP.deployed();
  const UTOPStaking = await _UTOPStaking.deployed();
  const StakingHelper = await _StakingHelper.deployed();
  const UtopiaTreasury = await _UtopiaTreasury.deployed();
  const StakingWarmup = await _StakingWarmup.deployed();

  await deployer.deploy(_UtopiaBondingCalculator, TimeERC20Token.address);
  const TimeBondingCalculator = await _UtopiaBondingCalculator.deployed();
  await deployer.deploy(_Distributor, UtopiaTreasury.address, TimeERC20Token.address, epochLength, nextEpochBlock);
  const Distributor = await _Distributor.deployed();

  await deployer.deploy(_DAO);
  const DAO = await _DAO.deployed();


  magenta("CONTRACTS")
  green("- MIM: " + MIM);
  green("- TimeERC20Token: " + TimeERC20Token.address);
  green("- sUTOP: " + sUTOP.address);
  green("- UTOPStaking: " + UTOPStaking.address);
  green("- StakingHelper: " + StakingHelper.address);
  green("- UtopiaTreasury: " + UtopiaTreasury.address);
  green("- StakingWarmup: " + StakingWarmup.address);
  green("- TimeBondingCalculator: " + TimeBondingCalculator.address);
  green("- Distributor: " + Distributor.address);
  green("- DAO: " + DAO.address);

};
