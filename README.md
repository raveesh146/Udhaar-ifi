# Transform Your NFTs into Collateral with UDHAARifi, built on APTOS🚀

Unlock the power of your NFTs by turning them into collateral and accessing cryptocurrency loans effortlessly. No need to sell—lend your NFTs and gain instant liquidity within minutes!

---

## 📦 Contract Development Workflow

### Compile and Test the Contract

Use the following commands to compile and test the Move contract:

```bash
aptos move compile --dev
aptos move test
```
```
aptos init --network devnet

```
### Configure Publisher Profile and Address

```
PUBLISHER_PROFILE=default
PUBLISHER_ADDR=0x$(aptos config show-profiles --profile=$PUBLISHER_PROFILE | grep 'account' | sed -n 's/.*"account": "\(.*\)".*/\1/p')

```

### Deploy Contracts to Aptos Chain

#### Deploy your contract to the Aptos chain by upgrading the object package with the following command:

```
aptos move upgrade-object-package \
  --object-address $CONTRACT_OBJECT_ADDR \
  --named-addresses my_addrx=$CONTRACT_OBJECT_ADDR \
  --profile $PUBLISHER_PROFILE \
  --assume-yes

```

### Frontend Setup
#### Once your contract is successfully deployed, set up the frontend by following these steps:
```
cd frontend
npm install
npm run dee
```

### Now you can interact with your smart contract and start lending NFTs as collateral! 🚀






