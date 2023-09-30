const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("TokenLendingPlatform", function () {
    async function deployTokenLendingContract() {
    
        const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        const ERC20 = await ethers.getContractFactory("MyToken");
        const erc20 = await ERC20.deploy("TestToken", "TTK");
    
        const LendingPlatform = await ethers.getContractFactory("TokenLendingPlatform");
        const lendingPlatform = await LendingPlatform.deploy(100, erc20.target);
    
        await erc20.transfer(lendingPlatform.target, ethers.parseEther("1000"));
    
        return { lendingPlatform, erc20, owner, addr1, addr2 };
    }

    describe("borrowTokens", function() {
        
        it("Should allow borrowing tokens", async function () {
            const { lendingPlatform, erc20, addr1 } = await loadFixture(deployTokenLendingContract);
            
            await lendingPlatform.connect(addr1).borrowTokens({ value: ethers.parseEther("1") });
            
            expect(await erc20.balanceOf(addr1.address)).to.equal(ethers.parseEther("1"));
            const userLoanInfo =  await lendingPlatform.Loans(addr1.address)
            expect(userLoanInfo[2]).to.equal(ethers.parseEther("1"));
        });

        it("Should not allow borrowing more tokens than available", async function () {
            const { lendingPlatform, addr1 } = await loadFixture(deployTokenLendingContract);
            
            await expect(
                lendingPlatform.connect(addr1).borrowTokens({ value: ethers.parseEther("2000") })
            ).to.be.revertedWith("Not enough tokens in the contract");
        });

    });

    describe("repayTokenLoan", function() {

        it("Should allow repaying token loans with interest", async function () {
            const { lendingPlatform, erc20, addr1, owner } = await loadFixture(deployTokenLendingContract);
            
            await lendingPlatform.connect(addr1).borrowTokens({ value: ethers.parseEther("1") });

            await erc20.transfer(addr1.address, ethers.parseEther("1"));

            const owedAmount = await lendingPlatform.connect(addr1).getTotalRepaymentForLoan(addr1.address, ethers.parseEther("1"));
            await erc20.connect(addr1).approve(lendingPlatform.target, (ethers.parseEther("1.1")));

            expect(await lendingPlatform.connect(addr1).repayTokenLoan()).to.emit(lendingPlatform, 'TokenRepaid');

            const userTokenInfo = await lendingPlatform.Loans(addr1.address)
            expect(userTokenInfo[2]).to.equal(0);
        });

    });

    describe("getTotalRepaymentForLoan", function() {
        
        it("Should compute total repayment amount correctly", async function () {
            const { lendingPlatform, addr1 } = await loadFixture(deployTokenLendingContract);
            
            await lendingPlatform.connect(addr1).borrowTokens({ value: ethers.parseEther("1") });
            
            await time.increase(100)
            const totalRepay = await lendingPlatform.getTotalRepaymentForLoan(addr1.address, ethers.parseEther("1"));

            expect(totalRepay).to.be.above(ethers.parseEther("1"));  // As blocks have passed, some interest should have accrued.
        });

    });
})