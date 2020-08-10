# How to generate invite ?

## 1. Randomize and check

```
Coule be use but with a large amount of data it's boring and as the amount increase the risk of collide rise too so it's must be avoided
```

## 2. Pseudo randomize

```
We generate 3 random: [[0-9][a-z][A-Z]] (ex: Ze2), then we just check the invite collection length (ex: 23265).
Then we use this length to generate char (modulo and divide) 'f36' and we get Ze2f36
To avoid to have the same invites twice, when we delete an invite we just set it to unavaible and when we create a new one we search for an avaible invite, genretate a new one and delete the invite unused (if we found an unused one).
(We don't reuse the invite to prevent someone to join a random server with an expirated invite)
```

```js
const prefix = randomString(3) //Ze2
const collectionLength = getCollectionLength('invite') //23265
const invite = generateInvite(collectionLength) // f36
const finalInvite = prefix + invite //Ze2f36
```

