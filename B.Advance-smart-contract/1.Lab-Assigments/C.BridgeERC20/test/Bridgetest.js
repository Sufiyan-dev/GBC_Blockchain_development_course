const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const tokenAbi = require('../Abis/Token.json');
const bridgeAbi = require('../Abis/TokenBridge.json');
const { ethers } = require("hardhat");

describe("Bridge", function () {
    async function deployBridgeAndToken() {
        // Contracts are deployed using the first signer/account by default
        const [owner, manager, otherAccount] = await ethers.getSigners();


        // const Token = await ethers.getContractAt(tokenAbi.abi,"0x0413CE3624e2CABAc981B2cCD9bDd4B99bE25908");
        // const Bridge = await ethers.getContractAt(bridgeAbi.abi,"0x7DC09275BF9891a5C2F65999afE85A52D7e80673");
        const token = await ethers.getContractFactory('Token');
        const Token = await token.deploy("GBC Token","GBCT")
        const bridge = await ethers.getContractFactory('TokenBridge');
        const Bridge = await bridge.deploy(await Token.getAddress(),manager.address);

        await Token.updateOrSetManager(await Bridge.getAddress());

        return { Token, Bridge, owner, manager, otherAccount};
    }

    describe("Token", () => {
        describe("deployment",() => {
            it("should deployer the owner",async () => {
                const { Token, owner } = await loadFixture(deployBridgeAndToken);

                const ownerAddress = await Token.owner();

                expect(ownerAddress).to.be.equal(owner.address);
            })
            it("should mint 1000 tokens to the owner and the totalsupply", async () => {
                const { Token, owner } = await loadFixture(deployBridgeAndToken);

                
                const balanceOfOwner = await Token.balanceOf(owner.address);


                expect(ethers.parseEther("1000")).to.be.equal(balanceOfOwner);

                const totalsupply = await Token.totalSupply();

                expect(totalsupply).to.be.equal(balanceOfOwner);
            })
        })
        describe("minting",() => {
            it("should only allow owner or manager to mint tokens",async () => {
                const {Token, owner, manager, otherAccount} = await loadFixture(deployBridgeAndToken);

                expect(await Token.mint(owner.address, ethers.parseEther("1"))).not.to.be.reverted;
                // expect(await Token.connect(manager).mint(manager.address, ethers.parseEther("1"))).not.to.be.reverted;
                expect(Token.connect(otherAccount).mint(otherAccount.address, ethers.parseEther("1"))).to.be.revertedWith('onylbridgeManager or owner can mint');
            })
        })
        describe("burning",() => {
            it("should allow anyone to burn tokens", async () => {
                const {Token, otherAccount, owner, manager} = await loadFixture(deployBridgeAndToken);
                await Token.mint(otherAccount.address,ethers.parseEther("1"));
                expect(await Token.connect(otherAccount).burn(ethers.parseEther("1"))).not.to.be.reverted;
            })
        })
        describe("updating",() => {
            it("should allow only owner to update manager",async () => {
                const { Token, otherAccount } = await loadFixture(deployBridgeAndToken);

                expect(Token.connect(otherAccount).updateOrSetManager(otherAccount.address)).to.be.revertedWith('only owner!');

                expect(await Token.updateOrSetManager(otherAccount.address)).not.to.be.reverted;
            })
        })
    })
    describe("Bridge",() => {
        describe("deployment",() => {
            it("should make deployer the admin", async () => {
                const { Bridge, owner } = await loadFixture(deployBridgeAndToken);

                const admin = await Bridge.bridgeAdmin();

                expect(admin).to.be.equal(owner.address);
            })
        })
        describe("minting bridge tokens",() => {
            it("should only allow manager to mint the received bridge tokens",async () => {
                const {Token, Bridge, manager, owner, otherAccount} = await loadFixture(deployBridgeAndToken);

                expect(Bridge.connect(owner).mintReceivedTokens(owner.address, ethers.parseEther("1"),await Token.getAddress())).to.be.revertedWith('Only the bridge manager can mint');
                expect(Bridge.connect(manager).mintReceivedTokens(manager.address, ethers.parseEther("1"), await Token.getAddress())).not.to.be.revertedWith('Only the bridge manager can mint');
                expect(Bridge.connect(otherAccount).mintReceivedTokens(otherAccount.address, ethers.parseEther("1"),await Token.getAddress())).to.be.revertedWith('Only the bridge manager can mint');
            })
            it("should allow only the specified token to mint",async () => {
                const {Token, Bridge, manager, owner, otherAccount} = await loadFixture(deployBridgeAndToken);

                expect(Bridge.connect(manager).mintReceivedTokens(manager.address, ethers.parseEther("1"), otherAccount.address)).to.be.revertedWith('Token not supported for bridging')
            })
            it("should mint only the specified amount to the specified user", async () => {
                const {Token, Bridge, manager, owner, otherAccount} = await loadFixture(deployBridgeAndToken);

                const balanceOfUserBefore = await Token.balanceOf(manager.address);
                expect(balanceOfUserBefore).to.be.equal(0);

                const mintTokens = await Bridge.connect(manager).mintReceivedTokens(manager.address,ethers.parseEther("1"), await Token.getAddress());

                const balanceOfUser = await Token.balanceOf(manager.address);

                expect(balanceOfUser).to.be.equal(ethers.parseEther("1"));
            })
            it("should emit event when minting bridged tokens",async () => {
                const {Token, Bridge, manager, owner, otherAccount} = await loadFixture(deployBridgeAndToken);

                expect(await Bridge.connect(manager).mintReceivedTokens(manager.address,ethers.parseEther("1"), await Token.getAddress())).to.emit(Bridge,'TokensReceived');
            })
        })
        describe("transfer token to bridge",() => {
            it("should allow anyone to bridge token",async() => {
                const {Token, Bridge, manager, owner, otherAccount} = await loadFixture(deployBridgeAndToken);

                await Token.approve(await Bridge.getAddress(),ethers.parseEther("1"));

                expect(await Bridge.sendTokens(await Token.getAddress(), ethers.parseEther("1"))).not.to.be.reverted;
            })
            it("should only allowed to bridge tokens if the that tokens managers addresses is set", async () => {
                const { Bridge, manager, owner, otherAccount} = await loadFixture(deployBridgeAndToken);

                const NewToken = await ethers.getContractFactory("Token");
                const newToken = await NewToken.deploy("GBC token","GBCT");

                await Bridge.updateToken(await newToken.getAddress());

                await newToken.approve(await Bridge.getAddress(),ethers.parseEther("1"));

                expect(Bridge.sendTokens(await newToken.getAddress(), ethers.parseEther("1"))).to.be.revertedWith('manager not set yet')
            })
            it("should only accept specified token only", async () => {
                const { Bridge} = await loadFixture(deployBridgeAndToken);

                const NewToken = await ethers.getContractFactory("Token");
                const newToken = await NewToken.deploy("GBC token","GBCT");

                await newToken.approve(await Bridge.getAddress(), ethers.parseEther("1"));

                expect(Bridge.sendTokens(await newToken.getAddress(),ethers.parseEther("1"))).to.be.revertedWith('Token not supported for bridging')
            })
            it("should check that user have approved for the specified amount", async () => {
                const {Token, Bridge, manager, owner, otherAccount} = await loadFixture(deployBridgeAndToken);

                expect(Bridge.sendTokens(await Token.getAddress(), ethers.parseEther("1"))).to.be.revertedWith('Insufficient token allowance"')
            })
        })
        describe("confirm tokens are received", () => {
            it("should allow only manager to confirm token recieve", async () => {
                const { Token, Bridge, manager, otherAccount, owner } = await loadFixture(deployBridgeAndToken);

                expect(Bridge.confirmTokenDelivery(otherAccount.address, ethers.parseEther("1"),await Token.getAddress())).to.be.revertedWith('Only the bridge manager can confirm');

                expect(await Bridge.connect(manager).confirmTokenDelivery(otherAccount.address, ethers.parseEther("1"), await Token.getAddress())).not.to.be.reverted;
            })
            it("should support only specified token ", async () => {
                const { Token, Bridge, manager, otherAccount, owner } = await loadFixture(deployBridgeAndToken);

                const NewToken = await ethers.getContractFactory("Token");
                const newToken = await NewToken.deploy("GBC token","GBCT");
                const setManagerTxn = await newToken.updateOrSetManager(await Bridge.getAddress());

                expect(Bridge.connect(manager).confirmTokenDelivery(otherAccount.address, ethers.parseEther("1"), await newToken.getAddress())).to.be.revertedWith('Token not supported for bridging');
                expect(await Bridge.connect(manager).confirmTokenDelivery(otherAccount.address, ethers.parseEther("1"), await Token.getAddress())).not.to.be.reverted;
            })
            it("should update the state of confirmed tokens in user", async () => {
                const { Token, Bridge, manager, otherAccount, owner } = await loadFixture(deployBridgeAndToken);

                const userStateBefore = await Bridge.userTokenData(otherAccount.address, await Token.getAddress());

                await Bridge.connect(manager).confirmTokenDelivery(otherAccount.address, ethers.parseEther("1"), await Token.getAddress())

                const userStateAfter = await Bridge.userTokenData(otherAccount.address, await Token.getAddress());

                expect(userStateAfter[1]).to.be.greaterThan(userStateBefore[1]);
                expect(userStateAfter[1]).to.be.equal(ethers.parseEther("1"));
            })
            it("should emit event when there is token bridge get confirmed", async () => {
                const { Token, Bridge, manager, otherAccount, owner } = await loadFixture(deployBridgeAndToken);

                expect(await Bridge.connect(manager).confirmTokenDelivery(otherAccount.address, ethers.parseEther("1"), await Token.getAddress())).to.emit(Bridge,'TokensConfirmed')
            })
        })
        describe("updating", () => {
            it("should allow only owner to update token address", async () => {
                const { Token, Bridge, manager, otherAccount, owner } = await loadFixture(deployBridgeAndToken);

                const NewToken = await ethers.getContractFactory("Token");
                const newToken = await NewToken.deploy("GBC token","GBCT");
                const setManagerTxn = await newToken.updateOrSetManager(await Bridge.getAddress());

                expect(Bridge.connect(manager).updateToken(await newToken.getAddress())).to.be.revertedWith('only owner can update ');
                expect(await Bridge.updateToken(await newToken.getAddress())).not.to.be.reverted;
            })
            it("should allow only owner to update manager address", async () => {
                const { Token, Bridge, manager, otherAccount, owner } = await loadFixture(deployBridgeAndToken);

                expect(Bridge.connect(manager).updateManager(otherAccount.address)).to.be.revertedWith('only owner can update ');
                expect(await Bridge.updateManager(otherAccount.address)).not.to.be.reverted;
            })
        })
    })
})