# Payloads 

## What is payload

## Payload types

## How to create a payload

There is several ways to create a payload. Most of the time you'll need to use only the first one.

1. Payload instance gets instanciated when you setting type for a transaction:
```javascript
var Transaction = require('@dashevo/dashcore-lib');
var transaction = new Transaction().setType(Transaction.TYPES.TRANSACTION_SUBTX_REGISTER);
transaction.extraPayload.setPubkeyId(pubKeyId);
```
2. You can create payload using factory method:
```javascript
var Payload = require('@dashevo/dashcore-lib').Transaction.Payload;
var payload = Payload.create(Transaction.TYPES.TRANSACTION_SUBTX_REGISTER);
payload.setPubKeyId(pubKeyId);
```
3. You can create instance of payload using `new` keyword:
```javascript
var SubTxRegisterPayload = require('@dashevo/dashcore-lib').Transaction.Payload.SubTxRegisterPayload;
var payload = new SubTxRegisterPayload().pubKeyId(pubKeyId);
```

## Payload types
There are several payload types: 

### SubTxRegisterPayload
### SubTxTransitionPayload
### CoinbasePayload 

