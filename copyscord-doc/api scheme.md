#  Authorization

## /api/authorize

### GET
> ```json
> {"username":"myusername", "password":"mypass"}
> ```
```json
{
	"loginToken": "jbsdd456s4df5654v89s.q5f48230515523231.kqsdkmqsdsqdqs4d44445445"
}
```

## Use token

> Header= Authorization:loginToken

# User

## /api/user

### POST

> ```json
> {"email":"MyEmail@email.com", "username": "MySuperUsername", "password": "azerty"}
> ```

```json
{
	"id": 64476498778964,
    "username": "MySuperUsername",
    "email": "MyEmail@email.com",
    "userCode": 6583
}
```

### ## /api/user/{userID}

### GET

```json
{
    "id":"64476498778964",
    "username":"MisterMe"
    "userCode": 6583
    "logoUrl":"/logo/64476498778964/azeza-54654-azez.png"
    "areFriends":false
    "friendReqiested":true
    "commonFriends": []
    "commonServers": []
}
```

# Client:

## /api/client

### GET

```json
{
	"id": 64476498778964,
    "username": "MySuperUsername",
    "userCode": 6565,
    "status": 0
}
```
### PUT

> ```json
> {"username": "MyNewSuperUsername" (, "password":"azerty", "newpassword":"azert")}
> ```

```json
{
 "username": "MyNewSuperUsername",
 "userCode": 1561,
 "updated": true
}
```

## /api/client/logo

### GET

```json
{
    "logoUrl": "/logo/64476498778964/azeza-54654-azez.png"
}
```

### PUT

> ```json
> {"logo": data}
> ```

```json
{
    "logoUrl": "/logo/64476498778964/azeza-54654-azez.png",
    "updated": true
}
```

## /api/client/servers

### POST

> ```json
> {"invitation": "0Ga5VR"}
> ```

```json
{
    "id": 64476498778964,
    "serverName": "mysuperserver",
    "joined": true
}
```

### DELETE

> ```json
> {"id": 64476498778964}
> ```

```json
{
    "serverName" : "Server 1",
    "leaved" : true
}
```

## /api/client/status

### GET

```json
{
	"status": 0
}
```

### PUT

> ```json
> {status:0|1|2|3}
> ```

```json
{
	"status": 0
}
```

## /api/client/dmable

### GET

```json
{
	"dmFromEveryone": 0
}
```

### PUT

> ```json
> {'dmFromEveryone':0|1}
> ```

```json
{
	"dmFromEveryone": 1
}
```

## 

## /api/client/dm

### GET

```json
[
	{
    	"id": 64476498778964,
    	"name": "sdfs",
    	"logoUrl": "/logo/64476498778964/azeza-54654-azez.png",
	},
	{
    	"id": 64476498778964,
    	"name": "sdfs",
    	"logoUrl": "/logo/64476498778964/azeza-54654-azez.png",
	},
]
```

## /api/client/dm/{userID}

### GET 

> ```json
> {limit:  50 (max 500)}
> ```

```json
[
  {
    "id": 64476498778964,
    "authorId": 64476498778964,
    "username": "SomeOne",
    "userLogo": "/logo/64476498778964/azeza-54654-azez.png",
    "date": 1565516545652,
    "content": "leleleel"
  },
  {
    "id": 64476498778964,
    "authorId": 64476498778964,
    "username": "MySuperUsername",
    "userLogo": "/logo/64476498778964/azeza-54654-azez.png",
    "date": 1565516545652,
    "content": "leleleel"
  }
]
```

### POST 

>```json
>{message:  "leleleel"}
>```

```json
{
  "id": 64476498778964,
  "to": 64476498778964,
  "content": "leleleel"
  "author": 64476498778964,
}
```

### PUT 

> ```json
> {id:  64476498778964, content: "Leleleleazeraze"}
> ```

```json
{
  "id": 64476498778964,
  "content": "leleleel",
  "newContent": "Leleleleazeraze,
  "author": 64476498778964
}
```

### DELETE

