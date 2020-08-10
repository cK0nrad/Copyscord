# Discriminator for username

## How to do it ? (personal brainstorming for my different personality)

### 1. Random -> check
	We generate a random number (0001-9999) and then we check if this discriminator is already used
	if it's not used we use it or we generate another number (used in a first time but not really efficient if there's 9998 usernamen he will recheck every time until getting randomly #9999)

### 2. Username pool
	We use a mongo collection with each username and atribute it an array of number from 0001-9999
```json
{
 "username":"yeet",
 "pool": {0: false, [...], 8623: true, [...], 9999:false}
}
```

```
use 67.3kb per username, 1 000 000 different username will be ~70GB, too heavy to be used.
```

## 3. Method 2 but a bit different

	We use an collection and set it each USED discriminator, and whenever we unset it we remove it, for select one we generate a [1-> 9999] array and comapre it with the pool, then we just select random one from the comparaison array

```json
{
 "username":"yeet",
 "pool": [25,12,3]
}
```

```js
const FullArray = [0, ...9999]
let pool = FetchPool('yeetUsername') // [0,36,8456,231,56]
let avaible = compare(pool, FullArray) // [1, [...], 35, 37, [...], 55, 57, [...9999]]
let userCode = RandomSelect(avaible) // 3569
```

### 4. Pre shuffle a list

```
We just use method 2 and 3, but we set a document with preshuffled 0-9999, then when we use a number we remove it from the collection, and when we use another one we re-set it, too heavy too
```

```json
{
 "username":"yeet",
 "pool": [9956,3,6546,3386,1036, [...n=9999]]
}
```

I'm using the third method because i think it's time and data efficient, ~ 9ms to filter a full array so it's good for me and it's like 30byte with one entry

