const Joi = require('joi');

const newTxnSchema  = Joi.object({
    source: Joi.string().length(42).required(),
    destination: Joi.ref('source'),
    amount: Joi.number().required(),
    status: Joi.bool().required(),
    gasUsed: Joi.number().required(),
    receiptHash: Joi.string().length(66).required()
});

const existTxnSchema = Joi.object({
    receiptHash: Joi.string().length(66).required(),
    source: Joi.string().length(42),
    destination: Joi.ref('source')
});

const validateNewTxn = (txnDataObj) => {
    const data = newTxnSchema.validate(txnDataObj);
    console.log('validation for new txn ',data);

    if(data.error){
        return { status: data.error.isJoi, message: data.error.message};
    } else {
        return { status: false, message: 'pass'};
    }
    
};

const validateExistingTxn = (txnDataObj) => {
    const data = existTxnSchema.validate(txnDataObj);
    console.log('validation for existing txn ',data);


    if(data.error){
        logger.silly(data);
        return {status: data.error.isJoi, message: data.error.message};
    } else {
        return { status: false, message: 'pass'};
    }
};


module.exports = {validateNewTxn, validateExistingTxn}