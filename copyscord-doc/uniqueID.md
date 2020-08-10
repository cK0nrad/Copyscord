My uniqueID time based system is like the Discord's one.

Unique, ID is represented by 63 bit, here's an example

> **6672832625389934592**

In binary, it's :

> **10111001001101010101001111010110010101000 00000100011 11111111111**

Where bits:

**63 => 22** represent the timestamps (10111001001101010101001111010110010101000 = 1590927273128)

**22 => 11** represent the server API ID (00000100011 = 35,	35th server,	max=2047)

**11 => 0** represent auto incrementing ID (111111111111=2047,	last id)