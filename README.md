# Failed ERC20 hack Demo
Unknown ERC20 contracts can potentially perform any actions within function that match the standard ERC20 interface (ABI).

## Scam 1
A common source of hack comes from the use of delegatecalls that allow a target contract (the one we "delegate" to), to
execute in the caller's context and especially modifies its storage.

<img src=https://miro.medium.com/max/1400/1*4OB3IwTF1AkW6zH3tJv8Tw.png width=500 />
<img src=https://miro.medium.com/max/2000/1*907YyYjEuAZCeLT9XiOA7A.png width=500 />

One could then think that it is possible for a contract to hide an approve within another by:
- deploying a scam ERC20 that matches the standard ABI
- overriding the approve function and delegatecall (to forward the right `msg.sender``) to a victim ERC20 contract to approve it

This doesn't work as the allowances in the caller contract (the scam contract) will be modified instead of the victim's.  
So the hack will have no effect. (See [test case](https://github.com/r1oga/demo-failed-erc20-hack/blob/df18ed55e0953f52c2be783e8d311a7d1d9bf3e8/test/scams.js#L44))

## Scam 2 - Scam 3
Performing native ETH `send`/`transfer` within other functions calls.
This doesn't work either. It is not possible to override `nonpayable` (defined in the parent contract without `payable`) functions
with the `payable` modifier.
The solidity contracts won't compile.

Try uncommenting the `transfer` function in [`Scam2.sol`](https://github.com/r1oga/demo-failed-erc20-hack/blob/df18ed55e0953f52c2be783e8d311a7d1d9bf3e8/contracts/Scam2.sol#L11) and [`Scam3.sol`](https://github.com/r1oga/demo-failed-erc20-hack/blob/df18ed55e0953f52c2be783e8d311a7d1d9bf3e8/contracts/Scam3.sol#L12) and run `yarn hardhat compile`. It will fail with errors like:
```
TypeError: Overriding function changes state mutability from "nonpayable" to "payable".
```

## Scam 4 - forcing out of gas error
Possible. But is not benefiting anyone. Not even the person who deployed the scam contract...

### Tests

```shell
yarn
yarn hardhat test
```