```json
{
  "id": 64476498778964
}
```

## /api/client/dm/{userID}/{messageID}

### DELETE 

```json
{
  "id": 64476498778964
}
```

# Friends

## /api/friends
### GET
```json
[
  {
    "id": 64476498778964,
    "name": "sdfs",
    "code": 6525,
    "logoUrl": "/logo/64476498778964/azeza-54654-azez.png",
    "status": 2
  },
  {
    "id": 64476498778964,
    "name": "sdfs",
    "code": 6525,
    "logoUrl": "/logo/64476498778964/azeza-54654-azez.png",
    "status": 2
  },
  {
    "id": 64476498778964,
    "name": "sdfs",
    "code": 6525,
    "logoUrl": "/logo/64476498778964/azeza-54654-azez.png",
    "status": 2
  },
  {
    "id": 64476498778964,
    "name": "sdfs",
    "code": 6525,
    "logoUrl": "/logo/64476498778964/azeza-54654-azez.png",
    "status": 2
  },
  {
    "id": 64476498778964,
    "name": "sdfs",
    "code": 6525,
    "logoUrl": "/logo/64476498778964/azeza-54654-azez.png",
    "status": 2
  }
]
```
### POST
> ```json
> {"username": "MySuperUsername", "userCode": "6543"}
> OR
> {"userId": 64476498778964}
> ```

```json
{
    "friendShip" : 0|1|2 (0: not friend, 1: friend requested, 2: friends)
}
```
### DELETE
> ```json
> {"username": "MySuperUsername","userCode": "6543"}
> OR
> {"userId": 64476498778964}
> ```
```json
{
    "friendShip" : 0 (0: not friend, 1: friend requested, 2: friends)
}
```
## /api/friends/request

### GET

```json
{
	"received": {
		{
        	 "id": 45665465456566,
			"username": "MySuperUsername",
        	 "usercode": "6545"
		}
	},
	"sent": {
		{
        	 "id": 45665465456566,
			"username": "MySuperUsername2",
        	 "usercode": "6545"
		}
	}
}
```

## /api/friends/request/{userID}

### DELETE

```json
{
  "id":64476498778964
}
```

## /api/friends/{id}

### GET

```json
{
    "id": 64476498778964,
    "name": "sdfs",
    "code": 6525,
    "logoUrl": "/logo/64476498778964/azeza-54654-azez.png",
    "status": 2
}
```

# Server :

## /api/server:

### GET

```json
[
  {
    "id": 64476498778964,
    "name": "server 1",
    "logoUrl": "/logo/64476498778964/azeza-54654-azez.png",
    "members": [
      {
        "id": 64476498778964,
        "username": "User1",
        "code": "6654",
        "logoUrl": "/logo/64476498778964/azeza-54654-azez.png"
      },
      {
        "id": 64476498778964,
        "username": "User2",
        "code": "6654",
        "logoUrl": "/logo/64476498778964/azeza-54654-azez.png"
      }
    ],
    "channels": [
      {
        "categoryName": "cat1",
        "categoryId": 64476498778964,
        "channelsList": [
          {
            "name": "test",
            "type": 0,
            "id": 64476498778964
          },
          {
            "name": "test",
            "type": 1,
            "id": 64476498778964
          },
          {
            "name": "test",
            "type": 0,
            "id": 64476498778964
          }
        ]
      }
    ]
  }
]
```
###  POST

> ```json
> {"name": "mysuperserver"}
> ```

```json
{
    "id": 64476498778964,
    "owner": 64476498778964,
    "serverName": "mysuperserver" 
}
```

## /api/server/join

### POST

> ```json
> {"invitation": "GhL1"}
> ```

```json
{
   "serverName": "My super server !"
}
```

## /api/server/{serverID}

### GET

