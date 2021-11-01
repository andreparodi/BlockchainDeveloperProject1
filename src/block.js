/**
 *                          Block class
 */

const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

class Block {

    // Constructor - argument data will be the object containing the transaction data
	constructor(data){
		this.hash = null;                                           // Hash of the block
		this.height = 0;                                            // Block Height (consecutive number of each block)
		this.body = Buffer.from(JSON.stringify(data)).toString('hex');   // Will contain the transactions stored in the block, by default it will encode the data
		this.time = 0;                                              // Timestamp for the Block creation
		this.previousBlockHash = null;                              // Reference to the previous Block Hash
    }

    calculateHash() {
        return SHA256(JSON.stringify({...this,  "hash": null}));
    }
    
    /**
     *  validate() method will validate if the block has been tampered or not.
     *  Been tampered means that someone from outside the application tried to change
     *  values in the block data as a consecuence the hash of the block should be different.
     */
    validate() {
        let self = this;
        return new Promise((resolve, reject) => {
            let currentHash =  self.hash;
            let hash = self.calculateHash();
            if (hash.toString() == currentHash.toString())
            {
                resolve(self);
            }
            else
            {
                reject(new Error("Hashes don't match. Invalid Block."));
            }
        });
    }

    /**
     *  Auxiliary Method to return the block body (decoding the data)
     */
    getBData() {
        let self =  this;
        return new Promise((resolve, reject) =>{
            let blockDataStr = hex2ascii(self.body);
            let blockDataObj = JSON.parse(blockDataStr);

            if (blockDataObj == 'Genesis Block') {
                reject('No block data. Genesis block');
            }
            else {
                resolve(blockDataObj)
            }
        })
    }

}

module.exports.Block = Block;                    // Exposing the Block class as a module