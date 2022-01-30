require('dotenv').config();
// truffle migrate --f 7 --to 7 --network avax
// truffle run verify  --network avax
const _TimeERC20Token = artifacts.require("TimeERC20Token");
const _MEMOries = artifacts.require("MEMOries");
const _wMEMO = artifacts.require("wMEMO");
const _TimeStaking = artifacts.require("TimeStaking");
const _StakingHelper = artifacts.require("StakingHelper");
const _TimeTreasury = artifacts.require("TimeTreasury");
const _MIM = artifacts.require("DAI");
const _StakingWarmup = artifacts.require("StakingWarmup");
const _TimeBondingCalculator = artifacts.require("TimeBondingCalculator");
const _TimeBondDepository = artifacts.require("TimeBondDepository");
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

  green('MIM: start');
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
    TimeERC20Token = await _TimeERC20Token.deployed();
  }else{
    TimeERC20Token = await _TimeERC20Token.at(process.env.DEPLOY_USE_TOKEN);
  }

  const MEMOries = await _MEMOries.deployed();
  const wMEMO = await _wMEMO.deployed();
  const TimeStaking = await _TimeStaking.deployed();
  const StakingHelper = await _StakingHelper.deployed();
  const TimeTreasury = await _TimeTreasury.deployed();
  const StakingWarmup = await _StakingWarmup.deployed();

  const TimeBondingCalculator = await _TimeBondingCalculator.deployed();
  const Distributor = await _Distributor.deployed();

  const TimeBondDepository = await _TimeBondDepository.deployed();
  const DAO = await _DAO.deployed();

  green('TimeTreasury Distributor');
  await TimeStaking.setContract('1', StakingWarmup.address);
  await TimeStaking.setContract('0', Distributor.address);


  green('TimeTreasury TimeStaking 1');
  await MEMOries.initialize(TimeStaking.address);
  green('TimeTreasury TimeStaking 2');
  await MEMOries.setIndex('1000000000');

  if( process.env.DEPLOY_MINT_TOKENS ) {
    await TimeERC20Token.setVault(accounts[0]);
    green('DEPLOY_MINT_TOKENS', process.env.DEPLOY_MINT_TOKENS/1e9);
    await TimeERC20Token.mint(accounts[0], process.env.DEPLOY_MINT_TOKENS);
  }
  await TimeERC20Token.setVault(TimeTreasury.address);


  magenta("CONTRACTS")

  red(`# constants/addresses.ts`);
  blue(`DAO_ADDRESS: "${DAO.address}", // DAO`);
  blue(`sUTOP_ADDRESS: "${MEMOries.address}", // MEMOries`);
  blue(`UTOP_ADDRESS: "${TimeERC20Token.address}", // TimeERC20Token`);
  blue(`MIM_ADDRESS: "${MIM}", // MIM/DAI/1e18`);
  blue(`STAKING_ADDRESS: "${TimeStaking.address}", // TimeStaking`);
  blue(`STAKING_HELPER_ADDRESS: "${StakingHelper.address}", // StakingHelper`);
  blue(`TIME_BONDING_CALC_ADDRESS: "${TimeBondingCalculator.address}", // TimeBondingCalculator`);
  blue(`TREASURY_ADDRESS: "${TimeTreasury.address}", // TimeTreasury`);
  blue(`ZAPIN_ADDRESS: "0x0000000000000000000000000000000000000000",`);
  blue(`wsUTOP_ADDRESS: "${wMEMO.address}", // wMEMO`);
  red(`# helpers/bond/index.ts`);
  blue(`bondAddress: "${TimeBondDepository.address}", // TimeBondDepository`);
  blue(`reserveAddress: "${MIM}", // MIM`);


};