```json
{
  "id": 64476498778964,
  "name": "server 1",
  "logoUrl": "/logo/64476498778964/azeza-54654-azez.png",
  "users": [
    {
      "id": 64476498778964,
      "username": "azerty",
      "code": "6654",
      "logoUrl": "/logo/64476498778964/azeza-54654-azez.png"
    },
    {
      "id": 64476498778964,
      "username": "azerty",
      "code": "6654",
      "logoUrl": "/logo/64476498778964/azeza-54654-azez.png"
    }
  ],
  "channels": [
    {
      "categoryName": "cat1",
      "categoryId": 64476498778964,
      "channelsList": [
        {
          "name": "test",
          "type": 0,
          "id": 64476498778964
        },
        {
          "name": "test",
          "type": 0,
          "id": 64476498778964
        },
        {
          "name": "test",
          "type": 0,
          "id": 64476498778964
        }
      ]
    }
  ]
}
```
### DELETE

```json
{
	"id":2114444145
}
```

### POST

> ```json
> {"name": "yeet"}
> ```

```json
{
	"id":64476498778964,
	"name": 'yeet'
}
```

## /api/server/{serverID}/leave/

### DELETE

```json
{
 "serverName": "My super server !"
}
```

## /api/server/{serverID}/channels

### GET

```json
[
  {
    "name": "test",
    "type": 0,
    "id": 64476498778964
  },
  {
    "name": "test",
    "type": 0,
    "id": 64476498778964
  },
  {
    "name": "test",
    "type": 1,
    "id": 64476498778964
  }
]
```
## /api/server/{serverID}/category

### GET

```json
[{
      "name":"test",
      "id": 64476498778964,
}]
```

### POST 

> ```json
> {name:"test"}
> ```

```json
{
  "name": "test",
  "id": 64476498778964,
}
```

## /api/server/{serverID}/{categoryID}

### PUT

> ```json
> {name:"test"}
> ```

```json
{
  "name": "test",
  "id": 64476498778964,
}
```

### DELETE

```json
{
  "id": 64476498778964
}
```



## /api/server/{serverID}/{categoryID}/channels

### GET

```json
[{
    "channels": [
        {
      		"name": "test",
    		"type": 0,
      		"id": 64476498778964
    	},
    	{
      		"name": "test",
      		"type": 0,
      		"id": 64476498778964
    	}
	]
}]
```

### POST 

> ```json
> {name:"test", "type": 1}
> ```

```json
{
  "name": "test",
  "type": 0,
  "id": 64476498778964,
  "created": true
}
```

## /api/server/{serverID}/members

### GET

```json
[
  {
    "id": 64476498778964,
    "username": "azerty",
    "code": "6654",
    "logoUrl": "logo/64476498778964/azeza-54654-azez.png"
  },
  {
    "id": 64476498778964,
    "username": "azerty",
    "code": "6654",
    "logoUrl": "logo/64476498778964/azeza-54654-azez.png"
  }
]
```
## /api/server/{serverID}/voice

### GET

```json
{
    "6696796910738472961": [
        {
            "id": "6688504720857759744",
            "username": "azerty",
            "logoUrl": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png"
        },
        {
            "id": "6688506771658506240",
            "username": "azerty",
            "logoUrl": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png"
        }
    ],
    "6696112909941997568": [
        {
            "id": "6688954523106410496",
            "username": "azerty",
            "logoUrl": "/logo/default.png"
        },
        {
            "id": "6694998730271096832",
            "username": "aa",
            "logoUrl": "/logo/default.png"
        }
    ]
}
```

## 

## /api/server/{serverID}/members/{userID}

### GET

```json
{
    "username": "azerty",
    "code": 6565,
    "userId": 64476498778964,
    "logoUrl": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png"
}
```

### POST

> ```json
> {"role": 1|0}
> ```

```json
{
    "id":64476498778964
}
```

## /api/server/{serverID}/logo

### GET

```json
{
    "logoUrl": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png"
}
```

### PUT

> ```json
> {"logo": data}
> ```

```json
{
    "logoUrl": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png",
    "updated": true
}
```

## /api/server/{serverID}/bans

### GET

```json
[
	{
		"id": 64476498778964,
		"username": "azerty",
		"userCode": 6565,
		"logoUrl": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png"
	}
]
```

