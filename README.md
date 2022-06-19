
Call

[Get All Calls]   GET        localhost:3000/api/v1/call
[Get One Call]	  GET        localhost:3000/api/v1/call/:id

[Create Call]     POST       localhost:3000/api/v1/call
[Update Call]     PUT        localhost:3000/api/v1/call/:id
[Delete Call]     DELETE     localhost:3000/api/v1/call:id

********************************************************************************

Agent

[Get All Agents]    GET         localhost:3000/api/v1/agent
[Get One Agent]     GET         localhost:3000/api/v1/agent/:id

[Create Agent]      POST        localhost:3000/api/v1/agent
[Update Agent]      PUT         localhost:3000/api/v1/agent/:id
[Delete Agent]      DELETE      localhost:3000/api/v1/agent/:id

********************************************************************************

Master

[Get All Master]      GET          localhost:3000/api/v1/master
[Get One Master]      GET          localhost:3000/api/v1/master/:id

[Create Master]       POST         localhost:3000/api/v1/master
[Update Master]       PUT          localhost:3000/api/v1/master/:id
[Delete Master]       DELETE       localhost:3000/api/v1/master/:id

********************************************************************************

Report

Agent

[Agent]             GET		localhost:3000/api/v1/reports/agent
[Calls of Agent]    GET		localhost:3000/api/v1/reports/agent/calls
[Call of Agent]     GET		localhost:3000/api/v1/reports/agent/calls/:id

Master

[Master]                          GET		localhost:3000/api/v1/reports/master
[Agents of Master]                GET		localhost:3000/api/v1/reports/master/agents
[Agent of Master]                 GET		localhost:3000/api/v1/reports/master/agents/:agentId
[Calls from Agent of Master]      GET		localhost:3000/api/v1/reports/master/agents/:agentId/calls
[Call from Agent of Master]       GET		localhost:3000/api/v1/reports/master/agents/:agentId/calls/:id

********************************************************************************

Lager
[Master Lager]       GET localhost:3000/api/v1/lagers

Result
@private access Admin
[Add Pout Tee]	POST 	localhost:3000/api/v1/result

********************************************************************************

Authatication

[Register]         POST       localhost:3000/api/v1/auth/register
[Login User]       POST    		localhost:3000/api/v1/auth/login
[Get Me Data]      GET      	localhost:3000/api/v1/auth/me
[Reset Password]   PUT      	localhost:3000/api/v1/auth/resetpassword/:id
