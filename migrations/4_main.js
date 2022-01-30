require('dotenv').config();
// truffle migrate --f 4 --to 4 --network avax
// truffle run verify UtopiaBondDepository --network avax
const _UTOPERC20Token = artifacts.require("UTOPERC20Token");
const _sUTOP = artifacts.require("sUTOP");
const _UTOPStaking = artifacts.require("UTOPStaking");
const _StakingHelper = artifacts.require("StakingHelper");
const _UtopiaTreasury = artifacts.require("UtopiaTreasury");
const _MIM = artifacts.require("DAI");
const _StakingWarmup = artifacts.require("StakingWarmup");
const _UtopiaBondingCalculator = artifacts.require("UtopiaBondingCalculator");
const _UtopiaBondDepository = artifacts.require("UtopiaBondDepository");
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

  const ZERO = '0x0000000000000000000000000000000000000000';

  green('MIM:  start');
  let MIM_Contract;
  let MIM = process.env.DEPLOY_BOND_PRINCIPAL; // movr
  if (network == 'dev' || network.indexOf('test') != -1) {
    MIM_Contract = await _MIM.deployed();
    MIM = MIM_Contract.address;
  } else if (network == 'ftm') {
    MIM = '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e'; // ftm
  }
  let UTOPERC20Token;
  if( ! process.env.DEPLOY_USE_TOKEN || network == 'dev' || network.indexOf('test') != -1 ){
    UTOPERC20Token = await _UTOPERC20Token.deployed();
  }else{
    UTOPERC20Token = await _UTOPERC20Token.at(process.env.DEPLOY_USE_TOKEN);
  }
  const sUTOP = await _sUTOP.deployed();
  const UTOPStaking = await _UTOPStaking.deployed();
  const StakingHelper = await _StakingHelper.deployed();
  const UtopiaTreasury = await _UtopiaTreasury.deployed();
  const StakingWarmup = await _StakingWarmup.deployed();

  const UtopiaBondingCalculator = await _UtopiaBondingCalculator.deployed();
  const Distributor = await _Distributor.deployed();

  await Distributor.distribute();

  const DAO = await _DAO.deployed();

  await deployer.deploy(_UtopiaBondDepository,
      UTOPERC20Token.address,
      MIM,
      UtopiaTreasury.address,
      DAO.address,
      ZERO);

  const controlVariable = '40',
        vestingTerm = process.env.DEPLOY_BOND_VESTING_TERM,
        minimumPrice = process.env.DEPLOY_BOND_PRICE,
        maxPayout = process.env.DEPLOY_REWARD_PCT,
        fee = process.env.DEPLOY_BOND_FEE,
        maxDebt = process.env.DEPLOY_BOND_MAX_DEBIT;
  const UtopiaBondDepository = await _UtopiaBondDepository.deployed();
  await UtopiaBondDepository.initializeBondTerms(
      controlVariable,
      minimumPrice,
      maxPayout,
      fee,
      maxDebt,
      vestingTerm
  );
  await UtopiaBondDepository.setStaking(StakingHelper.address, true);

  magenta("CONTRACTS")
  green("- MIM: " + MIM);
  green("- UTOPERC20Token: " + UTOPERC20Token.address);
  green("- sUTOP: " + sUTOP.address);
  green("- UTOPStaking: " + UTOPStaking.address);
  green("- StakingHelper: " + StakingHelper.address);
  green("- UtopiaTreasury: " + UtopiaTreasury.address);
  green("- StakingWarmup: " + StakingWarmup.address);
  green("- UtopiaTreasury: " + UtopiaTreasury.address);
  green("- UtopiaBondingCalculator: " + UtopiaBondingCalculator.address);
  green("- Distributor: " + Distributor.address);
  green("- UtopiaBondDepository: " + UtopiaBondDepository.address);

};