## /api/server/{serverID}/bans/{userID}

### POST

```json
{
	"id": 64476498778964,
    "username": "azerty",
	"userCode": 6565
}
```

### DELETE

```json
{
	"id": 64476498778964
}
```

## /api/server/{serverID}/invite

### GET

```json
[
    {
        "invite": "3ybKGe"
    },
    {
        "invite": "kDlLGe"
    },
    {
        "invite": "KUhMGe"
    }
]
```

### POST

```json
{
    'invite': 'KUhMGe'
}
```

### DELETE

> ```json
> {"invite": 'KUhMGe'}
> ```

```json
{
    'invite': 'KUhMGe'
}
```

## /api/server/{serverID}/invite/all

### GET 

```json
[
    {
        "invite": 'KUhMGe'
    	'user': 64476498778964,
        'username': 'azerty'
        'userCode': '5646',
        'logoUrl': '/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png'
    }
]
```

# Channels

## /api/channels/{serverid}/{channelID}

### GET

```json
{
  "name": "test",
  "type": 0,
  "id": 64476498778964
}
```
### PUT

> ```json 
> {"id": 64476498778964, "name":"newname"}
> ```

```json
{
	"id": 64476498778964, 
    "name":"newname",
    "edited": true
}
```
### DELETE
```json
{
	"id": 64476498778964, 
    "name":"newname",
    "deleted": true
}
```

## /api/channels/{serverID}/{channelID}/messages

[message channel, type=0]

### GET 

> ```json
> {limit:  50 (max 500)}
> ```

```json
[
  {
    "id": 64476498778964,
    "authorId": 64476498778964,
    "username": "azertty",
    "userLogo": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png",
    "date": 1565516545652,
    "content": "leleleel"
  },
  {
    "id": 64476498778964,
    "authorId": 64476498778964,
    "username": "azertty",
    "userLogo": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png",
    "date": 1565516545652,
    "content": "leleleel"
  },
  {
    "id": 64476498778964,
    "authorId": 64476498778964,
    "username": "azertty",
    "userLogo": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png",
    "date": 1565516545652,
    "content": "leleleel"
  },
  {
    "id": 64476498778964,
    "authorId": 64476498778964,
    "username": "azertty",
    "userLogo": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png",
    "date": 1565516545652,
    "content": "leleleel"
  }
]
```
### POST 

>```json
>{content:  "leleleel"}
>```

```json
{
  "id": 64476498778964,
  "server":64476498778964,
  "channelId": 64476498778964,
  "content": "leleleel"
}
```

## /api/channels/{serverID}/{channelID}/{messageID}

### PUT 

> ```json
> {id:  64476498778964, content: "Leleleleazeraze"}
> ```

```json
{
  "id": 64476498778964,
  "content": "leleleel",
  "newContent": "Leleleleazeraze,
  "edited": true,
  "author": 64476498778964
}
```

### DELETE

> ```json
> {id:  64476498778964}
> ```

```json
{
  "id": 64476498778964,
  "author": 64476498778964,
  "deleted": true
}
```

## /api/channels/{serverID}/{channelID}/voice 

### GET

[voice channel, type=1]

```json
{
  "id": 64476498778964,
  "connected": [
      {"id": 64476498778964, "username": "azertty", "logoUrl": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png"},
      {"id": 64476498778964, "username": "aze", "logoUrl": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png"},
      {"id": 64476498778964, "username": "azertty", "logoUrl": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png"},
      {"id": 64476498778964, "username": "azertty", "logoUrl": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png"},
      {"id": 64476498778964, "username": "azertty", "logoUrl": "/logo/6688506771658506240/f400b1d1-b684-4cad-babf-585826ef01a9.png"}
  ]
}
```

## /api/channels/{serverID}/{channelID}/voice/connect

### GET

```json
{
	"serverIp": "ipaddress",
	"serverPort": "serverport",
	"nodeId": 1,
    "serverId": 64476498778964
}
```

