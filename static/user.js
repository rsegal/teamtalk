function User(nArg) {
	this.name = nArg;
	/* 
	a user is in zero or more groups, keyed by group.name 
	each group contains a list of 
	expected use case is < 3 simultaneous groups
	*/
	this.groups = {}; 
	/* 
	a user is in zero or more projects, keyed by project.name 
	expected use case is < 5 simultaneous projects
	*/
	this.projects = {};
	/*
	a user is in zero or more conversations, keyed by conversation.name
	expected use case is < 30 active conversations
	*/
	this.conversations = {};
}