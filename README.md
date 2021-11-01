# Testing app from command line

install bitcoincore
```
sudo snap install bitcoin-core
```

run daemon
```
> bitcoin-core.daemon -testnet
```

create wallet using bitcoincore client
```
> bitcoin-core.cli -testnet  createwallet blockchain_course_wallet
```

create a new address using bitcoincore client
```
> bitcoin-core.cli -testnet getnewaddress "" legacy

response:
mrdmfc2AAv46uA92up3y3thSrdY6FLD3MK
```

run app: 
```
> node app.js

response:
Server Listening for port: 8000
```

request genesis block
```
> curl -X GET -H 'Content-Type: application/json' -i http://localhost:8000/block/height/0

response:
{"hash":{"words":[-1807645493,-1429153589,-1078734019,-1055533501,-3377821,1125148913,-1463638552,-1022853813],"sigBytes":32},"height":0,"body":"7b2264617461223a2247656e6573697320426c6f636b227d","time":"1635786264","previousBlockHash":0}
```

request validation
```
> curl -X POST -H 'Content-Type: application/json' -i http://localhost:8000/requestValidation --data '{
 "address": "mrdmfc2AAv46uA92up3y3thSrdY6FLD3MK"
}'

response:
"n4exWRUwcs4HKy4xnakidoQ8Mfv8gmRuSm:1635785437:starRegistry"
```

sign message using bitcoincore client
```
> bitcoin-core.cli -testnet signmessage mrdmfc2AAv46uA92up3y3thSrdY6FLD3MK "mrdmfc2AAv46uA92up3y3thSrdY6FLD3MK:1635785688:starRegistry"

response:
IIkofuPN6NEssKVXko3PZUpRs4qo3rknXk5wIPe9CyAQSYNOvd+VHujvhTOHfLGIJ6t1uJmxMtTtlVUPTQQMhRw=
```

submit a star
```
> curl -X POST -H 'Content-Type: application/json' -i http://localhost:8000/submitStar --data '{
 "address": "mrdmfc2AAv46uA92up3y3thSrdY6FLD3MK",
 "message": "mrdmfc2AAv46uA92up3y3thSrdY6FLD3MK:1635785688:starRegistry",
 "signature": "IIkofuPN6NEssKVXko3PZUpRs4qo3rknXk5wIPe9CyAQSYNOvd+VHujvhTOHfLGIJ6t1uJmxMtTtlVUPTQQMhRw=",
 "star": {"name":  "Star1234"}
}'

response:
{"hash":{"words":[1502594005,-1792719776,1241902449,1018345843,-62498741,-1702493864,-296051841,-536412422],"sigBytes":32},"height":1,"body":"7b2261646472657373223a226d72646d666332414176343675413932757033793374685372645936464c44334d4b222c226d657373616765223a226d72646d666332414176343675413932757033793374685372645936464c44334d4b3a313633353738353638383a737461725265676973747279222c227369676e6174757265223a2249496b6f6675504e364e4573734b56586b6f33505a5570527334716f33726b6e586b3577495065394379415153594e4f76642b5648756a7668544f48664c47494a367431754a6d784d7454746c5655505451514d6852773d222c2273746172223a7b226e616d65223a225374617231323334227d7d","time":"1635785883","previousBlockHash":{"words":[-1648824837,-746669790,-976732701,1644200943,-2029712280,797144604,321970488,-1502114185],"sigBytes":32}}
```

retrieve stars by walllet address
```
> curl -X GET -H 'Content-Type: application/json' -i http://localhost:8000/blocks/mrdmfc2AAv46uA92up3y3thSrdY6FLD3MK

response:
[{"name":"Star1234"}]
```

validate chain
```
> curl -GET -H 'Content-Type: application/json' -i http://localhost:8000/validateChain

response:
Chain is valild.
```

[Original template project readme](Instructions.md)