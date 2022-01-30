
 var ParaERC20Token = artifacts.require("/Users/kisharora/Developer/web3/paradiseDao/contracts/ParaERC20.sol");

 contract('ParaERC20Token', (accounts) => {
     var creatorAddress = accounts[0];
     var firstOwnerAddress = accounts[1];
     var secondOwnerAddress = accounts[2];
     var externalAddress = accounts[3];
     var unprivilegedAddress = accounts[4]
     /* create named accounts for contract roles */
 
     before(async () => {
         /* before tests */
     })
     
     beforeEach(async () => {
         /* before each context */
     })
 
     it('should revert if ...', () => {
         return ParaERC20Token.deployed()
             .then(instance => {
                 return instance.publicOrExternalContractMethod(argument1, argument2, {from:externalAddress});
             })
             .then(result => {
                 assert.fail();
             })
             .catch(error => {
                 assert.notEqual(error.message, "assert.fail()", "Reason ...");
             });
         });
 
     context('testgroup - security tests - description...', () => {
         //deploy a new contract
         before(async () => {
             /* before tests */
             const newParaERC20Token =  await ParaERC20Token.new()
         })
         
 
         beforeEach(async () => {
             /* before each tests */
         })
 
         
 
         it('fails on initialize ...', async () => {
             return assertRevert(async () => {
                 await newParaERC20Token.initialize()
             })
         })
 
         it('checks if method returns true', async () => {
             assert.isTrue(await newParaERC20Token.thisMethodShouldReturnTrue())
         })
     })
 });
 