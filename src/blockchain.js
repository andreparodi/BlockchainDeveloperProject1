/**
 *                          Blockchain Class 
 */

const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./block.js');
const bitcoinMessage = require('bitcoinjs-message');

class Blockchain {

    /**
     * Constructor of the class, you will need to setup your chain array and the height
     * of your chain (the length of your chain array).
     */
    constructor() {
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    /**
     * This method will check for the height of the chain and if there isn't a Genesis Block it will create it.
     */
    async initializeChain() {
        if( this.height === -1){
            let block = new BlockClass.Block({data: 'Genesis Block'});
            await this._addBlock(block);
        }
    }

    /**
     * Utility method that return a Promise that will resolve with the height of the chain
     */
    getChainHeight() {
        return new Promise((resolve, reject) => {
            resolve(this.height);
        });
    }

    /**
     * _addBlock(block) will store a block in the chain
     * @param {*} block 
     * The method will return a Promise that will resolve with the block added
     * or reject if an error happen during the execution.
     */
    _addBlock(block) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            self.height++;
            let previous_hash = 0;
            if (self.height > 0) {
               previous_hash = self.chain[self.height - 1].hash;
            }
            block.previousBlockHash = previous_hash;
            block.time =  new Date().getTime().toString().slice(0, -3);
            block.height = self.height;
            block.hash = block.calculateHash();

            self.chain[self.height] = block;
            resolve(block);
        });
    }

    /**
     * The requestMessageOwnershipVerification(address) method
     * will allow you  to request a message that you will use to
     * sign it with your Bitcoin Wallet (Electrum or Bitcoin Core)
     * @param {*} address 
     */
    requestMessageOwnershipVerification(address) {
        return new Promise((resolve) => {
            //TODO  not sure about this
            resolve(`${address}:${new Date().getTime().toString().slice(0, -3)}:starRegistry`)
        });
    }

    /**
     * The submitStar(address, message, signature, star) method
     * will allow users to register a new Block with the star object
     * into the chain. This method will resolve with the Block added or
     * reject with an error.
     * @param {*} address 
     * @param {*} message 
     * @param {*} signature 
     * @param {*} star 
     */
    submitStar(address, message, signature, star) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            let time = parseInt(message.split(':')[1]);
            let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
            if (currentTime - time < 5*60) {
                let verified = bitcoinMessage.verify(message, address, signature);
                if  (verified) {
                    let  data = {"address": address, "message": message, "signature": signature, "star": star};
                    let block = new BlockClass.Block(data);
                    try {
                        block = this._addBlock(block);
                        resolve(block);
                    } catch (e) {
                        console.log("Error: ", error);
                        reject(error);
                    }
                } else {
                    console.log("Message could not be verified.");
                    reject(new Error("Message could not be verified."));
                }
            } else {
                console.log("Time elaspsed since creation of message over 5 minutes");
                reject(new Error("Time elaspsed since creation of message over 5 minutes"));
            }
            

        });
    }

    /**
     * This method will return a Promise that will resolve with the Block
     *  with the hash passed as a parameter.
     * @param {*} hash 
     */
    getBlockByHash(hash) {
        let self = this;
        return new Promise((resolve, reject) => {
           let blocks = self.chain.filter(b => b.hash == hash);
           if (block.length == 1) {
                resolve(blocks[0]);
           } else if (block.length > 1) {
               reject("Found more than one matching block. Big problem! Duplicates chain.");
           } else {
               reject("Couldn't find a block with hash " + hash);
           }
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block object 
     * with the height equal to the parameter `height`
     * @param {*} height 
     */
    getBlockByHeight(height) {
        let self = this;
        return new Promise((resolve, reject) => {
            let block = self.chain.filter(p => p.height === height)[0];
            if(block){
                resolve(block);
            } else {
                resolve(null);
            }
        });
    }

    /**
     * This method will return a Promise that will resolve with an array of Stars objects existing in the chain 
     * and are belongs to the owner with the wallet address passed as parameter.
     * @param {*} address 
     */
    getStarsByWalletAddress (address) {
        let self = this;
        let stars = [];
        return new Promise((resolve, reject) => {
            self.chain.forEach(async (block) => {
                let blockData =  await block.getBData();
                if (console) {
                    if (blockData['address'] == address)
                    {
                        stars.push(blockData['star']);
                    }
                }
            });
            resolve(stars);
        });
    }

    /**
     * This method will return a Promise that will resolve with the list of errors when validating the chain.
     */
    validateChain() {
        let self = this;
        let errorLog = [];
        return new Promise(async (resolve, reject) => {
            let previousBlockHash = 0; // genesis  block
            for (let i = 0; i <= self.height; i++)
            {
                let block = self.chain[i];
                let validated = await block.validate();
                if (!validated) {
                    reject(new Error("Invalid block found at height: " +  i));
                    return;
                }
                let validPreviousHash = block.previousBlockHash == previousBlockHash;
                if (!validPreviousHash) {
                    reject(new Error("Invallid previous hash at height: " + i));
                    return;
                }
                previousBlockHash = block.hash;
            }
            resolve(true);
        });
    }

}

module.exports.Blockchain = Blockchain;   