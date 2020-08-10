# Redis & MongoDB architecture

## Redis (hash)

### channelList:

| Key      | Value desc.                                  | Ex value                                    |
| -------- | -------------------------------------------- | ------------------------------------------- |
| serverID | Obejct of user connected on channel (userID) | {6692443264093519884:[6688504720857759744]} |

### instanceList:

| Key      | Value desc.                       | Ex value         |
| -------- | --------------------------------- | ---------------- |
| serverID | Instance who own the voice router | '127.0.0.1:6579' |

------

## MongoDB

### users

> Main user collection

| Key            | Value desc.                                                  | Ex value                                                     |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| _id            | ID of the user                                               | 6688504720857759744                                          |
| status         | Status of the user (0->3)                                    | 3                                                            |
| username       | Username                                                     | MySuperUsername                                              |
| email          | Email                                                        | myemail@gmail.com                                            |
| password       | BCrypt hash of the password                                  |                                                              |
| userCode       | A code from 0001 to 9999                                     | 3659                                                         |
| friend         | Array of friends id                                          | [6688506771658506240]                                        |
| friendRequest  | Object with request sent and received (id)                   | {send:[], received:[6688954523106410496]}                    |
| server         | Array of servers id                                          | [6691698352003743744]                                        |
| logoUrl        | URL of the logo, relative to API url with a unique name      | /logo/logo/6688504720857759744/f8356ab7-6500-417e-ae30-ec9aab50a6c4.png |
| dmList         | Object with the list of ID with who the user talked and when last (timestamp) | [{id: 6688506771658506240, lastMessage:1596479644381}]       |
| dmFromEveryone | If the user can receive DM from non friend or non common server user | false                                                        |

### usernameList 

> List of all username for userCode

| Key      | Value desc.            | Ex value          |
| -------- | ---------------------- | ----------------- |
| username | Username               | "MySuperUsername" |
| pool     | Array of used userCode | [3659]            |

### serverList

> List of server

| Key      | Value desc.                                             | Ex value                                                     |
| -------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| _id      | Unique ID of the server                                 | 6691698352003743744                                          |
| name     | Name of the server                                      | My super server !                                            |
| logoUrl  | URL of the logo, relative to API url with a unique name | /server/6691698352003743744/2afed9e1-985a-404c-b8ad-62545be9bb64.png |
| owner    | ID of the owner                                         | 6688504720857759744                                          |
| invite   |                                                         |                                                              |
| members  | Array with object of userID and role of the  user       | [{id:6688504720857759744, role:2}]                           |
| channels | Array of all category                                   | See Category below                                           |
| bans     | Array of banned user                                    | [6688506771658506240]                                        |

Category:

| categoryName | Name of the category        | Kawai channels                                         |
| ------------ | --------------------------- | ------------------------------------------------------ |
| categoryId   | Unique ID of the category   | 6691698352003743745                                    |
| channelsList | Array with list of channels | [{id: 6692443264093519884, name:'Nani voice', type:1}] |

### invites

> List of all invite

| Key        | Value desc.              | Ex value            |
| ---------- | ------------------------ | ------------------- |
| invite     | Invite                   | 2KH7                |
| server     | Server of the invite     | 6691698352003743744 |
| author     | Author of the invite     | 6688504720857759744 |
| date       | When invite were created | 1596034512905       |
| ?unavaible | If the invite is deleted | true                |

### messages

> All messages

| Key       | Value desc.               | Ex value            |
| --------- | ------------------------- | ------------------- |
| _id       | Unique ID                 | 6692452397966426129 |
| serverId  | ID of the server          | 6691698352003743744 |
| channelId | ID of the channel         | 6692106738851643417 |
| userId    | ID of the author          | 6688504720857759744 |
| content   | Content                   | My first message !  |
| date      | When message were created | 1595604991428       |

### privateMessages

> All private messages

| Key     | Value desc.               | Ex value            |
| ------- | ------------------------- | ------------------- |
| fromId  | from who                  | 6688504720857759744 |
| toId    | to who                    | 6688506771658506240 |
| content | Content                   | Hey my friend ! :)  |
| date    | When message were created | 1596221814775       |

### nodeList

> Voice node list

| Key        | Value desc.                | Ex value  |
| ---------- | -------------------------- | --------- |
| ip         | ip of the node             | 127.0.0.1 |
| port       | port of the node           | 5459      |
| identifier | Simple name to identify it | node1     |