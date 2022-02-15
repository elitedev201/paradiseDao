require('dotenv').config();
// truffle migrate --f 1 --to 1 --network avax
// truffle run verify UTOPERC20Token sUTOP UTOPStaking --network avax
const _UTOPERC20Token = artifacts.require("UTOPERC20Token");
const _sUTOP = artifacts.require("sUTOP");
const _wsUTOP = artifacts.require("wsUTOP");
const _UTOPStaking = artifacts.require("UTOPStaking");
// const _MIM = artifacts.require("DAI");

const chalk = require('chalk');
const yellow = function() { console.log(chalk.yellowBright(...arguments)) }
const magenta = function() { console.log(chalk.magenta(...arguments)) }
const cyan = function() { console.log(chalk.cyan(...arguments)) }
const red = function() { console.log(chalk.red(...arguments)) }
const blue = function() { console.log(chalk.blue(...arguments)) }
const green = function() { console.log(chalk.green(...arguments)) }


module.exports = async function (deployer, network, accounts) {

  green('main account: '+accounts);

  const epochLength = process.env.DEPLOY_EPOCH;
  const firstEpochNumber = process.env.DEPLOY_FIRST_EPOCH_FIRST;
  const firstEpochBlock = process.env.DEPLOY_FIRST_EPOCH_BLOCK;
  // green('MIM:  start');
  // let MIM_Contract;
  // let MIM = process.env.BOND; // movr
  // if (network == 'dev' || network.indexOf('test') != -1) {
  //   await deployer.deploy(_MIM, '1337');
  //   MIM_Contract = await _MIM.deployed();
  //   MIM = MIM_Contract.address;
  //   const CEM = web3.utils.toWei('100');
  //   await MIM_Contract.mint(accounts[0], CEM);
  // } else if (network == 'ftm') {
  //   MIM = '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e'; // ftm
  //   MIM_Contract = await _MIM.at(MIM);
  // } else {
  //   MIM_Contract = await _MIM.at(MIM);
  // }
  // yellow('MIM:  end');

  green('UTOPERC20Token: start');
  let UTOPERC20Token;
  if( ! process.env.DEPLOY_USE_TOKEN || network == 'dev' || network.indexOf('test') != -1 ){
    await deployer.deploy(_UTOPERC20Token);
    UTOPERC20Token = await _UTOPERC20Token.deployed(); 

    100000000000000

  }else{
    UTOPERC20Token = await _UTOPERC20Token.at(process.env.DEPLOY_USE_TOKEN);
  }
  yellow('UTOPERC20Token: end');

  green('sUTOP: start');
  await deployer.deploy(_sUTOP);
  const sUTOP = await _sUTOP.deployed();
  yellow('sUTOP. : end');

  green('wsUTOP: start');
  await deployer.deploy(_wsUTOP, sUTOP.address);
  const wsUTOP = await _wsUTOP.deployed();
  yellow('wsUTOP: end');

  green('UTOPStaking: start');
  await deployer.deploy(_UTOPStaking,
    UTOPERC20Token.address,
    sUTOP.address,
    28000,
    0,
    28000);
  const UTOPStaking = await _UTOPStaking.deployed();
  yellow('UTOPStaking: end');

  magenta("CONTRACTS")
  // green("- MIM: " + MIM);
  green("- UTOPERC20Token: " + UTOPERC20Token.address);
  green("- sUTOP: " + sUTOP.address);
  green("- wsUTOP: " + wsUTOP.address);
  green("- UTOPStaking: " + UTOPStaking.address);

};
